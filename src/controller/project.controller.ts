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
}