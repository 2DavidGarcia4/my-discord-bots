import { ChannelType, EmbedBuilder, Message, type PartialMessage } from "discord.js";
import { Frog as client, exemptMessagesIds } from "..";
import { FrogDb } from "../db";

export async function messageDeleteEvent(msgd: Message<boolean> | PartialMessage) {
  const { serverId, prefix, owners } = FrogDb
  const channelId = '1053389522253127720'
  if(msgd.guildId != serverId || msgd.author?.bot) return
  if(exemptMessagesIds.some(s=> s == msgd.id)){
    exemptMessagesIds.splice(exemptMessagesIds.findIndex(f=> f == msgd.id), 1)
    return
  }
  if(msgd.channelId == channelId) return

  if(msgd.content && !(msgd.content.startsWith(prefix) && owners.some(s=> s == msgd.author?.id))){
    const channelLog = client.channels.cache.get(channelId)
  
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
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [DeleteMessageEb]})
  }
}