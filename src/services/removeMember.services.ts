import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { deleteDoc, doc, getDoc} from "firebase/firestore";
import { normalizeString } from "../helper/normalizeString";

export default class RemoveMemberService {
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
    }
}