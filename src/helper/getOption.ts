import { CommandInteraction } from "discord.js";

export const getOption = (option: string, interaction: CommandInteraction, required?: true) => {
    if(required) return <string>interaction.options.get(option)!.value;
    return interaction.options.get(option)?.value ? interaction.options.get(option)?.value?.toString() : undefined;
}