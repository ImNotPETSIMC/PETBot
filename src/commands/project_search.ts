import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";

export const data = new SlashCommandBuilder()
  .setName("project_search")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do projeto do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Busca o cadastro de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  
  const projectController = new ProjectController();

  const response = (await projectController.search(name))!;
  
  interaction.editReply(response);
}