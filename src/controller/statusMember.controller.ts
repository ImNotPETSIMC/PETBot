import { Embed } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import StatusMemberService from "../services/statusMember.services";

export class StatusMemberController {
  public async handle(name: string, status: string) {
    const statusMemberService = new StatusMemberService();

    try {
      const response = await statusMemberService.statusMember(name, status);

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
  }
}