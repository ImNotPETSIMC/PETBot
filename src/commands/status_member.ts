import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("status_member")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Membro do PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Petiano", value:"Petiano"}, {name:"Ex-Petiano", value:"Ex-Petiano"})
  )
  .setDescription("Atualiza o status de um membro ou ex-membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  const status = getOption("status");

  const memberController = new MemberController();

  const response = (await memberController.status(name, status))!;
  
  interaction.editReply(response);
}