import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("project_update")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Projeto do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('attribute')
      .setDescription('Campo de informação a ser atualizado;')
      .setRequired(true)
      .addChoices(
        {name: "Foto", value: "photo_url"}, 
        {name: "Descrição", value: "description"}, 
      )
  )
  .addStringOption(option =>
    option
      .setName('data')
      .setDescription('Informação a ser inserida;')
      .setRequired(true)
  )
  .setDescription("Atualiza as informações de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const query = {
    name: getOption("name", interaction, true)!, 
    ...getOption("subtitle", interaction)            && { subtitle: getOption("subtitle", interaction) },
    ...getOption("type", interaction)                && { type: getOption("type", interaction) },
    ...getOption("description", interaction)         && { description: getOption("description", interaction) },
    ...getOption("photo_url", interaction)           && { photo: getOption("photo_url", interaction) },
    ...getOption("status", interaction)              && { status: getOption("status", interaction) },
  }

  const projectController = new ProjectController();

  const response = (await projectController.update(query))!;
  
  interaction.editReply(response);
}