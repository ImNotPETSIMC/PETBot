import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("member_update")
  .addStringOption(option =>
    option
      .setName('register_code')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('attribute')
      .setDescription('Campo de informação a ser atualizado;')
      .setRequired(true)
      .addChoices(
        {name: "Nome", value: "name"}, 
        {name: "Foto", value: "photo_url"}, 
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
  await interaction.deferReply();
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;
  
  const register_code = getOption("register_code");
  const attribute = getOption("attribute");
  const data = getOption("data");

  const memberController = new MemberController();

  const response = (await memberController.update(register_code, attribute, data))!;
  
  interaction.editReply(response);
}