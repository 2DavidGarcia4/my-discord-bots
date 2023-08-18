import { GuildEmoji } from 'discord.js'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'emojiCreate'

export function execute(emoji: GuildEmoji, client: SecondClientData) {
  const { serverId, backupServerId } = client.data
  
  if(emoji.guild.id != serverId) return

  const backupServer = client.getGuildById(backupServerId)
  backupServer?.emojis.create({
    name: emoji.name || 'unknown',
    attachment: emoji.url
  })
}