import { fileTypeFromBuffer } from "file-type";
import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import TutorService from "../service/tutor.service";
import { TutorCreateRequestSchema, TutorRemoveRequestSchema, TutorSearchRequestSchema, TutorUpdateRequestSchema } from "../schemas/tutor.schemas";
import { handleZodIssues } from "../helper/handleZodIssues";

export class TutorController {
  public async register(tutor: Zod.infer<typeof TutorCreateRequestSchema>) {
    const tutorService = new TutorService();
    
    try {
      const result = TutorCreateRequestSchema.safeParse(tutor);
      
      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message); 

      const { data } = result;

      const response = await tutorService.register(data);

      return { 
        embeds: [ new Embed("✅ - Success", response.data.name + " added to Tutors", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async remove(tutor: Zod.infer<typeof TutorRemoveRequestSchema>) {
    const tutorService = new TutorService();

    try {
      const result = TutorCreateRequestSchema.safeParse(tutor);
      
      if (!result.success) throw new ValidationExceptionError(400, "Bad Request: " + result.error.issues.map(handleZodIssues)[0].message); 

      const { data } = result;

      const response = await tutorService.remove(data);

      return { 
        embeds: [ new Embed("🗑️ - Remotion Completed", response.name  + " deleted.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - " + error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async update(tutor: Zod.infer<typeof TutorUpdateRequestSchema>) {
    const tutorService = new TutorService();
    try {
      const response = await tutorService.update(tutor);

      return { 
        embeds: [ new Embed("✅ - Success", response.name + " updated.", "279732")]
      };
    } catch (error) {
      if (error instanceof ValidationExceptionError) {
        return { 
          embeds: [ new Embed("❌ Error - "+ error.code, error.message, "9F2727") ]
        };
      }
    }
  };

  public async search(tutor: Zod.infer<typeof TutorSearchRequestSchema>) {

    const tutorService = new TutorService();

    try {
      const response = await tutorService.search(tutor);
      const registers = await Promise.all(response.data.map(async (data: any) => { 
        const tutor = {...data};
        const description =
          `👤 Status - ${tutor.status}` +
          `\n\n 📅 Ingresso no PET -  ${tutor.admission_year}` +
          `\n\n 📧 Email - ${tutor.email}` +
          `${tutor.area                ? '\n\n 🔬 Area - ' + tutor.area : ''}` +
          `${tutor.github_url          ? '\n\n 🖥️ Github - [Acessar Github]('       + tutor.github_url         + ')' : ''}` +
          `${tutor.instagram_url       ? '\n\n 📷 Instagram - [Acessar Instagram](' + tutor.instagram_url      + ')' : ''}` +
          `${tutor.linkedin_url        ? '\n\n 💼 LinkedIn - [Acessar LinkedIn]('   + tutor.linkedin_url       + ')' : ''}` +
          `${tutor.lattes_url          ? '\n\n 📚 Lattes - [Acessar Lattes]('       + tutor.lattes_url         + ')' : ''}` +
          `\n\n 🎓 Disciplinas - ${tutor.disciplines.join(', ')}`;

        const buffer = Buffer.from(tutor.photo, 'base64');
        const type = await fileTypeFromBuffer(buffer).then(response => response!.ext);
        const file = { attachment: buffer, name: tutor.matricula + "." + type };
        const embed = new Embed(tutor.name, description, "2E8598",  "attachment://" + file.name );
        
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