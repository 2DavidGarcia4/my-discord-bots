import { ChannelType, EmbedBuilder, Message, type PartialMessage } from 'discord.js'
import { getSnackData } from '../lib/notion'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class MessageUpdateEvent extends BotEvent {
  constructor() {
    super('messageUpdate')
  }

  async execute(oldMsg: Message<boolean> | PartialMessage, newMsg: Message<boolean> | PartialMessage, client: SecondClientData) {
    const { serverId } = client.data
    if(oldMsg.guildId != serverId || oldMsg.author?.bot) return
  
    const SnackData = await getSnackData()
    if(oldMsg.channelId == SnackData.channels.logs) return
    if(oldMsg.content && oldMsg.content != newMsg.content){
      const channelLog = client.channels.cache.get(SnackData.channels.logs)
  
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
}