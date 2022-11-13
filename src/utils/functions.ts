import { EmbedBuilder, ColorResolvable, Message, MessagePayload, MessageReplyOptions, ChatInputCommandInteraction, CacheType, GuildMember, SelectMenuInteraction, UserContextMenuCommandInteraction } from "discord.js";
import ms from "ms";
import { botDB } from "../db";
import { promoLevelModel } from "../models";
import { DictionaryMenu, MembersPrl } from "../types";

const { color, emoji } = botDB

export const sendMessageText = (msg: Message, optionsMessage: string | MessagePayload | MessageReplyOptions) => {
  setTimeout(()=> {
    msg.reply(optionsMessage)
  }, 500)
}

export const sendMessageSlash = (int: ChatInputCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType>, optionsMessage: string | MessagePayload | MessageReplyOptions) => {
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
    msg.reply({allowedMentions: {repliedUser: false}, embeds: [createEmbedMessage(`${emoji.negative} Error`, description, color.negative)]}).then(tnt => setTimeout(()=>{
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
    await int.editReply({ embeds: [createEmbedMessage(`${emoji.negative} Error`, description, color.negative)]})
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

export const selectRole = (int: SelectMenuInteraction<CacheType>, value: string, dictionary: DictionaryMenu[], author: GuildMember) => {
  dictionary.forEach(element=> {
    if(author.roles.cache.has(element.rol)){
      author.roles.remove(element.rol)
      element.status = 'remove'
      
    }else if(element.value == value){
      author.roles.add(element.rol)
      element.status = 'add'
    }
  })
  
  const addRoles = dictionary.filter(f=> f.status == 'add'), removeRoles = dictionary.filter(f=> f.status == 'remove')
  const title = addRoles.length>0 && removeRoles.length>0 ? `🔁 Intercambio de roles` : addRoles.length>0 ? `${emoji.addition} Rol agregado` : `${emoji.subtraction} Rol eliminado`  
  const description = addRoles.length>0 && removeRoles.length>0 ? `Solo puedes tener un rol de este tipo por lo tanto te he eliminado ${removeRoles.length>1 ? 'los roles '+removeRoles.map((m)=> `**<@&${m.rol}>**`).join(', ') : `el rol **<@&${removeRoles[0]?.rol}>**`} y te he agregado el rol **<@&${addRoles[0]?.rol}>** el cual has elegido ahora.` : addRoles.length>0 ? `Se te agrego el rol **<@&${addRoles[0].rol}>**.` : `Se te elimino el rol **<@&${removeRoles[0].rol}>**.`

  const rolStatusEb = new EmbedBuilder({title, description})
  .setColor(addRoles.length>0 && removeRoles.length>0 ? color.yellow : addRoles.length>0 ? color.afirmative : color.negative)
  int.reply({ephemeral: true, embeds: [rolStatusEb]})
}

export const selectMultipleRoles = (int: SelectMenuInteraction<CacheType>, values: string[], dictionary: DictionaryMenu[], author: GuildMember) => {
  values.forEach(value => {
    const element = dictionary.find(f=> f.value == value)
    if(element){
      if(!author?.roles.cache.has(element.rol)){
        author?.roles.add(element.rol)
        element.status = 'add'

      }else{
        author.roles.remove(element.rol)
        element.status = 'remove'
      }
    }
  })

  const addRoles = dictionary.filter(f=> f.status == 'add'),  removeRoles = dictionary.filter(f=> f.status == 'remove')
  const title = addRoles.length>0 && removeRoles.length>0 ? `🔁 Roles agregados y eliminados` : addRoles.length>0 ? `${emoji.addition} Roles agregados` : `${emoji.subtraction} Roles eliminados`  

  const rolStatusEb = new EmbedBuilder({title})
  .setDescription(`${addRoles.length>0 ? `Roles que se te agregaron:\n${addRoles.map((m, i)=> `${i+1}. <@&${m.rol}>`).join('\n')}\n\n` : ''} ${removeRoles.length>0 ? `Roles que se te eliminaron:\n${removeRoles.map((m, i)=> `${i+1}. <@&${m.rol}>`).join('\n')}` : ''}`)
  .setColor(addRoles.length>0 && removeRoles.length>0 ? color.yellow : addRoles.length>0 ? color.afirmative : color.negative)
  int.reply({ephemeral: true, embeds: [rolStatusEb]})
}