import { ChannelType, Client, type Message } from "discord.js"
import { FrogDb } from "../db"

export function Announcements(msg: Message<boolean>, client: Client) {
  const { channel, channelId, guildId } = msg
  if(msg.author.bot || guildId != FrogDb.principalServerId) return
  if(channelId != '1053404146839081150') return

  if(channel.type == ChannelType.GuildText){
    const announcementChannel = client.guilds.cache.get(FrogDb.serverId)?.channels.cache.find(f=> f.name == channel.name)
    if(announcementChannel?.isTextBased()) {
      announcementChannel.send({content: msg.content+"\n<@&1053391025906921472>", files: msg.attachments.map(a=> a)})
    }
  }
}