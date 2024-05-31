import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NewsController } from "../controller/news.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
    .setName("news_register")
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('Nome da Notícia do PET-SIMC;')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('id')
            .setDescription('ID da Notícia do PET-SIMC;')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('content')
            .setDescription('Conteúdo para a Notícia do PET-SIMC;')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('photo_url')
            .setDescription('URL da Foto da Notícia do PET-SIMC;')
            .setRequired(true)
    )
    .setDescription("Registra uma nova notícia do do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const createNewsDTO = {
        name: getOption("name", interaction, true)!,
        id: getOption("id", interaction, true)!,
        photo: getOption("photo_url", interaction, true)!,
        content: getOption("content", interaction, true)!,
    }

    const newsController = new NewsController();

    const response = (await newsController.register(createNewsDTO))!;

    interaction.editReply(response);
}