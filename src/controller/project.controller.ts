import { fileTypeFromBuffer } from "file-type";
import { Embed, Project } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import ProjectService from "../service/project.service";

export class ProjectController {
  public async register(project: Project) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.register(project);

      return { 
        embeds: [ new Embed("✅ - Success", response.data + " added to Projetos", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async remove(name: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.remove(name);

      return { 
        embeds: [ new Embed("🗑️ - Remotion Completed", response.name + " deleted.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async status(name: string, status: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.status(name, status);

      return { 
        embeds: [ new Embed("✅ - Success", response.name + " - " + response.name +"'s status" + " updated to " + response.status + ".", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async update(name: string, attribute: string, data: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.update(name, attribute, data);

      return { 
        embeds: [ new Embed("✅ - Success", response.name + "'s " + attribute + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async search(name: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.search(name);
      
      const description = `
      👤 Status - ${response.data.status}\n
      📝 Tipo - ${response.data.type}\n
      📙 Descrição -  ${response.data.description}
      `;
      
      const embed = new Embed(response.data.name, description, "E8C342");
      const buffer =  Buffer.from(response.data.base64Photo, 'base64');
      const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);

      const file = {
        attachment: buffer, name: response.data.name + "." + type
      }

      return { 
        embeds: [ {
          title: embed.title, 
          description: embed.description, 
          color: embed.color,
          thumbnail: { url: "attachment://" + file.name }
        }],
        files: [ file ]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async add_member(project: string, member: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.add_member(project, member);

      return { 
        embeds: [ new Embed("✅ - Success", response.data.member.matricula + " - " + response.data.member.name + "  added to " + response.data.project.name, "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async remove_member(project: string, member: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.remove_member(project, member);

      return { 
        embeds: [ new Embed("🗑️ - Remotion Completed", response.data.member + " - " + response.data.member_name + " was removed from " + response.data.project, "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async show(status: string) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.show(status);
      const registers = await Promise.all(response.data.map(async (data: any) => { 
        const project = new Project(data.name, data.type, data.base64Photo, data.description, data.status);
        const description = `
        👤 Status - ${project.status}\n
        📝 Tipo - ${project.type}\n
        📙 Descrição -  ${project.description}
        `;

        const buffer =  Buffer.from(project.photo_url, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: project.name + "." + type }
        const embed = new Embed(project.name, description, "E8C342",  "attachment://" + file.name);
    
        return { embed, file };
      }));

      const embeds = registers.map(register => register.embed);
      const files = registers.map(register => register.file);

      return { 
        embeds: embeds,
        files: files
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]
        };
      }
    }
  };
}