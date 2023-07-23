import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { normalizeString } from "../helper/normalizeString";

export default class StatusMemberService {
    public async statusMember(name: string, status: string) {
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
    }
}