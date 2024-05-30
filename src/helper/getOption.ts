import { CommandInteraction } from "discord.js";

export const getOption = (option: string, interaction: CommandInteraction) => <string>interaction.options.get(option)!.value;