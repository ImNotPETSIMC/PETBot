import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("member_status")
  .addStringOption(option =>
    option
      .setName('matricula')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Membro do PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Petiano", value:"Petiano"}, {name:"Ex-Petiano", value:"Ex-Petiano"}, {name: "Tutor", value:"Tutor"}, {name: "Ex-Tutor", value:"Ex-Tutor"})
  )
  .setDescription("Atualiza o status de um membro ou ex-membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const matricula = getOption("matricula");
  const status = getOption("status");

  const memberController = new MemberController();

  const response = (await memberController.status(matricula, status))!;
  
  interaction.editReply(response);
}