import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";

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
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  
  const projectController = new ProjectController();

  const response = (await projectController.remove(name))!;
  
  interaction.editReply(response);
}