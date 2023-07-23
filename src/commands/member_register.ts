import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";
import { Member } from "../classes";

export const data = new SlashCommandBuilder()
  .setName("member_register")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('photo_url')
      .setDescription('URL da Foto do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('register_code')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addNumberOption(option =>
    option
      .setName('admission_year')
      .setDescription('Ano de Admissão na UFU-MC do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('email')
      .setDescription('E-mail do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('github_url')
      .setDescription('URL do Github do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('instagram_url')
      .setDescription('URL do Instagram do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('linkedin_url')
      .setDescription('URL do LinkedIn do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('lattes_url')
      .setDescription('URL do Currículo Lattes do Membro do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Membro do PET-SIMC;')
      .setRequired(true)
      .addChoices({name: "Petiano", value:"Petiano"}, {name:"Ex-Petiano", value:"Ex-Petiano"})
  )
  .setDescription("Registra um novo membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ephemeral: true});
  
  const getOption = (option: string) => <string>interaction.options.get(option)!.value;

  const newMember = new Member(
    getOption("name"), 
    getOption("photo_url"), 
    getOption("register_code"),
    <number>interaction.options.get("admission_year")!.value,
    getOption("email"),
    getOption("github_url"),
    getOption("instagram_url"),
    getOption("linkedin_url"),
    getOption("lattes_url"),
    getOption("status")
  );

  const memberController = new MemberController();

  const response = (await memberController.register(newMember))!;
  
  interaction.editReply(response);
}