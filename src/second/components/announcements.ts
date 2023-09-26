import { ChannelType, type Message } from 'discord.js'
import { FrogDb } from '../data'
import { type SecondClientData } from '..'

export async function Announcements(msg: Message<boolean>, client: SecondClientData) {
  const { channel, channelId, guildId } = msg
  if(msg.author.bot || guildId != FrogDb.backupServerId) return
  const { channels, roles } = client.data
  if(channelId != channels.announcements) return

  if(channel.type == ChannelType.GuildText){
    const announcementChannel = client.guilds.cache.get(FrogDb.serverId)?.channels.cache.find(f=> f.name == channel.name)
    if(announcementChannel?.isTextBased()) {
      announcementChannel.send({content: msg.content+`\n<@&${roles.announcement}>`, files: msg.attachments.map(a=> a)})
    }
  }
}