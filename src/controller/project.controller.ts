import { Embed, Project } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import ProjectService from "../service/project.service";

export class ProjectController {
  public async register(project: Project) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.register(project);

      return { 
        embeds: [ new Embed("✅ - Success", response.data + " was added to " + response.collection, "279732")]
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

      return { 
        embeds: [ {
          title: embed.title, 
          description: embed.description, 
          color: embed.color,
          thumbnail: { url: response.data.photo_url }
        }]
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
        embeds: [ new Embed("✅ - Success", response.data.member + " - " + response.data.member_name + " was added to " + response.data.project, "279732")]
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

      const embeds = await Promise.all(response.data.map(async (data: any) => { 
        const project = new Project(data.name, data.type, data.photo_url, data.description, data.status);
        
        const description = `
        👤 Status - ${project.status}\n
        📝 Tipo - ${project.type}\n
        📙 Descrição -  ${project.description}
        `;
        
        const embed = new Embed(project.name, description, "E8C342", project.photo_url);
    
        return { ...embed };
      }));

      return { 
        embeds: embeds,
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