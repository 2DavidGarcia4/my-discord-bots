import { ChannelType, Client, type Message } from 'discord.js'
import { FrogDb } from '../data'
import { getSnackData } from '../lib/notion'

export async function Announcements(msg: Message<boolean>, client: Client) {
  const { channel, channelId, guildId } = msg
  if(msg.author.bot || guildId != FrogDb.backupServerId) return
  const { channels, roles } = await getSnackData()
  if(channelId != channels.announcements) return

  if(channel.type == ChannelType.GuildText){
    const announcementChannel = client.guilds.cache.get(FrogDb.serverId)?.channels.cache.find(f=> f.name == channel.name)
    if(announcementChannel?.isTextBased()) {
      announcementChannel.send({content: msg.content+`\n<@&${roles.announcement}>`, files: msg.attachments.map(a=> a)})
    }
  }
}