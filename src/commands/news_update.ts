import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NewsController } from "../controller/news.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("news_update")
  .addStringOption(option =>
    option
      .setName('id')
      .setDescription('ID da Notícia do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome da Notícia do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('content')
      .setDescription('Conteúdo para a Notícia do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('photo_url')
      .setDescription('URL da Foto da Notícia do PET-SIMC;')
      .setRequired(false)
  )
  .setDescription("Atualiza as informações de um notícia do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  const query = {
    id: getOption("id", interaction, true)!,
    ...getOption("name", interaction)       && { name: getOption("name", interaction) },
    ...getOption("content", interaction)    && { content: getOption("content", interaction) },
    ...getOption("photo_url", interaction)  && { photo: getOption("photo_url", interaction) }
  }

  const newsController = new NewsController();

  const response = (await newsController.update(query))!;

  interaction.editReply(response);
}