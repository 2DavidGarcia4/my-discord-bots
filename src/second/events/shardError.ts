import { BotEvent } from '../..'

export default class ShardErrorEvent extends BotEvent {
  constructor() {
    super('shardError')
  }
  
  async execute(error: Error, shardId: number) {
    console.error('Error: '+shardId, error.message)
    console.error(error)
  }
}