import { fileTypeFromBuffer } from "file-type";
import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import NewsService from "../service/news.service";
import { NewsCreateRequestSchema, NewsRemoveRequestSchema, NewsSearchRequestSchema, NewsUpdateRequestSchema } from "../schemas/news.schemas";
import { handleZodIssues } from "../helper/handleZodIssues";

export class NewsController {
  public async register(news: Zod.infer<typeof NewsCreateRequestSchema>) {
    const newsService = new NewsService();

    try {
      const result = NewsCreateRequestSchema.safeParse(news);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await newsService.register(data);

      return {
        embeds: [new Embed("✅ - Success", response.data + " added to News", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return {
          embeds: [new Embed("❌ Error - " + error.code, error.message, "9F2727")]
        };
      }
    }
  };

  public async remove(news: Zod.infer<typeof NewsRemoveRequestSchema>) {
    const newsService = new NewsService();

    try {
      const result = NewsRemoveRequestSchema.safeParse(news);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await newsService.remove(data);

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

  public async update(news: Zod.infer<typeof NewsUpdateRequestSchema>) {
    const newsService = new NewsService();
    try {
      const result = NewsUpdateRequestSchema.safeParse(news);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await newsService.update(data);

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

  public async search(news: Zod.infer<typeof NewsSearchRequestSchema>) {

    const newsService = new NewsService();

    try {
      const result = NewsUpdateRequestSchema.safeParse(news);

      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message);

      const { data } = result;

      const response = await newsService.search(data);
      const registers = await Promise.all(response.data.map(async (data: any) => {
        const news = { ...data };
        const description = `
          👤 ID - ${news.id}\n
          📝 Conteúdo - ${news.content}`;

        const buffer = Buffer.from(news.photo, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: Date.now() + "." + type };
        const embed = new Embed(news.name, description, "2E8598", "attachment://" + file.name);

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