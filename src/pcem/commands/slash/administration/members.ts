import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits, Client } from "discord.js";
import { setSlashError } from "../../../../shared/functions";

export const membersScb = new SlashCommandBuilder()
.setName('members')
.setNameLocalization('es-ES', 'miembros')
.setDescription('🌪️ Filter members')
.setDescriptionLocalization('es-ES', '🌪️ Filtra miembros')
.addSubcommand(mwith=>
  mwith.setName('with')
  .setNameLocalization('es-ES', 'con')
  .setDescription('⚙️ Filter members by.')
  .setDescriptionLocalization('es-ES', '⚙️ Filtrar miembros por.')
  .addRoleOption(rol=>
    rol.setName('rol')
    .setDescription('🏅 Filter by role.')
    .setDescriptionLocalization('es-ES', '🏅 Filtrar por rol.')
    .setRequired(false)
  )
  .addStringOption(includes=> 
    includes.setName('includes')
    .setNameLocalization('es-ES', 'incluye')
    .setDescription('📝 Filter by word you include in your name.')
    .setDescriptionLocalization('es-ES', '📝 Filtrar por palabra que incluya en su nombre.')
    .setRequired(false)
  )
)
.addSubcommand(without=>
  without.setName('without')
  .setNameLocalization('es-ES', 'sin')
  .setDescription('⚙️ Filter members without.')
  .setDescriptionLocalization('es-ES', '⚙️ Filtrar miembros sin')  
  .addRoleOption(rol=>
    rol.setName('rol')
    .setDescription('🏅 Filter without role.')
    .setDescriptionLocalization('es-ES', '🏅 Filtrar sin rol.')
    .setRequired(false)
  )
  .addStringOption(includes=> 
    includes.setName('includes')
    .setNameLocalization('es-ES', 'incluye')
    .setDescription('📝 Filter without a word that includes in its name.')
    .setDescriptionLocalization('es-ES', '📝 Filtra sin palabra que incluya en su nombre.')
    .setRequired(false)
  )
)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON()

export const membersSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { user, guild, options, locale } = int, subCommandName = options.getSubcommand(true), isEnglish = locale == 'en-US'
  const rol = options.getRole('rol'), includes = options.getString('includes')

  if(subCommandName == 'with'){
    if(!rol && !includes) return setSlashError(int, (isEnglish ?
      'Provide at least one value to filter members.' :
      'Proporciona al menos un valor para filtrar los miembros.'
    ))

    const membersFilter = guild?.members.cache.filter(f=> (rol ? f.roles.cache.has(rol.id) : true && includes ? f.user.username.includes(includes) : true))

    

    int.reply({ephemeral: true, content: `${rol} ${includes}`})
  }
  
  if(subCommandName == 'without'){
    int.reply({ephemeral: true, content: `${rol} ${includes}`})

  }
}