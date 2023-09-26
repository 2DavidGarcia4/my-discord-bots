import { MessageReaction, type PartialMessageReaction, type PartialUser, User } from 'discord.js'
import { FrogDb } from '../data'
import { BotEvent } from '../..'
import { type SecondClientData } from '..'

export default class ReactionAddEvent extends BotEvent {
  constructor() {
    super('messageReactionAdd')
  }

  async execute(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: SecondClientData) {
    const { serverId, emojisIds } = FrogDb
    if(user.bot) return
  
    if(reaction.message.guildId != serverId) return
    const { channels } = client.data
  
    if(reaction.message.channelId == channels.suggestions && [emojisIds.like, emojisIds.dislike].some(s=> s == reaction.emoji.id)){
      if(reaction.message.author?.id == user.id) {
        reaction.users.remove(user.id)
        return
      }
  
      const counterReaction = reaction.emoji.id == emojisIds.like ? emojisIds.dislike : emojisIds.like
      if(reaction.message.reactions.cache.has(counterReaction)){
        reaction.message.reactions.cache.get(counterReaction)?.users.remove(user.id)
      }
    }
  }
}