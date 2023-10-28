import { fileTypeFromBuffer } from "file-type";
import { Embed, Member } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import MemberService from "../service/member.service";

export class MemberController {
  public async register(member: Member) {
    const memberService = new MemberService();

    try {
      const response = await memberService.register(member);

      return { 
        embeds: [ new Embed("✅ - Success", response.data + " added to Membros", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async remove(matricula: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.remove(matricula);

      return { 
        embeds: [ new Embed("🗑️ - Remotion Completed", response.matricula + " - " + response.name  + " deleted.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async status(matricula: string, status: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.status(matricula, status);

      return { 
        embeds: [ new Embed("✅ - Success", response.matricula + " - " + response.name +"'s status" + " updated to " + response.status + ".", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async update(matricula: string, attribute: string, data: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.update(matricula, attribute, data);

      return { 
        embeds: [ new Embed("✅ - Success", response.matricula + " - " + response.name +"'s " + attribute + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async search(matricula: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.search(matricula);
      
      const description = `
      👤 Status - ${response.data.status}\n
      📅 Ano de Admissão -  ${response.data.admission_year}\n
      📧 Email - ${response.data.email}\n
      🖥️ Github - [Acessar Github](${response.data.github_url})\n
      📷 Instagram - [Acessar Instagram](${response.data.instagram_url})\n
      💼 LinkedIn - [Acessar LinkedIn](${response.data.linkedin_url})\n
      📚 Lattes - [Acessar Lattes](${response.data.lattes_url})\n
      🛠️ Projetos - ${response.data.projects}`
      
      const embed = new Embed(response.data.matricula + " - " + response.data.name, description, "2E8598");
      const buffer =  Buffer.from(response.data.base64Photo, 'base64');
      const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);

      const file = {
        attachment: buffer, name: response.data.matricula + "." + type
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

  public async show(status: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.show(status);
      const registers = await Promise.all(response.data.map(async (data: any) => { 
        const member = new Member(data.name, data.photo_url, data.matricula, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status, data.projects);
        const description = `
        👤 Status - ${member.status}\n
        📅 Ano de Admissão -  ${member.admission_year}\n
        📧 Email - ${member.email}\n
        🖥️ Github - [Acessar Github](${member.github_url})\n
        📷 Instagram - [Acessar Instagram](${member.instagram_url})\n
        💼 LinkedIn - [Acessar LinkedIn](${member.linkedin_url})\n
        📚 Lattes - [Acessar Lattes](${member.lattes_url})\n
        🛠️ Projetos - ${member.projects}`;
        
        const buffer =  Buffer.from(member.photo_url, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: member.matricula + "." + type }
        const embed = new Embed(member.matricula + " - " + member.name, description, "2E8598",  "attachment://" + file.name );
        
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