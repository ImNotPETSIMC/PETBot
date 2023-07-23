import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";
import { Project } from "../classes";

export default class ProjectService {
    public async register(project: Project) {
        try {
            if(!isValidURL(project.photo_url)) throw new ValidationExceptionError(400, "Bad Request: Not Valid Photo URL"); 
            
            const name = normalizeString(project.name, "name");
            const collection = "projects";
            const collectionDocRef = doc(firebaseDB, collection, normalizeString(project.name, "name"));
            const docRef = doc(firebaseDB, collection, name);
            const snap = await getDoc(docRef);

            if(snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + name + " - Já Cadastrado"); 
            
            await setDoc(collectionDocRef, { 
                name: name,
                photo_url: project.photo_url,
                description: project.description,
                status: project.status
            });
            
            return {
                data: name,
                collection: collection
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async remove(name: string) {
        try {
            const requestRef = { name: normalizeString(name, "name") };
            const collection = "projects";
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);
        
            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 
           
            await deleteDoc(docRef);
            
            return {
                name: snap.data().name
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async status(name: string, status: string) {
        try {
            const requestRef = { name: normalizeString(name, "name"), status: status };
            const collection = "projects";
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.name + " - Não Encontrado"); 

            await setDoc(docRef, { 
                status: requestRef.status,
            }, { merge: true });

            return {
                name: snap.data().name,
                status: requestRef.status
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async update(name: string, attribute: string, data: string) {
        try {
            const requestRef = { name: normalizeString(name, "name"), attribute: attribute, data: data };
            const collection = "projects";
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.name + " - Não Encontrado"); 
            if(attribute.includes("_url") && !isValidURL(data)) throw new ValidationExceptionError(400, "Bad Request: Not Valid URL"); 
            
            await setDoc(docRef, { 
                [requestRef.attribute]: requestRef.data,
            }, { merge: true });

            return {
                name: snap.data().name,
                attribute: requestRef.attribute
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async search(name: string) {
        try {
            const requestRef = { name: normalizeString(name, "name") }
            const collection = "projects";
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);
            const data = snap.data()!;
            
            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 
            const project = new Project(data.name, data.photo_url, data.description, data.status);
            
            return {
                data: project
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
}