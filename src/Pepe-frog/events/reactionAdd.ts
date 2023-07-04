import { MessageReaction, type PartialMessageReaction, type PartialUser, User } from "discord.js";
import { FrogDb } from "../db";

export async function reactionAddEvent(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  const { serverId } = FrogDb
  const likeId = '1059641676798377995', dislikeId = '1059641726387626015'
  if(reaction.message.guildId != serverId || user.bot) return

  if(reaction.message.channelId == '1053401642915082392' && [likeId, dislikeId].some(s=> s == reaction.emoji.id)){
    if(reaction.message.author?.id == user.id) {
      reaction.users.remove(user.id)
      return
    }

    const counterReaction = reaction.emoji.id == likeId ? dislikeId : likeId
    if(reaction.message.reactions.cache.has(counterReaction)){
      reaction.message.reactions.cache.get(counterReaction)?.users.remove(user.id)
    }
  }
}