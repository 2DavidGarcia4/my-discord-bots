import { MessageReaction, type PartialMessageReaction, type PartialUser, User, ChannelType } from 'discord.js'
import { FrogDb } from '../db'
import { PepeFrogClient, type EventName } from '../client'
import { getSnackData } from '../lib/notion'

export const name: EventName = 'messageReactionAdd'

export async function execute(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: PepeFrogClient) {
  const { serverId, publishingServerId } = FrogDb
  const likeId = '1059641676798377995', dislikeId = '1059641726387626015'
  if(user.bot) return

  console.log(reaction.emoji)
  if(reaction.message.guildId == '1028793496674500659' && reaction.emoji.name == '📣' && reaction.message.attachments.size){
    const messageChannel = reaction.message.channel
    console.log('reaction')
    if(messageChannel.type == ChannelType.GuildText){
      // const server = client.guilds.cache.get(serverId), channelServer = server?.channels.cache.find(f=> f.name == messageChannel.name) 

    }
  }

  if(reaction.message.guildId != serverId) return
  const { channels } = await getSnackData()

  if(reaction.message.channelId == channels.suggestions && [likeId, dislikeId].some(s=> s == reaction.emoji.id)){
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