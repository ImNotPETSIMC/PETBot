import Axios from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";
import { Member } from "../classes";

export default class MemberService {
    public async register(member: Member) {
        try {
            [ { url: member.photo_url, name: "Photo URL"}, { url: member.github_url, name: "Github URL"}, { url: member.instagram_url, name: "Instagram URL"}, { url: member.linkedin_url, name: "LinkedIn URL"}, { url: member.lattes_url, name: "Lattes URL"}].map((params) => {
                if(!isValidURL(params.url)) throw new ValidationExceptionError(400, "Bad Request: Not Valid " + params.name); 
            });
            
            const response = await Axios.get(member.photo_url, {responseType: 'arraybuffer'});
            
            if(response.headers["content-length"] > 1048576) {
                throw new ValidationExceptionError(413, "File over 1MiB");
            }
            
            const name = normalizeString(member.name, "name");
            const register_code = normalizeString(member.register_code, "register_code");
            const base64Photo = Buffer.from(response.data).toString('base64');
            const collection = "members";
            const collectionDocRef = doc(firebaseDB, collection, register_code);
            const docRef = doc(firebaseDB, collection, register_code);
            const snap = await getDoc(docRef);

            if(snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + register_code + " - Já Cadastrado"); 
            
            await setDoc(collectionDocRef, { 
                name: name,
                register_code: register_code,
                base64Photo: base64Photo,
                status: member.status,
                email: member.email,
                github_url: member.github_url,
                instagram_url: member.instagram_url,
                linkedin_url: member.linkedin_url,
                lattes_url: member.lattes_url, 
                admission_year: member.admission_year
            });
            
            return {
                data: name + " - " + member.register_code,
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
            const requestRef = {name: normalizeString(name, "name")}
            const collection = "members";
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);
            

            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.name + " - Member not found"); 
            await deleteDoc(docRef);
            
            return {
                name: requestRef.name,
                register_code: snap.data().register_code
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async update(name: string, attribute: string, data: string) {
        try {
            const requestRef = { name: normalizeString(name, "name"), data: data };
            const collection = "members";
            const collectionDocRef = doc(firebaseDB, collection, requestRef.name);
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.name + " - Não Encontrado"); 
            if(attribute.includes("_url") && !isValidURL(data)) throw new ValidationExceptionError(400, "Bad Request: Not Valid URL"); 
            if(attribute.includes("admission_year")) if(isNaN(Number(data))) throw new ValidationExceptionError(400, "Bad Request: Not Valid Admission Year"); 
            if(attribute === "register_code") requestRef.data = normalizeString(data, "register_code");
            if(attribute === "photo_url") {
                const response = await Axios.get(data, {responseType: 'arraybuffer'});
                    
                if(response.headers["content-length"] > 1048576) {
                    throw new ValidationExceptionError(413, "File over 1MiB");
                }
    
                requestRef.data = Buffer.from(data).toString('base64');
            };

            await setDoc(collectionDocRef, { 
                [attribute]: requestRef.data,
            }, { merge: true });

            return {
                name: requestRef.name,
                register_code: snap.data().register_code
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
            const collection = "members";
            const collectionDocRef = doc(firebaseDB, collection, requestRef.name);
            const docRef = doc(firebaseDB, collection, requestRef.name);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.name + " - Não Encontrado"); 

            await setDoc(collectionDocRef, { 
                status: requestRef.status,
            }, { merge: true });

            return {
                name: requestRef.name,
                register_code: snap.data().register_code,
                status: requestRef.status
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async search(register_code: string) {
        try {
            const requestRef = {register_code: normalizeString(register_code, "register_code")}
            const collection = "members";
            const docRef = doc(firebaseDB, collection, requestRef.register_code);
            const snap = await getDoc(docRef);
            const data = snap.data()!;
            
            
            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.register_code + " - Member not found"); 
            const member = new Member(data.name, data.base64Photo, data.register_code, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status);
            
            return {
                data: member
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
}