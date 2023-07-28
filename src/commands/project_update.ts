import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";

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
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  const attribute = getOption("attribute");
  const data = getOption("data");

  const projectController = new ProjectController();

  const response = (await projectController.update(name, attribute, data))!;
  
  interaction.editReply(response);
}