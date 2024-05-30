import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("member_register")
  .addStringOption(option =>
    option
      .setName('matricula')
      .setDescription('Matrícula do Membro do PET-SIMC;')
      .setRequired(true)
  )
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
      .setName('email')
      .setDescription('E-mail do Membro do PET-SIMC;')
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
        .setName('status')
        .setDescription('Status do Membro do PET-SIMC;')
        .setRequired(true)
        .addChoices({ name: "Membro", value: "Membro" }, { name: "Ex-Membro", value: "Ex-Membro" })
    )
  .addStringOption(option =>
    option
      .setName('favorite_pillar')
      .setDescription('Pilar Favorito do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('github_url')
      .setDescription('URL do Github do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('instagram_url')
      .setDescription('URL do Instagram do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('linkedin_url')
      .setDescription('URL do LinkedIn do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('lattes_url')
      .setDescription('URL do Currículo Lattes do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('spotify_track_url')
      .setDescription('URL de uma música do Spotify para o card do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .setDescription("Registra um novo membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  const getOption = (option: string) => <string>interaction.options.get(option)!.value;

  const createMemberDTO = {
    matricula: getOption("matricula"),
    name: getOption("name"),
    photo: getOption("photo_url"),
    email: getOption("email"),
    admission_year: <number>interaction.options.get("admission_year")!.value,
    favorite_pillar: getOption("favorite_pillar"),
    github_url: getOption("github_url"),
    instagram_url: getOption("instagram_url"),
    linkedin_url: getOption("linkedin_url"),
    lattes_url: getOption("lattes_url"),
    spotify_track_url: getOption("spotify_track_url"),
    status: getOption("status"),
    hobby: getOption("hobby"),
    place_of_birth: getOption("place_of_birth"),
    course_curriculum: <number>interaction.options.get("course_curriculum")!.value,
    projects: []
  }

  const memberController = new MemberController();

  const response = (await memberController.register(createMemberDTO))!;

  interaction.editReply(response);
}