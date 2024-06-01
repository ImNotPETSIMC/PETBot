import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MessageController } from "../controller/message.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("message_remove")
  .addStringOption(option =>
    option
      .setName('id')
      .setDescription('ID da Mensagem ao PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de uma Mensagem ao PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const query = { id: getOption("id", interaction, true)! }
  
  const messageController = new MessageController();

  const response = (await messageController.remove(query))!;
  
  interaction.editReply(response);
}