import { GuildEmoji } from 'discord.js'
import { type EventName, PepeFrogClient } from '../client'

export const name: EventName = 'emojiCreate'

export function execute(emoji: GuildEmoji, client: PepeFrogClient) {
  const { serverId, backupServerId } = client.data
  
  if(emoji.guild.id != serverId) return

  const backupServer = client.getGuildById(backupServerId)
  backupServer?.emojis.create({
    name: emoji.name || 'unknown',
    attachment: emoji.url
  })
}