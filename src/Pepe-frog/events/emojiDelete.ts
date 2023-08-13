import { GuildEmoji } from 'discord.js'
import { PepeFrogClient } from '../client'

export const name: EventName = 'emojiDelete'

export function execute(emoji: GuildEmoji, client: PepeFrogClient) {
  const { serverId, backupServerId } = client.data

  if(emoji.guild.id != serverId) return

  const backupServer = client.getGuildById(backupServerId)
  const backupEmoji = backupServer?.emojis.cache.find(f=> f.name == emoji.name)
  if(backupEmoji) backupEmoji.delete()
}