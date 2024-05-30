import Axios, { AxiosError } from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { MemberCreateRequestSchema, MemberRemoveRequestSchema, MemberSearchRequestSchema, MemberUpdateRequestSchema } from "../schemas/member.schemas";
import { config } from "../config";

export default class MemberService {
    public async register(member: Zod.infer<typeof MemberCreateRequestSchema>) {
        try {
            const { data } = await Axios.post(config.API_URL + '/member', { data: {...member}, role: "admin" })
            
            return {
                data: data.name + " - " + data.matricula,
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async remove(member: Zod.infer<typeof MemberRemoveRequestSchema>) {
        try {
            const { data } = await Axios.delete(config.API_URL + '/member', { data: { data: member, role: "admin" }})
            
            return {
                name: data.data.name,
                matricula: data.data.matricula
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async update(member: Zod.infer<typeof MemberUpdateRequestSchema>) {
        try {
            const { data } = await Axios.put(config.API_URL + '/member', { data: {...member}, role: "admin" })
            
            return {
                name: data.data.name,
                matricula: data.data.matricula
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async search(member: Zod.infer<typeof MemberSearchRequestSchema>) {    
        try {
            const { data } = await Axios.get(config.API_URL + '/member', { params: { ...member }})

            const members = data.data.members.map((data) => { 
                if(!data.projects.length) data.projects.push("🚫")     
                return { ...data };
            });

            if(!members.toString().length) throw new ValidationExceptionError(404,"No members found"); 
            
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