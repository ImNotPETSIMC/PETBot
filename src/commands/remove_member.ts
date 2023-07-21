import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { RemoveMemberController } from "../controller/removeMember.controller";

export const data = new SlashCommandBuilder()
  .setName("remove_member")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de um membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  
  const removeMemberController = new RemoveMemberController();

  const response = (await removeMemberController.handle(name))!;
  
  interaction.editReply(response);
}