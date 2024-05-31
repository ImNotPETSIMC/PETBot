import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NewsController } from "../controller/news.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("news_remove")
  .addStringOption(option =>
    option
      .setName('id')
      .setDescription('ID da notícia do PET-SIMC;')
      .setRequired(true)
  )
  .setDescription("Deleta o cadastro de um notícia do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const query = {
    id: getOption("id", interaction, true)!
  }
  
  const newsController = new NewsController();

  const response = (await newsController.remove(query))!;
  
  interaction.editReply(response);
}