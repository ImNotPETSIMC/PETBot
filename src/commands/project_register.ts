import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";
import { Project } from "../classes";

export const data = new SlashCommandBuilder()
  .setName("project_register")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Projeto do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('type')
      .setDescription('Tipo do Projeto do PET-SIMC;')
      .addChoices({name: "Extensão", value:"Extensão"}, {name:"Ensino", value:"Ensino"}, {name:"Desenvolvimento", value:"Desenvolvimento"}, {name: "Outros", value:"Outros"})
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('photo_url')
      .setDescription('URL da Foto do Projeto do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('description')
      .setDescription('Descrição do Projeto do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Projeto do PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Em Andamento", value:"Em Andamento"}, {name:"Concluído", value:"Concluído"})
  )
  .setDescription("Registra um novo projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;

  const newProject = new Project(
    getOption("name"), 
    getOption("type"), 
    getOption("photo_url"), 
    getOption("description"),
    getOption("status")
  );

  const projectController = new ProjectController();

  const response = (await projectController.register(newProject))!;
  
  interaction.editReply(response);
}