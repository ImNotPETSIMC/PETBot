import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("project_search")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Projeto do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('type')
      .setDescription('Tipo do Projeto do PET-SIMC;')
      .addChoices({name: "Extensão", value:"Extensão"}, {name:"Ensino", value:"Ensino"}, {name:"Desenvolvimento", value:"Desenvolvimento"}, {name: "Outros", value:"Outros"})
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('description')
      .setDescription('Descrição do Projeto do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Projeto do PET-SIMC;')
      .setRequired(false)
      .addChoices({name: "Em Andamento", value:"Em Andamento"}, {name:"Concluído", value:"Concluído"})
  )
  .setDescription("Busca o cadastro de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const query = {
    ...getOption("name", interaction)                && { name: getOption("name", interaction) },
    ...getOption("subtitle", interaction)            && { subtitle: getOption("subtitle", interaction) },
    ...getOption("type", interaction)                && { type: getOption("type", interaction) },
    ...getOption("description", interaction)         && { name: getOption("description", interaction) },
    ...getOption("status", interaction)              && { status: getOption("status", interaction) },
  }
  
  const projectController = new ProjectController();

  const response = (await projectController.search(query))!;
  
  response.data.map(register =>
    interaction.followUp({ ...register })
  )
}