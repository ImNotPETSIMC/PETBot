import { fileTypeFromBuffer } from "file-type";
import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import ProjectService from "../service/project.service";
import { ProjectCreateRequestSchema, ProjectRemoveRequestSchema, ProjectSearchRequestSchema, ProjectUpdateRequestSchema } from "../schemas/project.schemas";
import { handleZodIssues } from "../helper/handleZodIssues";

export class ProjectController {
  public async register(project: Zod.infer<typeof ProjectCreateRequestSchema>) {
    const projectService = new ProjectService();

    try {
      const result = ProjectCreateRequestSchema.safeParse(project);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await projectService.register(data);

      return {
        embeds: [new Embed("✅ - Success", response.data + " added to Projetos", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")]
        };
      }
    }
  };

  public async remove(project: Zod.infer<typeof ProjectRemoveRequestSchema>) {
    const projectService = new ProjectService();

    try {
      const response = await projectService.remove(project);

      return {
        embeds: [new Embed("🗑️ - Remotion Completed", response.name + " deleted.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")]
        };
      }
    }
  };

  public async update(project: Zod.infer<typeof ProjectUpdateRequestSchema>) {
    const projectService = new ProjectService();
    try {
      const response = await projectService.update(project);

      return {
        embeds: [new Embed("✅ - Success", response.name + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")]
        };
      }
    }
  };

  public async search(project: Zod.infer<typeof ProjectSearchRequestSchema>) {

    const projectService = new ProjectService();

    try {
      const response = await projectService.search(project);
      const registers = await Promise.all(response.data.map(async (data: any) => {
        const project = { ...data };
        const description = `
          👤 Status - ${project.status}\n
          📝 Tipo - ${project.type}\n
          📙 Descrição -  ${project.description}`;

        const buffer = Buffer.from(project.photo, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: Date.now() + "." + type };
        const embed = new Embed(project.name, description, "2E8598", "attachment://" + file.name);

        return { embeds: [embed], files: [file] };
      }));

      return {
        data: registers
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          data: [{ embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")] }]
        };
      }
    }
  };
}