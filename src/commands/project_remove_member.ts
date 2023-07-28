import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";

export const data = new SlashCommandBuilder()
  .setName("project_remove_member")
  .addStringOption(option =>
    option
      .setName('project')
      .setDescription('Nome do Projeto do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('member')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Remove um membro de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const member = getOption("member");
  const project = getOption("project");

  const projectController = new ProjectController();

  const response = (await projectController.remove_member(project, member))!;
  
  interaction.editReply(response);
}