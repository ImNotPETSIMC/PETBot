import { fileTypeFromBuffer } from "file-type";
import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import SearchMemberService from "../services/searchMember.services";
export class SearchMemberController {
  public async handle(name: string) {
    const searchMemberService = new SearchMemberService();

    try {
      const response = await searchMemberService.search(name);

      const description = `
      👤 Status - ${response.data.status}\n
      📅 Ano de Admissão -  ${response.data.admission_year}\n
      📧 Email - ${response.data.email}\n
      🖥️ Github - [Acessar Github](${response.data.github_url})\n
      📷 Instagram - [Acessar Instagram](${response.data.instagram_url})\n
      💼 LinkedIn - [Acessar LinkedIn](${response.data.linkedin_url})\n
      📚 Lattes - [Acessar Lattes](${response.data.lattes_url})`;
      
      const embed = new Embed(response.data.name + " - " + response.data.register_code, description, "2E8598");
      const buffer =  Buffer.from(response.data.photo_url, 'base64');
      const type = await fileTypeFromBuffer(buffer).then(response => response!.ext)

      const file = {
        attachment: buffer, name: response.data.register_code + "." + type
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
  }
}