import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { TutorController } from "../controller/tutor.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("tutor_remove")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Tutor do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de um tutor do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  const query = { name: getOption("name", interaction, true)! };

  const tutorController = new TutorController();

  const response = (await tutorController.remove(query))!;

  interaction.editReply(response);
}