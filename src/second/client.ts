import { FrogDb } from './data'
import { BotClient } from '../shared/classes'
import { ModDb } from './types'

export class SecondClient extends BotClient {
  public data = FrogDb  
  public modDb: ModDb[] = []
  public exemptMessagesIds: string[] = []
  public getGuildById(guildId: string) {
    return this.guilds.cache.get(guildId)
  }
  public getChannelById(channelId: string) {
    return this.channels.cache.get(channelId)
  }

  constructor() {
    super('second')
  }
}