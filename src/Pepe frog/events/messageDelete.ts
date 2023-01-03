import { ChannelType, Client, EmbedBuilder, Message, PartialMessage } from "discord.js";
import { frogDb } from "../db";

export const messageDeleteEvent = async (msgd: Message<boolean> | PartialMessage, client: Client) => {
  const { serverId, prefix, owners } = frogDb
  if(msgd.guildId != serverId) return

  if(msgd.content && !(msgd.content.startsWith(prefix) && owners.some(s=> s == msgd.author?.id))){
    const channelLog = client.channels.cache.get('1053389522253127720')
  
    const DeleteMessageEb = new EmbedBuilder()
    .setAuthor({name: msgd.member?.nickname || msgd.author?.username || 'undefined', iconURL: msgd.author?.displayAvatarURL()})
    .setTitle('🗑️ Deleted message')
    .setDescription(`**📄 Message:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000)+'...' : msgd.content}`)
    .setFields(
      {name: '🧑 **Author:**', value: `${msgd.author} ||*(\`\`${msgd.author?.id}\`\`)*||`, inline: true},
      {name: `<:canaldetexto:904812801925738557> **Channel:**`, value: `${msgd.channel}`, inline: true},
    )
    .setColor('DarkOrange')
    .setTimestamp()
    if(channelLog?.type == ChannelType.GuildText) return channelLog.send({embeds: [DeleteMessageEb]})
  }
}