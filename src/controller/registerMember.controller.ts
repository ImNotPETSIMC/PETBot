import { Embed, Member } from "../classes";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import RegisterMemberService from "../services/registerMember.services";

export class RegisterMemberController {
  public async handle(member: Member) {
    const registerMemberService = new RegisterMemberService();

    try {
      const response = await registerMemberService.registerMember(member);

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
  }
}