import { ChannelType, Message } from "discord.js";
import { FrogDb } from "../db";
import { getSnackData } from "../lib/notion";

export async function Reactions(msg: Message<boolean>) {
  const { guildId, channel } = msg

  const { roles, categories, channels } = await getSnackData()
  
  if(msg.mentions.roles.first()?.id == roles.content) msg.react('1053444752340680817')

  if(msg.author.bot) return
  if(msg.mentions.members?.has(FrogDb.id)) msg.react('1061737573959094422')

  if(guildId != FrogDb.serverId) return
  //? Auto reactions to suggestions
  if(msg.channelId == channels.suggestions && !msg.member?.permissions.has('Administrator')) msg.react('1059641676798377995'), msg.react('1059641726387626015')

  if(channel.type != ChannelType.GuildText) return
  //? Auto reactions for verified messages
  if(channel.parentId == categories.verifieds && channel.nsfw && msg.member?.roles.cache.has(roles.verified)){
    if(msg.content.split(/ +/g).length >= 3 || msg.attachments.size){
      if(channel.position > 1) msg.react('1061464848967401502'), msg.react('1061467211329458216'), msg.react('1061467145122369596')
    }
  }
}