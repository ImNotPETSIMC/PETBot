import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { doc, getDoc} from "firebase/firestore";
import { normalizeString } from "../helper/normalizeString";
import { Member } from "../classes";

export default class SearchMemberService {
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
    }
}