import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("member_remove")
  .addStringOption(option =>
    option
      .setName('matricula')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de um membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  const query = { matricula: getOption("matricula", interaction) };

  const memberController = new MemberController();

  const response = (await memberController.remove(query))!;

  interaction.editReply(response);
}