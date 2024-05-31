import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";
import { getOption } from "../helper/getOption";

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
  .addStringOption(option =>
    option
      .setName('place_of_birth')
      .setDescription('Naturalidade do Membro do PET-SIMC;')
      .setRequired(false)
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
      .setName('hobby')
      .setDescription('Hobby Favorito do Membro do PET-SIMC;')
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

  const createMemberDTO = {
    matricula: getOption("matricula", interaction, true)!,
    name: getOption("name", interaction, true)!,
    photo: getOption("photo_url", interaction, true)!,
    email: getOption("email", interaction, true)!,
    admission_year: <number>interaction.options.get("admission_year")!.value,
    favorite_pillar: getOption("favorite_pillar", interaction, true)!,
    github_url: getOption("github_url", interaction, true)!,
    instagram_url: getOption("instagram_url", interaction, true)!,
    linkedin_url: getOption("linkedin_url", interaction, true)!,
    lattes_url: getOption("lattes_url", interaction, true)!,
    spotify_track_url: getOption("spotify_track_url", interaction, true)!,
    status: getOption("status", interaction, true)!,
    hobby: getOption("hobby", interaction, true)!,
    place_of_birth: getOption("place_of_birth", interaction, true)!,
    course_curriculum: <number>interaction.options.get("course_curriculum")!.value,
    projects: []
  }

  const memberController = new MemberController();

  const response = (await memberController.register(createMemberDTO))!;

  interaction.editReply(response);
}