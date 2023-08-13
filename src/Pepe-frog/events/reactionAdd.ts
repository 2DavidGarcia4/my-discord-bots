import { MessageReaction, type PartialMessageReaction, type PartialUser, User } from 'discord.js'
import { FrogDb } from '../db'
import { type EventName } from '../client'
import { getSnackData } from '../lib/notion'

export const name: EventName = 'messageReactionAdd'

export async function execute(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  const { serverId, emojisIds } = FrogDb
  if(user.bot) return

  if(reaction.message.guildId != serverId) return
  const { channels } = await getSnackData()

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