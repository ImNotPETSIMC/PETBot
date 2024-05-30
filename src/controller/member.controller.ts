import { fileTypeFromBuffer } from "file-type";
import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import MemberService from "../service/member.service";
import { MemberCreateRequestSchema, MemberSearchRequestSchema, MemberUpdateRequestSchema } from "../schemas/member.schemas";
import { handleZodIssues } from "../helper/handleZodIssues";

export class MemberController {
  public async register(member: Zod.infer<typeof MemberCreateRequestSchema>) {
    const memberService = new MemberService();
    
    try {
      const result = MemberCreateRequestSchema.safeParse(member);
      
      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message); 

      const { data } = result;

      const response = await memberService.register(data);

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

  public async status(member: Zod.infer<typeof MemberUpdateRequestSchema>) {
    const memberService = new MemberService();

    try {
      const response = await memberService.status(member);

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

  public async update(member: Zod.infer<typeof MemberUpdateRequestSchema>) {
    const memberService = new MemberService();
    try {
      const response = await memberService.update(member);

      return { 
        embeds: [ new Embed("✅ - Success", response.matricula + " - " + response.name + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async search(member: Zod.infer<typeof MemberSearchRequestSchema>) {

    const memberService = new MemberService();

    try {
      const response = await memberService.search(member);
      const registers = await Promise.all(response.data.map(async (data: any) => { 
        const member = {...data};
        const description =
          `👤 Status - ${member.status}` +
          `\n\n 📅 Ano de Admissão -  ${member.admission_year}` +
          `\n\n 📧 Email - ${member.email}` +
          `${member.github_url          ? '\n\n 🖥️ Github - [Acessar Github]('       + member.github_url         + ')' : ''}` +
          `${member.instagram_url       ? '\n\n 📷 Instagram - [Acessar Instagram](' + member.instagram_url      + ')' : ''}` +
          `${member.linkedin_url        ? '\n\n 💼 LinkedIn - [Acessar LinkedIn]('   + member.linkedin_url       + ')' : ''}` +
          `${member.lattes_url          ? '\n\n 📚 Lattes - [Acessar Lattes]('       + member.lattes_url         + ')' : ''}` +
          `\n\n 🛠️ Projetos - ${member.projects.join(', ')}`;

        const buffer = Buffer.from(member.photo, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: member.matricula + "." + type };
        const embed = new Embed(member.matricula + " - " + member.name, description, "2E8598",  "attachment://" + file.name );
        
        return { embeds: [embed], files: [file]};
      }));
      

      return { 
        data: registers
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          data: [{ embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]}]
        };
      }
    }
  };

  public async show(status: string) {
    const memberService = new MemberService();

    try {
      const response = await memberService.show(status);
      const registers = await Promise.all(response.data.map(async (data: any) => { 
        const member = {...data};
        const description =
        `👤 Status - ${member.status}` +
        `\n\n 📅 Ano de Admissão -  ${member.admission_year}` +
        `\n\n 📧 Email - ${member.email}` +
        `${member.github_url          ? '\n\n 🖥️ Github - [Acessar Github]('       + member.github_url         + ')' : ''}` +
        `${member.instagram_url       ? '\n\n 📷 Instagram - [Acessar Instagram](' + member.instagram_url      + ')' : ''}` +
        `${member.linkedin_url        ? '\n\n 💼 LinkedIn - [Acessar LinkedIn]('   + member.linkedin_url       + ')' : ''}` +
        `${member.lattes_url          ? '\n\n 📚 Lattes - [Acessar Lattes]('       + member.lattes_url         + ')' : ''}` +
        `\n\n 🛠️ Projetos - ${member.projects.join(', ')}`

        const buffer = Buffer.from(member.photo, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: member.matricula + "." + type };
        const embed = new Embed(member.matricula + " - " + member.name, description, "2E8598",  "attachment://" + file.name );
        
        return { embeds: [embed], files: [file]};
      }));

      return { 
        data: registers
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          data: [{ embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]}]
        };
      }
    }
  };
}