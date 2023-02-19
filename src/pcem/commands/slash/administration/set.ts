import { Client, SlashCommandBuilder, ChatInputCommandInteraction, CacheType, ChannelType, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import ms from "ms";
import { sendMessageSlash, setSlashErrors } from "../../../../shared/functions";

export const setScb = new SlashCommandBuilder()
.setName('set')
.setNameLocalization('es-ES', 'establecer')
.setDescription('👉 Set a option.')
.setDescriptionLocalization('es-ES', '👉 Establecer una opción.')
.addSubcommand(slowMode=> 
  slowMode.setName('slowmode')
  .setNameLocalization('es-ES', 'modolento')
  .setDescription('⏳ Set channel slow mode.')
  .setDescriptionLocalization('es-ES', '⏳ Establecer el modo lento del canal.')
  .addStringOption(time=> 
    time.setName('time')
    .setNameLocalization('es-ES', 'tiempo')
    .setDescription('🔢 Waiting time between each message.')
    .setDescriptionLocalization('es-ES', '🔢 Tiempo de espera entre cada mensaje.')
    .setMinLength(2)
    .setRequired(true)
  )  
  .addChannelOption(channel=>
    channel.setName('channel')
    .setNameLocalization('es-ES', 'canal')
    .setDescription('✍️ Text channel to set slow mode.')
    .setDescriptionLocalization('es-ES', '✍️ Canal de texto para establecer el modo lento.')
    .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.GuildVoice) 
    .setRequired(false)
  )
)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON()

export const setSlashCommand = async (int: ChatInputCommandInteraction<CacheType>) => {
  const { guild, user, options, locale } = int, subCommandName = options.getSubcommand(true), isEnglish = locale == 'en-US'
  const author = guild?.members.cache.get(user.id)

  if(subCommandName == 'slowmode'){
    const time = options.getString('time', true), channel = options.getChannel('channel')

    if(setSlashErrors(int, [
      [
        Boolean(channel && !guild?.members.me?.permissionsIn(channel.id).has('ManageChannels')),
        (isEnglish ? `I don't have permission to edit channel <#${channel?.id}>.` : `No tengo permiso para editar el canal <#${channel?.id}>.`)
      ],
      [
        Boolean((!channel) && !guild?.members.me?.permissionsIn(int.channel?.id || '').has('ManageChannels')),
        (isEnglish ? `I don't have permission to edit this channel *(${int.channel})*.` : `No tengo permiso para editar este canal *(${int.channel})*.`)
      ],
      [
        Boolean(!ms(time)),
        (isEnglish ? `The time you provided *(${time})* is not valid.\n\n**Examples:**\n30 seconds = **30s**\n10 minutes = **10m**\n2 hours = **2h**` : `El tiempo que has proporcionado *(${time})* no es valido.\n\n**Ejemplos:**\n30 segundos = **30s**\n10 minutos = **10m**\n2 horas = **2h**`)
      ],
      [
        Boolean(ms(time) < ms('1s')),
        (isEnglish ? `The time you provided *(${time})* is less than **1** second, please provide a longer timeout.` : `El tiempo que has proporcionado *(${time})* es menor a **1** segundo, proporciona un tiempo de espera mayor.`)
      ],
      [
        Boolean(ms(time) > ms('6h')),
        (isEnglish ? `The time you provided *(${time})* is greater than **6** hours, please provide a shorter wait time.` : `El tiempo que has proporcionado *(${time})* es mayor a **6** horas, proporciona un tiempo de espera menor.`)
      ],
    ])) return

    await int.deferReply()

    const SlowmodeEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || user.username, iconURL: user.displayAvatarURL()})
    .setTitle('⏳ '+(isEnglish ? 
      'Slow mode' :
      'Modo pausado'  
    ))
    .setDescription(isEnglish ? 
      `Paused mode for channel ${channel || int.channel} has been set to **${time}**.` :
      `El modo pausado del canal ${channel || int.channel} se ha establecido a **${time}**.`
    )
    .setColor(guild?.members.me?.displayHexColor || 'White')
    .setTimestamp()

    const finalChannel = channel || int.channel
    guild?.channels.cache.get(finalChannel?.id || '')?.edit({rateLimitPerUser: Math.floor(ms(time)/1000)}).then(()=> {
      sendMessageSlash(int, {embeds: [SlowmodeEb]})
    })
  }
}