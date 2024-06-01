import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MessageController } from "../controller/message.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
    .setName("message_search")
    .addStringOption(option =>
        option
            .setName('id')
            .setDescription('ID da Mensagem ao PET-SIMC;')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('Remetente da mensagem ao PET-SIMC;')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('email')
            .setDescription('Email para contato da mensagem ao PET-SIMC;')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('content')
            .setDescription('Conteúdo da mensagem destinada ao PET-SIMC;')
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option
            .setName('answered')
            .setDescription('Status de Respondido da Mensagem destinada ao PET-SIMC;')
    )
    .setDescription("Busca o cadastro de uma mensagem ao PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const query = {
        ...getOption("id", interaction)         && { id: getOption("id", interaction) },
        ...getOption("name", interaction)       && { name: getOption("name", interaction) },
        ...getOption("email", interaction)      && { email: getOption("email", interaction) },
        ...getOption("content", interaction)    && { content: getOption("content", interaction) },
        ...getOption("answered", interaction)   && { answered: <boolean>interaction.options.get("answered")!.value }
    }

    const messageController = new MessageController();

    const response = (await messageController.search(query))!;

    response.data.map(register =>
        interaction.followUp({ ...register })
    )
}
