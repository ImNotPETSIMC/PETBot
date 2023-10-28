import Axios from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { firebaseDB } from "../firebaseConfig";
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";
import { Member } from "../classes";
import { prisma } from "../prismaConfig";

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
            const matricula = normalizeString(member.matricula, "matricula");
            const base64Photo = Buffer.from(response.data).toString('base64');

            await prisma.member.create({
                data:{
                    name: name,
                    matricula: matricula,
                    base64Photo: base64Photo,
                    status: member.status,
                    email: member.email,
                    github_url: member.github_url,
                    instagram_url: member.instagram_url,
                    linkedin_url: member.linkedin_url,
                    lattes_url: member.lattes_url, 
                    admission_year: member.admission_year,
                    member_projects: []
                }
            });
            
            return {
                data: name + " - " + member.matricula,
                collection: member.status + "s"
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2002") throw new ValidationExceptionError(409, "Bad Request: " + member.matricula + " - Já Cadastrado")
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async remove(matricula: string) {
        const requestRef = {matricula: normalizeString(matricula, "matricula")}

        try {
            
            const member = await prisma.member.delete({
                where : {
                    matricula: requestRef.matricula
                }
            });
        
            return {
                name: member.name,
                matricula: member.matricula
            };

        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2025") throw new ValidationExceptionError(404, requestRef.matricula + " - Member not found");
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async update(matricula: string, attribute: string, data: string) {
        const requestRef = { matricula: normalizeString(matricula, "matricula"), attribute: attribute, data: data };
        
        try {
            if(attribute.includes("_url") && !isValidURL(data)) throw new ValidationExceptionError(400, "Bad Request: Not Valid URL"); 
            if(attribute.includes("admission_year")) if(isNaN(Number(data))) throw new ValidationExceptionError(400, "Bad Request: Not Valid Admission Year"); 
            if(attribute === "matricula") requestRef.data = normalizeString(data, "matricula");
            if(attribute === "photo_url") {
                const response = await Axios.get(data, {responseType: 'arraybuffer'});
                
                if(response.headers["content-length"] > 943718) {
                    throw new ValidationExceptionError(413, "File over 0.9MiB");
                }
    
                requestRef.data = Buffer.from(response.data).toString('base64');
                requestRef.attribute = "base64Photo";
            };

            const member = await prisma.member.update({
                where: {
                    matricula: requestRef.matricula
                },
                data: {
                  [requestRef.attribute]: requestRef.data,
                },
            })

            
            return {
                name: member.name,
                matricula: member.matricula
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async status(matricula: string, status: string) {
        try {
            const requestRef = { matricula: normalizeString(matricula, "matricula"), status: status };
            const docRef = doc(firebaseDB, "members", requestRef.matricula);
            const snap = await getDoc(docRef);

            if(!snap.exists()) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.matricula + " - Não Encontrado"); 
            await setDoc(docRef, { 
                status: requestRef.status,
            }, { merge: true });
            
            if(status.includes("Ex")){
                const pmDocsSnap = await getDocs(collection(firebaseDB, "members_projects"));
                pmDocsSnap.docs.map( async (doc) => { 
                    await updateDoc(doc.ref, {
                        [ requestRef.matricula ]: deleteField()
                    })
                });
            };
            
            return {
                name: snap.data().name,
                matricula: snap.data().matricula,
                status: requestRef.status
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async search(matricula: string) {
        const requestRef = {matricula: normalizeString(matricula, "matricula")}
        
        try {
            const data = await prisma.member.delete({
                where : {
                    matricula: requestRef.matricula
                }
            });
            
            const member = new Member(data.name, data.base64Photo, data.matricula, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status, []);
            if(!member.projects.length) member.projects.push("🚫")

            return {
                data: member
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2025") throw new ValidationExceptionError(404, requestRef.matricula + " - Member not found");
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };

    public async show(status: string) {
        try {
            const results = await prisma.member.findMany({
                where : {
                    status: status
                }
            });

            const members = results.map((data) => { 
                if(data.status == status) {
                    const member = new Member(data.name, data.base64Photo, data.matricula, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status, data.member_projects);
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