import Axios from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";
import { Member } from "../classes";

export default class RegisterMemberService {
    public async registerMember(member: Member) {
        try {
            const collection = "members";
            const collectionDocRef = doc(firebaseDB, collection, normalizeString(member.name, "name"));
            const name = normalizeString(member.name, "name");
            
            
            [ { url: member.photo_url, name: "Photo URL"}, { url: member.instagram_url, name: "Instagram URL"}, { url: member.linkedin_url, name: "LinkedIn URL"}, { url: member.lattes_url, name: "Lattes URL"}].map((params) => {
                if(!isValidURL(params.url)) throw new ValidationExceptionError(400, "Bad Request: Not Valid " + params.name); 
            });
            
            const response = await Axios.get(member.photo_url, {responseType: 'arraybuffer'});
            
            if(response.headers["content-length"] > 1048576) {
                throw new ValidationExceptionError(413, "File over 1MiB");
            }
            
            const base64Photo = Buffer.from(response.data).toString('base64');
            
            const docRef = doc(firebaseDB, collection, name);
            const snap = await getDoc(docRef);

            if(snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + name + " - Já Cadastrado"); 
            
            await setDoc(collectionDocRef, { 
                name: name,
                register_code: normalizeString(member.register_code, "register_code"),
                base64Photo: base64Photo,
                status: member.status,
                email: member.email,
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
    }
}