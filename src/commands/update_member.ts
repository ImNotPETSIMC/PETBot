import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { UpdateMemberController } from "../controller/updateMember.controller";

export const data = new SlashCommandBuilder()
  .setName("update_member")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('attribute')
      .setDescription('Campo de informação a ser atualizado;')
      .setRequired(true)
      .addChoices(
        {name: "Foto", value: "photo_url"}, 
        {name: "Matrícula", value: "register_code"}, 
        {name: "Ano de Admissão", value: "admission_year"},
        {name: "E-mail", value: "email"},
        {name: "Github", value: "github_url"}, 
        {name: "Instagram", value: "instagram_url"}, 
        {name: "LinkedIn", value: "linkedin_url"}, 
        {name: "Lattes", value: "lattes_url"}, 
      )
  )
  .addStringOption(option =>
    option
      .setName('data')
      .setDescription('Informação a ser inserida;')
      .setRequired(true)
  )
  .setDescription("Atualiza as informações de um membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const name = getOption("name");
  const attribute = getOption("attribute");
  const data = getOption("data");

  const updateMemberController = new UpdateMemberController();

  const response = (await updateMemberController.handle(name, attribute, data))!;
  
  interaction.editReply(response);
}