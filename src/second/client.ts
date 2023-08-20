import { FrogDb } from './data'
import { BotClient } from '../shared/classes'
import { ModDb } from './types'

export class SecondClient extends BotClient {
  public data = FrogDb  
  public modDb: ModDb[] = []
  public exemptMessagesIds: string[] = []

  constructor() {
    super('second')
  }
}