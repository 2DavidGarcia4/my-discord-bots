import { ChannelType, Client, EmbedBuilder, Message, PartialMessage } from "discord.js";
import { frogDb } from "../db";

export const messageUpdateEvent = async (oldMsg: Message<boolean> | PartialMessage, newMsg: Message<boolean> | PartialMessage, client: Client) => {
  const { serverId } = frogDb
  if(oldMsg.guildId != serverId || oldMsg.author?.bot) return

  if(oldMsg.content && oldMsg.content != newMsg.content){
    const channelLog = client.channels.cache.get('1053389522253127720')

    const MessageUpdateEb = new EmbedBuilder()
    .setAuthor({name: oldMsg.member?.nickname || oldMsg.author?.username || 'undefined', iconURL: oldMsg.author?.displayAvatarURL()})
    .setTitle('🪄 Edited message')
    .addFields(
      {name: `📄 **Old message:**`, value: `${oldMsg.content.length>1024 ? oldMsg.content.slice(0,1020)+'...' : oldMsg.content}`, inline: true},
      {name: `📝 **New message:**`, value: `${(newMsg.content?.length || 0)>1024 ? newMsg.content?.slice(0, 1020)+'...' : newMsg.content}`, inline: true},
      {name: `\u200B`, value: `\u200B`, inline: true},
      {name: '🧑 **Author:**', value: `${oldMsg.author} ||*(\`\`${oldMsg.author?.id}\`\`)*||`, inline: true},
      {name: `<:canaldetexto:904812801925738557> **Channel:**`, value: `${oldMsg.channel}`, inline: true},
      {name: '📄 **Message:**', value: `[Go to message](${newMsg.url})`, inline: true},
    )
    .setColor('Blurple')
    .setTimestamp()
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [MessageUpdateEb]})
  }
}