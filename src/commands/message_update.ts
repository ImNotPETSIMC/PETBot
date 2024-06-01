import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MessageController } from "../controller/message.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
    .setName("message_update")
    .addStringOption(option =>
        option
            .setName('id')
            .setDescription('ID da Mensagem ao PET-SIMC;')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('answered')
            .setDescription('Status da mensagem destinada ao PET-SIMC;')
            .addChoices({ name: "Respondida", value: "true" }, { name: "Não Respondida", value: "false" })
    )
    .setDescription("Atualiza as informações de uma mensagem ao PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const query = {
        id: getOption("id", interaction, true)!,
        ...getOption("answered", interaction) && { answered: <boolean>interaction.options.get("answered")!.value }
    }

    const messageController = new MessageController();

    const response = (await messageController.update(query))!;

    interaction.editReply(response);
}