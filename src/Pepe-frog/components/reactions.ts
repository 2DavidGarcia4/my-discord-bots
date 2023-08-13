import { ChannelType, Message } from "discord.js";
import { FrogDb } from "../db";
import { getSnackData } from "../lib/notion";

export async function Reactions(msg: Message<boolean>) {
  const { guildId, channel } = msg
  const { serverId, emojisIds } = FrogDb

  const { roles, categories, channels } = await getSnackData()
  
  if(msg.mentions.roles.first()?.id == roles.content) msg.react(emojisIds.more)

  if(msg.author.bot) return
  // if(msg.mentions.members?.has(FrogDb.id)) msg.react('')

  if(guildId != serverId) return
  //? Auto reactions to suggestions
  if(msg.channelId == channels.suggestions && !msg.member?.permissions.has('Administrator')) msg.react(emojisIds.like), msg.react(emojisIds.dislike)

  if(channel.type != ChannelType.GuildText) return
  //? Auto reactions for verified messages
  if(channel.parentId == categories.verifieds && channel.nsfw && msg.member?.roles.cache.has(roles.verified)){
    if(msg.content.split(/ +/g).length >= 3 || msg.attachments.size){
      if(channel.position > 1) msg.react(emojisIds.beatingHeart), msg.react(emojisIds.hearts), msg.react(emojisIds.veryHot)
    }
  }
}