import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("member_show")
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Coleção de membros do PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Membro", value:"Membro"}, {name:"Ex-Membro", value:"Ex-Membro"})
  )
  .setDescription("Mostra a lista de membros ou ex-membros do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const status = getOption("status");

  const memberController = new MemberController();

  const response = (await memberController.show(status))!;

  response.data.map(register => 
    interaction.followUp({ephemeral: true, ...register} )
  )
}