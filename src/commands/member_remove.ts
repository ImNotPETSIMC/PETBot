import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("member_remove")
  .addStringOption(option =>
    option
      .setName('register_code')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de um membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const register_code = getOption("register_code");
  
  const memberController = new MemberController();

  const response = (await memberController.remove(register_code))!;
  
  interaction.editReply(response);
}