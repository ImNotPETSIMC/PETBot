import Axios from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";

export default class UpdateMemberService {
    public async updateMember(name: string, attribute: string, data: string) {
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
    }
}