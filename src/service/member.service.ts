import Axios from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
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
            
            if(response.headers["content-length"] > 943718) {
                throw new ValidationExceptionError(413, "File over 0.9MiB");
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

    public async remove(register_code: string) {
        try {
            const requestRef = {register_code: normalizeString(register_code, "register_code")}
            const membersDocRef = doc(firebaseDB, "members", requestRef.register_code);
            const pmDocRef = collection(firebaseDB, "members_projects");
            const snap = await getDoc(membersDocRef);
            const pmSnap = await getDocs(pmDocRef);
            
            
            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.register_code + " - Member not found"); 
            await deleteDoc(membersDocRef);
            pmSnap.docs.map( async (doc) => { 
                await updateDoc(doc.ref, {
                    [ requestRef.register_code ]: deleteField()
                })
            });
            
            return {
                name: snap.data().name,
                register_code: snap.data().register_code
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async update(register_code: string, attribute: string, data: string) {
        try {
            const requestRef = { register_code: normalizeString(register_code, "register_code"), attribute: attribute, data: data };
            const collection = "members";
            const docRef = doc(firebaseDB, collection, requestRef.register_code);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.register_code + " - Não Encontrado"); 
            if(attribute.includes("_url") && !isValidURL(data)) throw new ValidationExceptionError(400, "Bad Request: Not Valid URL"); 
            if(attribute.includes("admission_year")) if(isNaN(Number(data))) throw new ValidationExceptionError(400, "Bad Request: Not Valid Admission Year"); 
            if(attribute === "register_code") requestRef.data = normalizeString(data, "register_code");
            if(attribute === "photo_url") {
                const response = await Axios.get(data, {responseType: 'arraybuffer'});
                    
                if(response.headers["content-length"] > 943718) {
                    throw new ValidationExceptionError(413, "File over 0.9MiB");
                }
    
                requestRef.data = Buffer.from(response.data).toString('base64');
                requestRef.attribute = "base64Photo";
            };

            await setDoc(docRef, { 
                [requestRef.attribute]: requestRef.data,
            }, { merge: true });

            return {
                name: snap.data().name,
                register_code: snap.data().register_code
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async status(register_code: string, status: string) {
        try {
            const requestRef = { register_code: normalizeString(register_code, "register_code"), status: status };
            const docRef = doc(firebaseDB, "members", requestRef.register_code);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.register_code + " - Não Encontrado"); 
            await setDoc(docRef, { 
                status: requestRef.status,
            }, { merge: true });
            
            if(status == "Ex-Petiano"){
                const pmDocsSnap = await getDocs(collection(firebaseDB, "members_projects"));
                pmDocsSnap.docs.map( async (doc) => { 
                    await updateDoc(doc.ref, {
                        [ requestRef.register_code ]: deleteField()
                    })
                });
            };
            
            return {
                name: snap.data().name,
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
            const docRef = doc(firebaseDB, "members", requestRef.register_code);
            const pmDocRef = collection(firebaseDB, "members_projects");
          
            const snap = await getDoc(docRef);
            const pmSnap = await getDocs(pmDocRef);
            
            const data = snap.data()!;
            
            if(!snap.exists()) throw new ValidationExceptionError(404, requestRef.register_code + " - Member not found"); 
            const member = new Member(data.name, data.base64Photo, data.register_code, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status, []);      
            pmSnap.docs.map((doc) => { if (doc.get(requestRef.register_code)) member.projects.push(" " + doc.id) });
            if(!member.projects.length) member.projects.push("🚫")
            
            return {
                data: member
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };

    public async show(status: string) {
        try {
            const docRef = collection(firebaseDB, "members");
            const pmDocRef = collection(firebaseDB, "members_projects");

            const snap = await getDocs(docRef);
            const pmSnap = await getDocs(pmDocRef);

            const results = snap.docs.map((doc) => (doc.data()));
            const members = results.map((data) => { 
                if(data.status == status) {
                    const member = new Member(data.name, data.base64Photo, data.register_code, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status, []);
                    pmSnap.docs.map((doc) => { if (doc.get(data.register_code)) member.projects.push(" " + doc.id) });
                    if(!member.projects.length) member.projects.push("🚫")     
                    return { ...member };
                }
            });

            if(!members.toString().length) throw new ValidationExceptionError(404,"No members with status " + status + " found"); 
            
            return {
                data: members
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
}