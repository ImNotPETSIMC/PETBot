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
        embeds: [ new Embed("🗑️ - Remotion Completed - ", response.name + " deleted.", "279732")]
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
      
      const embed = new Embed(response.data.name, description, "2E8598");

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
}