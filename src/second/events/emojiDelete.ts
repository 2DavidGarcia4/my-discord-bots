import { GuildEmoji } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class EmojiDeleteEvent extends BotEvent {
  constructor() {
    super('emojiDelete')
  }

  async execute(emoji: GuildEmoji, client: SecondClientData) {
    const { serverId, backupServerId } = client.data
  
    if(emoji.guild.id != serverId) return
  
    const backupServer = client.getGuildById(backupServerId)
    const backupEmoji = backupServer?.emojis.cache.find(f=> f.name == emoji.name)
    if(backupEmoji) backupEmoji.delete()
  }
}