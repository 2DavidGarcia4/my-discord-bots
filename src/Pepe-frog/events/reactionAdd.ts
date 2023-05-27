import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { frogDb } from "../db";

export const reactionAddEvent = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
  const { serverId } = frogDb
  const likeId = '1059641676798377995', dislikeId = '1059641726387626015'
  if(reaction.message.guildId != serverId || user.bot) return

  if(reaction.message.channelId == '1053401642915082392' && [likeId, dislikeId].some(s=> s == reaction.emoji.id)){
    if(reaction.message.author?.id == user.id) return reaction.users.remove(user.id)

    const counterReaction = reaction.emoji.id == likeId ? dislikeId : likeId
    if(reaction.message.reactions.cache.has(counterReaction)){
      reaction.message.reactions.cache.get(counterReaction)?.users.remove(user.id)
    }
  }
}