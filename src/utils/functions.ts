import { EmbedBuilder, ColorResolvable, Message, InviteGuild, MessagePayload, MessageReplyOptions, ChatInputCommandInteraction, CacheType, MessageReaction, PartialMessageReaction, User, PartialUser, TextChannel, Guild } from "discord.js";
import ms from "ms";
import { botDB } from "../db";
import { promoLevelModel } from "../models";
import { MembersPrl } from "../types";

export const sendMessageText = (msg: Message, optionsMessage: string | MessagePayload | MessageReplyOptions) => {
  setTimeout(()=> {
    msg.reply(optionsMessage)
  }, 500)
}

export const sendMessageSlash = (int: ChatInputCommandInteraction<CacheType>, optionsMessage: string | MessagePayload | MessageReplyOptions) => {
  setTimeout(async () => {
    await int.editReply(optionsMessage)
  }, 600)
}

export const createEmbedMessage = (title: string, description: string, color: ColorResolvable) => {
  return new EmbedBuilder({title, description}).setColor(color)
}

export const setError = (msg: Message, description: string) => {
  msg.channel.sendTyping()
  setTimeout(()=>{
    msg.reply({allowedMentions: {repliedUser: false}, embeds: [createEmbedMessage(`${botDB.emoji.negative} Error`, description, botDB.color.negative)]}).then(tnt => setTimeout(()=>{
      tnt.delete().catch(()=> '')
      msg.delete().catch(()=> '')
    }, 20000));
  }, 500)
}

export const setErrors = (msg: Message, descriptionsAndConditions: [(string | boolean)[], never[]]) => {
  let res = false
  for(const dac of descriptionsAndConditions){
    if(dac[0]){
      setError(msg, typeof dac[1] == 'boolean' ? '' : dac[1])
      res = true
      break
    }
  }
  return res
}

export const setSlashError = async (int: ChatInputCommandInteraction<CacheType>, description: string) => {
  await int.deferReply({ephemeral: true})
  setTimeout(async ()=>{
    await int.editReply({ embeds: [createEmbedMessage(`${botDB.emoji.negative} Error`, description, botDB.color.negative)]})
  }, 500)
}

export const setSlashErrors = (int: ChatInputCommandInteraction<CacheType>, descriptionsAndConditions: ((string | boolean)[])[]) => {
  let res = false
  for(const dac of descriptionsAndConditions){
    if(dac[0]){
      setSlashError(int, typeof dac[1] == 'boolean' ? '' : dac[1])
      res = true
      break
    }
  }
  return res
}

export const promotionLevelNotificationReset = async (msg: Message, membersPrl: MembersPrl, time: string) => {
  if(membersPrl?.some(s=> s.id==msg.author.id)){
    let miembro = membersPrl.find(f=> f.id==msg.author.id)
    if(miembro){
      miembro.tag = msg.author.tag
      miembro.tiempo = Math.floor(Date.now()+ms(time))
      miembro.notificado = false
      await promoLevelModel.findByIdAndUpdate(botDB.serverId, {miembros: membersPrl})
    }
  }else{
    membersPrl?.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms(time)), notificado: false})
    await promoLevelModel.findByIdAndUpdate(botDB.serverId, {miembros: membersPrl})
  }
}