import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("project_remove")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Projeto do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const query = {
    name: getOption("name", interaction, true)!
  }
  
  const projectController = new ProjectController();

  const response = (await projectController.remove(query))!;
  
  interaction.editReply(response);
}