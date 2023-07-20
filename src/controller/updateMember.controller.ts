import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import UpdateMemberService from "../services/updateMember.services";

export class UpdateMemberController {
  public async handle(name: string, attribute: string, data: string) {
    const updateMemberService = new UpdateMemberService();

    try {
      const response = await updateMemberService.updateMember(name, attribute, data);

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
  }
}