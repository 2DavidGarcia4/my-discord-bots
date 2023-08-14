import { GuildEmoji } from 'discord.js'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const name: EventName = 'emojiUpdate'

export async function execute(oldEmoji: GuildEmoji, newEmoji: GuildEmoji, client: PepeFrogClient) {
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