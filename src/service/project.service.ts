import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";
import { Project } from "../classes";

export default class ProjectService {
    public async register(project: Project) {
        try {
            if(!isValidURL(project.photo_url)) throw new ValidationExceptionError(400, "Bad Request: Not Valid Photo URL"); 
            
            const name = normalizeString(project.name, "name");
            const collection = "projects";
            const docRef = doc(firebaseDB, collection, name);
            const snap = await getDoc(docRef);

            if(snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + name + " - Já Cadastrado"); 
            
            await setDoc(docRef, { 
                name: name,
                type: project.type,
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
            const projectsDocRef = doc(firebaseDB, "projects", requestRef.name);
            const projectsMembersDocRef = doc(firebaseDB, "members_projects", requestRef.name);

            const snap = await getDoc(projectsDocRef);
        
            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 
           
            await deleteDoc(projectsDocRef);
            await deleteDoc(projectsMembersDocRef);
            
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
            const project = new Project(data.name, data.type, data.photo_url, data.description, data.status);
            
            return {
                data: project
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
   
    public async add_member(project: string, member: string) {
        try {   
            const requestRef = { project: normalizeString(project, "name"), member: normalizeString(member, "register_code") };
            const collectionRef = "members_projects";
            
            const projectDocRef = doc(firebaseDB, "projects", requestRef.project);
            const memberDocRef = doc(firebaseDB, "members", requestRef.member);
            const docRef = doc(firebaseDB, collectionRef, requestRef.project);
            
            const projectSnap = await getDoc(projectDocRef);
            const memberSnap = await getDoc(memberDocRef);
            const snap = await getDoc(docRef);
            const register = snap.get(requestRef.member);

            if(!projectSnap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.project + " - Projeto Não Encontrado"); 
            if(!memberSnap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.member + " - Membro Não Encontrado");  
            if(register) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.member + " - Membro Já Cadastrado no Projeto " + requestRef.project);  

            await setDoc(docRef, { 
                [ requestRef.member ]: true,
            },  { merge: true });
            
            return {
                data: {
                    member: requestRef.member, 
                    member_name: memberSnap.data().name,
                    project: requestRef.project, 
                }
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async remove_member(project: string, member: string) {
        try {   
            const requestRef = { project: normalizeString(project, "name"), member: normalizeString(member, "register_code") };
            const collectionRef = "members_projects";
            
            const projectDocRef = doc(firebaseDB, "projects", requestRef.project);
            const memberDocRef = doc(firebaseDB, "members", requestRef.member);
            const docRef = doc(firebaseDB, collectionRef, requestRef.project);
            
            const projectSnap = await getDoc(projectDocRef);
            const memberSnap = await getDoc(memberDocRef);
            const snap = await getDoc(docRef);
            const register = snap.get(requestRef.member);

            if(!projectSnap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.project + " - Projeto Não Encontrado"); 
            if(!memberSnap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.member + " - Membro Não Encontrado");  
            if(!register) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.member + " - Membro Não Cadastrado no Projeto " + requestRef.project);  

            await setDoc(docRef, { 
                [ requestRef.member ]: deleteField(),
            },  { merge: true });
            
            return {
                data: {
                    member: requestRef.member, 
                    member_name: memberSnap.data().name,
                    project: requestRef.project, 
                }
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async show(status: string) {
        try {
            const docRef = collection(firebaseDB, "projects");
            const snap = await getDocs(docRef);
            const results = snap.docs.map((doc) => (doc.data()));
            const projects = results.map((data) => { 
                if(data.status == status) {
                    const project = new Project(data.name, data.type, data.photo_url, data.description, data.status);
                    return { ...project };
                }
            }).filter( project => { if (project) return project });

            if(!projects.length) throw new ValidationExceptionError(404,"No projects with status " + status + " found"); 
            
            return {
                data: projects
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
}