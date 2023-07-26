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

  public async remove(register_code: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.remove(register_code);

      return { 
        embeds: [ new Embed("🗑️ - Remotion Completed", response.register_code + " - " + response.name  + " deleted.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async status(register_code: string, status: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.status(register_code, status);

      return { 
        embeds: [ new Embed("✅ - Success", response.register_code + " - " + response.name +"'s status" + " updated to " + response.status + ".", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async update(register_code: string, attribute: string, data: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.update(register_code, attribute, data);

      return { 
        embeds: [ new Embed("✅ - Success", response.register_code + " - " + response.name +"'s " + attribute + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async search(register_code: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.search(register_code);
      
      const description = `
      👤 Status - ${response.data.status}\n
      📅 Ano de Admissão -  ${response.data.admission_year}\n
      📧 Email - ${response.data.email}\n
      🖥️ Github - [Acessar Github](${response.data.github_url})\n
      📷 Instagram - [Acessar Instagram](${response.data.instagram_url})\n
      💼 LinkedIn - [Acessar LinkedIn](${response.data.linkedin_url})\n
      📚 Lattes - [Acessar Lattes](${response.data.lattes_url})`;
      
      const embed = new Embed(response.data.register_code + " - " + response.data.name, description, "2E8598");
      const buffer =  Buffer.from(response.data.photo_url, 'base64');
      const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);

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
  };

  public async show(status: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.show(status);
      const registers = await Promise.all(response.data.map(async (data: Member) => { 
        const member = new Member(data.name, data.photo_url, data.register_code, data.admission_year, data.email, data.github_url, data.instagram_url, data.linkedin_url, data.lattes_url, data.status);
        
        const description = `
        👤 Status - ${member.status}\n
        📅 Ano de Admissão -  ${member.admission_year}\n
        📧 Email - ${member.email}\n
        🖥️ Github - [Acessar Github](${member.github_url})\n
        📷 Instagram - [Acessar Instagram](${member.instagram_url})\n
        💼 LinkedIn - [Acessar LinkedIn](${member.linkedin_url})\n
        📚 Lattes - [Acessar Lattes](${member.lattes_url})`;
        
        const buffer =  Buffer.from(member.photo_url, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: member.register_code + "." + type }
        const embed = new Embed(member.register_code + " - " + member.name, description, "2E8598",  "attachment://" + file.name );
        
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