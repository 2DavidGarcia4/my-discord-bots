import { GuildEmoji } from 'discord.js'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'emojiUpdate'

export async function execute(oldEmoji: GuildEmoji, newEmoji: GuildEmoji, client: SecondClientData) {
  const { serverId, backupServerId } = client.data
  if(oldEmoji.guild.id != serverId) return

  const backupServer = client.getGuildById(backupServerId)
  const backupEmoji = backupServer?.emojis.cache.find(f=> f.name == oldEmoji.name)
  
  if(backupEmoji){
    backupEmoji.edit({
      name: newEmoji.name || 'unknown'
    })
  }
}