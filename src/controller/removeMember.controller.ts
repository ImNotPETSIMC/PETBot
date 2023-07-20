import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import RemoveMemberService from "../services/removeMember.services";

export class RemoveMemberController {
  public async handle(name: string) {
    const removeMemberService = new RemoveMemberService();

    try {
      const response = await removeMemberService.remove(name);

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
  }
}