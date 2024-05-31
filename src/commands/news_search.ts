import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NewsController } from "../controller/news.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
    .setName("news_search")
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('Nome da Notícia do PET-SIMC;')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('id')
            .setDescription('ID da Notícia do PET-SIMC;')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('content')
            .setDescription('Conteúdo para a Notícia do PET-SIMC;')
            .setRequired(false)
    )
    .setDescription("Busca o cadastro de um projeto do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const query = {
        ...getOption("id", interaction)         && { id: getOption("id", interaction) },
        ...getOption("name", interaction)       && { name: getOption("name", interaction) },
        ...getOption("content", interaction)    && { content: getOption("content", interaction) }
    }

    const newsController = new NewsController();

    const response = (await newsController.search(query))!;

    response.data.map(register =>
        interaction.followUp({ ...register })
    )
}