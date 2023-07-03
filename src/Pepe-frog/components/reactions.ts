import { ChannelType, Message } from "discord.js";
import { FrogDb } from "../db";

export function Reactions(msg: Message<boolean>) {
  const { guildId, channel } = msg
  
  if(msg.mentions.roles.first()?.id == FrogDb.roles.content) msg.react('1053444752340680817')

  if(msg.author.bot) return
  if(msg.mentions.members?.has(FrogDb.me.id)) msg.react('1061737573959094422')

  if(guildId != FrogDb.serverId) return
  //? Auto reactions to suggestions
  if(msg.channelId == '1053401642915082392' && !msg.member?.permissions.has('Administrator')) msg.react('1059641676798377995'), msg.react('1059641726387626015')

  if(channel.type != ChannelType.GuildText) return
  //? Auto reactions for verified messages
  if(channel.parentId == '1053401639454773338' && channel.nsfw && msg.member?.roles.cache.has(FrogDb.roles.verified)){
    if(msg.content.split(/ +/g).length >= 3 || msg.attachments.size){
      if(channel.position > 1) msg.react('1061464848967401502'), msg.react('1061467211329458216'), msg.react('1061467145122369596')
    }
  }
}