import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MemberController } from "../controller/member.controller";

export const data = new SlashCommandBuilder()
  .setName("member_update")
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
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('photo_url')
      .setDescription('URL da Foto do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('email')
      .setDescription('E-mail do Membro do PET-SIMC;')
      .setRequired(false)
  )
  .addNumberOption(option =>
    option
      .setName('admission_year')
      .setDescription('Ano de Admissão na UFU-MC do Membro do PET-SIMC;')
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
  .addStringOption(option =>
    option
      .setName('status')
      .setDescription('Status do Membro do PET-SIMC;')
      .setRequired(false)
      .addChoices({name: "Membro", value:"Membro"}, {name:"Ex-Membro", value:"Ex-Membro"})
  )
  .setDescription("Atualiza as informações de um membro do PET-SIMC.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply();
  
  const getOption = (option: string) => interaction.options.get(option)?.value ? interaction.options.get(option)?.value?.toString() : undefined;
  
  const query = {
    matricula: interaction.options.get("matricula")!.value!.toString(),
    ...getOption("name")                && { name: getOption("name") },
    ...getOption("photo_url")           && { photo: getOption("photo_url") },
    ...getOption("email")               && { email: getOption("email") },
    ...getOption("admission_year")      && { admission_year: <number>interaction.options.get("admission_year")!.value },
    ...getOption("favorite_pillar")     && { favorite_pillar: getOption("favorite_pillar") },
    ...getOption("github_url")          && { github_url: getOption("github_url") },
    ...getOption("instagram_url")       && { instagram_url: getOption("instagram_url") },
    ...getOption("linkedin_url")        && { linkedin_url: getOption("linkedin_url") },
    ...getOption("lattes_url")          && { lattes_url: getOption("lattes_url") },
    ...getOption("spotify_track_url")   && { spotify_track_url: getOption("spotify_track_url") },
    ...getOption("status")              && { status: getOption("status") },
    ...getOption("hobby")               && { hobby: getOption("hobby") },
    ...getOption("place_of_birth")      && { place_of_birth: getOption("place_of_birth") },
    ...getOption("course_curriculum")   && { course_curriculum: <number>interaction.options.get("course_curriculum")!.value }
  }

  const memberController = new MemberController();

  const response = (await memberController.update(query))!;
  
  interaction.editReply(response);
}