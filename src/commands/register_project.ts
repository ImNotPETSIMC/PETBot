import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { RegisterProjectController } from "../controller/registerProject.controller";
import { Project } from "../classes";

export const data = new SlashCommandBuilder()
  .setName("register_project")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Projeto do PET-SIMC;')
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
  .setDescription("Registra um novo Projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;

  const newProject = new Project(
    getOption("name"), 
    getOption("photo_url"), 
    getOption("description"),
    getOption("status")
  );

  const registerProjectController = new RegisterProjectController();

  const response = (await registerProjectController.handle(newProject))!;
  
  interaction.editReply(response);
}