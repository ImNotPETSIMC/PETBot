import Axios, { AxiosError } from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { normalizeString } from "../helper/normalizeString";
import { prisma } from "../prismaConfig";
import { MemberCreateRequestSchema, MemberSearchRequestSchema, MemberUpdateRequestSchema } from "../schemas/member.schemas";
import { config } from "../config";

export default class MemberService {
    public async register(member: Zod.infer<typeof MemberCreateRequestSchema>) {
        try {
            const { data } = await Axios.post(config.API_URL + '/member', { ...member })
            
            return {
                data: data.name + " - " + data.matricula,
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
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

    public async update(member: Zod.infer<typeof MemberUpdateRequestSchema>) {
        try {
            const { data } = await Axios.put(config.API_URL + '/member', { data: {...member}, role: "admin" })
            
            return {
                name: data.data.name,
                matricula: data.data.matricula
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async status(member: Zod.infer<typeof MemberUpdateRequestSchema>) {       
        try {
            const { data } = await Axios.put(config.API_URL + '/member', { ...member })
            
            return {
                name: data.name,
                matricula: data.matricula,
                status: data.status
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
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

            if(!data.toString().length) throw new ValidationExceptionError(404,"No members with status " + status + " found"); 
            
            return {
                data: members
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };

    public async show(status: string) {
        try {
            const { data } = await Axios.get(config.API_URL + '/member', { params: { status: "aa"}})

            const members = data.data.members.map((data) => { 
                if(!data.projects.length) data.projects.push("🚫")     
                return { ...data };
            });

            if(!members.toString().length) throw new ValidationExceptionError(404,"No members with status " + status + " found"); 
            
            return {
                data: members
            };
        } catch(err) { 

            if (err instanceof AxiosError) { 
                if(err.response) throw new ValidationExceptionError(422, err.response?.data.errors[0].message)
                throw new ValidationExceptionError(422, err.message) 
            }
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
}