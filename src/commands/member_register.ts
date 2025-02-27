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
  .addNumberOption(option =>
    option
    .setName('admission_year')
    .setDescription('Ano de Entrada do Membro no PET-SIMC;')
    .setRequired(true)
  )
  .addNumberOption(option =>
    option
    .setName('course_curriculum')
      .setDescription('Grade Disciplinar do Membro do PET-SIMC;')
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
        .setName('place_of_birth')
        .setDescription('Naturalidade do Membro do PET-SIMC;')
        .setRequired(false)
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
      .setName('projects')
      .setDescription('Projetos do Membro do PET-SIMC. Preencha separado por espaço e vírgula.')
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
    course_curriculum: <number>interaction.options.get("course_curriculum")!.value,
    status: getOption("status", interaction, true)!,
    ...getOption("favorite_pillar", interaction) && { favorite_pillar: getOption("favorite_pillar", interaction) },
    ...getOption("github_url", interaction) && { github_url: getOption("github_url", interaction) },
    ...getOption("instagram_url", interaction) && { instagram_url: getOption("instagram_url", interaction) },
    ...getOption("linkedin_url", interaction) && { linkedin_url: getOption("linkedin_url", interaction) },
    ...getOption("lattes_url", interaction) && { lattes_url: getOption("lattes_url", interaction) },
    ...getOption("spotify_track_url", interaction) && { spotify_track_url: getOption("spotify_track_url", interaction) },
    ...getOption("hobby", interaction) && { hobby: getOption("hobby", interaction) },
    ...getOption("place_of_birth", interaction) && { place_of_birth: getOption("place_of_birth", interaction) },
    ...getOption("projects", interaction) && { projects: getOption("projects", interaction) },
  }

  const memberController = new MemberController();

  const response = (await memberController.register(createMemberDTO))!;

  interaction.editReply(response);
}