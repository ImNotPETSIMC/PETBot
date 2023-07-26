import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ProjectController } from "../controller/project.controller";

export const data = new SlashCommandBuilder()
  .setName("project_show")
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Coleção de projetos PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Em Andamento", value:"Em Andamento"}, {name:"Finalizado", value:"Finalizado"})
  )
  .setDescription("Mostra a lista de projetos concluídos e em andamento do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const status = getOption("status");

  const projectController = new ProjectController();

  const response = (await projectController.show(status))!;
  
  interaction.editReply(response);
}