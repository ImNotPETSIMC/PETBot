import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SearchMemberController } from "../controller/searchMember.controller";

export const data = new SlashCommandBuilder()
  .setName("search_member")
  .addStringOption(option =>
    option
      .setName('register_code')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Busca o cadastro de um membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const register_code = getOption("register_code");
  
  const searchMemberController = new SearchMemberController();

  const response = (await searchMemberController.handle(register_code))!;
  
  interaction.editReply(response);
}