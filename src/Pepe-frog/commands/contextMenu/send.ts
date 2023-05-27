import { CacheType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, Client, PermissionFlagsBits, ChannelType, EmbedBuilder } from "discord.js";
import { frogDb } from "../../db";
import { sendMessageSlash, setSlashError } from '../../../shared/functions'

export const sendCmcb = new ContextMenuCommandBuilder()
.setName('Send')
.setNameLocalizations({
  'en-US': 'Send',
  'es-ES': 'Enviar'
})
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setType(3).toJSON()

export const sendCM = async (int: MessageContextMenuCommandInteraction<CacheType>, client: Client) => {
  const { locale, guild } = int, isEnglish = locale == 'en-US' ? true : false, serverId = int.guildId == frogDb.serverId ? frogDb.principalServerId : frogDb.serverId
  const server = client.guilds.cache.get(serverId)

  if(!int.targetMessage.attachments.size) return setSlashError(int, isEnglish ? 'This message no content images or files.' : 'Este mensaje no contiene imágenes ni archivos.')
  const channel = server?.channels.cache.find(f=> {
    if(int.channel?.type == ChannelType.GuildText){
      return f.name == int.channel.name
    }
    return false
  })
  
  if(!channel) return setSlashError(int, isEnglish ? "I couldn't find a channel similar to this on the other server." : 'No he podido encontrar un canal similar a éste en el otro servidor')

  const SendEb = new EmbedBuilder()
  .setTitle(isEnglish ? 'Command execution has been successful' : 'La ejecución del comando ha sido exitosa')
  .setDescription(isEnglish ? `The files have been sent to the channel ${channel}` : `Los archivos se ha enviado al canal **${channel}**.`)
  .setColor(guild?.members.me?.displayHexColor || 'White')

  await int.deferReply({ephemeral: true})
  if(channel.type == ChannelType.GuildText) channel.send({files: int.targetMessage.attachments.map(m=> m)}).then(async sent=> {    
    sendMessageSlash(int, {embeds: [SendEb]})
  })
}