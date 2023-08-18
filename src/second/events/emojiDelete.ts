import { GuildEmoji } from 'discord.js'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'emojiDelete'

export function execute(emoji: GuildEmoji, client: SecondClientData) {
  const { serverId, backupServerId } = client.data

  if(emoji.guild.id != serverId) return

  const backupServer = client.getGuildById(backupServerId)
  const backupEmoji = backupServer?.emojis.cache.find(f=> f.name == emoji.name)
  if(backupEmoji) backupEmoji.delete()
}