import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { TutorController } from "../controller/tutor.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("tutor_search")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('photo_url')
      .setDescription('URL da Foto do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('email')
      .setDescription('E-mail do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('place_of_birth')
      .setDescription('Naturalidade do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addNumberOption(option =>
    option
      .setName('admission_year')
      .setDescription('Ano de Entrada do Tutor no PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Tutor do PET-SIMC;')
      .setRequired(false)
      .addChoices({ name: "Tutor", value: "Tutor" }, { name: "Ex-Tutor", value: "Ex-Tutor" })
  )
  .addStringOption(option =>
    option
      .setName('area')
      .setDescription('Área do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('github_url')
      .setDescription('URL do Github do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('instagram_url')
      .setDescription('URL do Instagram do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('linkedin_url')
      .setDescription('URL do LinkedIn do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('lattes_url')
      .setDescription('URL do Currículo Lattes do Tutor do PET-SIMC;')
      .setRequired(false)
  )
  .setDescription("Registra um novo tutor do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();

  const query = {
    ...getOption("name", interaction) && { name: getOption("name", interaction) },
    ...getOption("email", interaction) && { email: getOption("email", interaction) },
    ...getOption("admission_year", interaction) && { admission_year: <number>interaction.options.get("admission_year")!.value },
    ...getOption("area", interaction) && { area: getOption("area", interaction) },
    ...getOption("github_url", interaction) && { github_url: getOption("github_url", interaction) },
    ...getOption("instagram_url", interaction) && { instagram_url: getOption("instagram_url", interaction) },
    ...getOption("linkedin_url", interaction) && { linkedin_url: getOption("linkedin_url", interaction) },
    ...getOption("lattes_url", interaction) && { lattes_url: getOption("lattes_url", interaction) },
    ...getOption("spotify_track_url", interaction) && { spotify_track_url: getOption("spotify_track_url", interaction) },
    ...getOption("status", interaction) && { status: getOption("status", interaction) },
    ...getOption("place_of_birth", interaction) && { place_of_birth: getOption("place_of_birth", interaction) }
  }

  const tutorController = new TutorController();

  const response = (await tutorController.search(query))!;

  response.data.map(register =>
    interaction.followUp({ ...register })
  )
}