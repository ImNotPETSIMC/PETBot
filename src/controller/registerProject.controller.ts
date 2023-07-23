import { Embed, Project } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import RegisterProjectService from "../services/registerProject.services";

export class RegisterProjectController {
  public async handle(project: Project) {
    const registerProjectService = new RegisterProjectService();

    try {
      const response = await registerProjectService.registerProject(project);

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
  }
}