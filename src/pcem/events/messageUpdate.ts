import { ChannelType, Client, EmbedBuilder, Message, PartialMessage } from "discord.js"
import { botDB } from "../db"
import { getBotData } from "../utils"

export const messageUpdateEvent = async (oldMsg: Message<boolean> | PartialMessage, newMsg: Message<boolean> | PartialMessage, client: Client) => {
  const { serverId, emoji } = botDB
  if(oldMsg.guildId != serverId) return

  if(oldMsg.content && oldMsg.content != newMsg.content){
    const dataBot = await getBotData(client)
    if(!dataBot) return
    const channelLog = client.channels.cache.get(dataBot.logs.editedMessages)

    const MessageUpdateEb = new EmbedBuilder()
    .setAuthor({name: oldMsg.member?.nickname || oldMsg.author?.username || 'undefined', iconURL: oldMsg.author?.displayAvatarURL()})
    .setTitle('🪄 Mensaje editado')
    .addFields(
      {name: `📄 **Mensaje antiguo:**`, value: `${oldMsg.content.length>1024 ? oldMsg.content.slice(0,1020)+'...' : oldMsg.content}`, inline: true},
      {name: `📝 **Mensaje actual:**`, value: `${(newMsg.content?.length || 0)>1024 ? newMsg.content?.slice(0, 1020)+'...' : newMsg.content}`, inline: true},
      {name: `\u200B`, value: `\u200B`, inline: true},
      {name: '🧑 **Autor:**', value: `${oldMsg.author} ||*(\`\`${oldMsg.author?.id}\`\`)*||`, inline: true},
      {name: `${emoji.textChannel} **Canal:**`, value: `${oldMsg.channel}`, inline: true},
    )
    .setColor('Blue')
    .setTimestamp()
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [MessageUpdateEb]})
  }
}