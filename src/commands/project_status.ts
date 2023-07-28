import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";

export const data = new SlashCommandBuilder()
  .setName("project_status")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Matrícula do projeto do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do projeto do PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Em Andamento", value:"Em Andamento"}, {name:"Finalizado", value:"Finalizado"})
  )
  .setDescription("Atualiza o status de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  const status = getOption("status");

  const projectController = new ProjectController();

  const response = (await projectController.status(name, status))!;
  
  interaction.editReply(response);
}