import Axios from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { isValidURL } from "../helper/isValidURL";
import { normalizeString } from "../helper/normalizeString";
import { Project } from "../classes";
import { firebaseDB } from "../firebaseConfig";
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { prisma } from "../prismaConfig";

export default class ProjectService {
    public async register(project: Project) {
        const name = normalizeString(project.name, "name");

        try {
            if(!isValidURL(project.photo_url)) throw new ValidationExceptionError(400, "Bad Request: Not Valid Photo URL"); 
            

            const response = await Axios.get(project.photo_url, {responseType: 'arraybuffer'});
            const base64Photo = Buffer.from(response.data).toString('base64');
            
            if(response.headers["content-length"] > 943718) {
                throw new ValidationExceptionError(413, "File over 0.9MiB");
            }

            await prisma.project.create({
                data : {
                    name: name,
                    type: project.type,
                    base64Photo: base64Photo,
                    description: project.description,
                    status: project.status
                }
            })

            return {
                data: name
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2002") throw new ValidationExceptionError(409, "Bad Request: " + name + " - Já Cadastrado")
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async remove(name: string) {
        const requestRef = { name: normalizeString(name, "name") };

        try {
            const project = await prisma.project.delete({
                where : {
                    name: requestRef.name
                }
            });
            
            return {
                name: project.name
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2025") throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async status(name: string, status: string) {
        const requestRef = { name: normalizeString(name, "name"), status: status };
        
        try {
            const project = await prisma.project.update({
                where: {
                    name: requestRef.name
                },
                data: {
                  status: requestRef.status,
                },
            })

            return {
                name: project.name,
                status: requestRef.status
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2025") throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async update(name: string, attribute: string, data: string) {
        const requestRef = { name: normalizeString(name, "name"), attribute: attribute, data: data };
        
        try {
            if(attribute.includes("_url") && !isValidURL(data)) throw new ValidationExceptionError(400, "Bad Request: Not Valid URL"); 

            const project = await prisma.project.update({
                where: {
                    name: requestRef.name
                },
                data: {
                  [requestRef.attribute]: requestRef.data,
                },
            })

            return {
                name: project.name,
                attribute: requestRef.attribute
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.code == "P2025") throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async search(name: string) {
        const requestRef = { name: normalizeString(name, "name") }

        try {
            const project = await prisma.project.findFirst({
                where: {
                    name: requestRef.name
                }
            })

            if(!project) throw new ValidationExceptionError(404, requestRef.name + " - Project not found"); 

            return {
                data: project
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
   
    public async add_member(project: string, member: string) {
        const requestRef = { project: normalizeString(project, "name"), member: normalizeString(member, "matricula") };

        try {   
            const project = await prisma.project.findFirst({
                where: {
                    name: requestRef.project
                }
            })

            const member = await prisma.member.findFirst({
                where : {
                    matricula: requestRef.member
                }
            });

            
            if(!project) throw new ValidationExceptionError(404, requestRef.project + " - Project not found"); 
            if(!member) throw new ValidationExceptionError(404, requestRef.member + " - Member not found");
            if(member.projects.includes(project.name)) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.member + " - Membro Já Cadastrado no Projeto " + requestRef.project);  
            
            const projectRef = member.projects;
            projectRef.push(requestRef.project);

            await prisma.member.update({
                where: {
                    matricula: requestRef.member
                },

                data: {
                    projects: projectRef
                }
            });

            return {
                data: {
                    member: member, 
                    project: project, 
                }
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async remove_member(project: string, member: string) {
        const requestRef = { project: normalizeString(project, "name"), member: normalizeString(member, "matricula") };
        try {   
            const project = await prisma.project.findFirst({
                where: {
                    name: requestRef.project
                }
            })

            const member = await prisma.member.findFirst({
                where : {
                    matricula: requestRef.member
                }
            });

            if(!project) throw new ValidationExceptionError(404, requestRef.project + " - Project not found"); 
            if(!member) throw new ValidationExceptionError(404, requestRef.member + " - Member not found");
            if(!member.projects.includes(project.name)) throw new ValidationExceptionError(400, "Bad Request: " + requestRef.member + " - Membro Não Cadastrado no Projeto " + requestRef.project);  
        
            const projectRef = member.projects;
            const index = projectRef.indexOf(project.name);
            projectRef.splice(index, 1);

            await prisma.member.update({
                where: {
                    matricula: requestRef.member
                },

                data: {
                    projects: projectRef
                }
            });

            return {
                data: {
                    member: member.matricula,
                    member_name: member.name,
                    project: project.name, 
                }
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 

            throw new ValidationExceptionError(400, err); 
        }
    };

    public async show(status: string) {
        try {
            const projects = await prisma.project.findMany({
                where : {
                    status: status
                }
            });

            if(!projects.length) throw new ValidationExceptionError(404,"No projects with status " + status + " found"); 
            
            return {
                data: projects
            };
        } catch(err) { 
            if(err instanceof ValidationExceptionError) throw err;
            if(err.toString()) throw new ValidationExceptionError(400, err.toString()); 
            
            throw new ValidationExceptionError(400, err); 
        }
    };
}