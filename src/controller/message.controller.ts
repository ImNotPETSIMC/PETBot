import { fileTypeFromBuffer } from "file-type";
import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import MessageService from "../service/message.service";
import { MessageRemoveRequestSchema, MessageSearchRequestSchema, MessageUpdateRequestSchema } from "../schemas/message.schemas";
import { handleZodIssues } from "../helper/handleZodIssues";

export class MessageController {
  public async remove(message: Zod.infer<typeof MessageRemoveRequestSchema>) {
    const messageService = new MessageService();

    try {
      const result = MessageRemoveRequestSchema.safeParse(message);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await messageService.remove(data);

      return {
        embeds: [new Embed("🗑️ - Remotion Completed", response.id + " deleted.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")]
        };
      }
    }
  };

  public async update(message: Zod.infer<typeof MessageUpdateRequestSchema>) {
    const messageService = new MessageService();
    try {
      const result = MessageUpdateRequestSchema.safeParse(message);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await messageService.update(data);

      return {
        embeds: [new Embed("✅ - Success", response.id + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")]
        };
      }
    }
  };

  public async search(message: Zod.infer<typeof MessageSearchRequestSchema>) {

    const messageService = new MessageService();

    try {
      const result = MessageSearchRequestSchema.safeParse(message);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await messageService.search(data);

      const registers = await Promise.all(response.data.map(async (data: any) => {
        const message = { ...data };
        const description = `
          🔒 ID da Mensagem - ${message.id}\n
          👤 Nome - ${message.name}\n
          ✉️ Email para Contato - ${message.email}\n
          📝 Conteúdo - ${message.content}\n
          📬 Respondida - ${message.answered ? "✅" : "❌"}`;

        const embed = new Embed(message.name, description, "2E8598");

        return { embeds: [embed] };
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