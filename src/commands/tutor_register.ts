import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { TutorController } from "../controller/tutor.controller";
import { getOption } from "../helper/getOption";

export const data = new SlashCommandBuilder()
  .setName("tutor_register")
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Nome do Tutor do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('photo_url')
      .setDescription('URL da Foto do Tutor do PET-SIMC;')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('email')
      .setDescription('E-mail do Tutor do PET-SIMC;')
      .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName('admission_year')
        .setDescription('Ano de Entrada do Tutor no PET-SIMC;')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('status')
        .setDescription('Status do Tutor do PET-SIMC;')
        .setRequired(true)
        .addChoices({ name: "Tutor", value: "Tutor" }, { name: "Ex-Tutor", value: "Ex-Tutor" })
    )
  .addStringOption(option =>
    option
      .setName('place_of_birth')
      .setDescription('Naturalidade do Tutor do PET-SIMC;')
      .setRequired(false)
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

  const createTutorDTO = {
    name: getOption("name", interaction, true)!,
    photo: getOption("photo_url", interaction, true)!,
    email: getOption("email", interaction, true)!,
    admission_year: <number>interaction.options.get("admission_year")!.value,
    area: getOption("area", interaction, true)!,
    github_url: getOption("github_url", interaction, true)!,
    instagram_url: getOption("instagram_url", interaction, true)!,
    linkedin_url: getOption("linkedin_url", interaction, true)!,
    lattes_url: getOption("lattes_url", interaction, true)!,
    status: getOption("status", interaction, true)!,
    place_of_birth: getOption("place_of_birth", interaction, true)!,
    disciplines: []
  }

  const tutorController = new TutorController();

  const response = (await tutorController.register(createTutorDTO))!;

  interaction.editReply(response);
}