import { GuildEmoji } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class EmojiCreateEvent extends BotEvent {
  constructor() {
    super('emojiCreate')
  }

  async execute(emoji: GuildEmoji, client: SecondClientData) {
    const { serverId, backupServerId } = client.data
    
    if(emoji.guild.id != serverId) return
  
    const backupServer = client.getGuildById(backupServerId)
    backupServer?.emojis.create({
      name: emoji.name || 'unknown',
      attachment: emoji.url
    })
  }
}