import { EmbedBuilder, ColorResolvable, Message, MessagePayload, MessageReplyOptions, ChatInputCommandInteraction, CacheType, GuildMember, SelectMenuInteraction, UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction, ActivitiesOptions, Client } from "discord.js";
import ms from "ms";
import { botDB } from "../db";
import { promoLevelModel } from "../models";
import { DictionaryMenu, MembersPrl } from "../types";

const { color, emoji } = botDB

export const sendMessageText = (msg: Message, optionsMessage: string | MessagePayload | MessageReplyOptions) => {
  setTimeout(()=> {
    msg.reply(optionsMessage)
  }, 4000)
}

export const sendMessageSlash = (int: ChatInputCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>, optionsMessage: string | MessagePayload | MessageReplyOptions) => {
  setTimeout(async () => {
    await int.editReply(optionsMessage)
  }, 4000)
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
  }, 4000)
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

export const setSlashError = async (int: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>, description: string) => {
  await int.deferReply({ephemeral: true})
  setTimeout(async ()=>{
    await int.editReply({ embeds: [createEmbedMessage(`${emoji.negative} Error`, description, color.negative)]})
  }, 4000)
}

export const setSlashErrors = (int: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>, descriptionsAndConditions: ((string | boolean)[])[]) => {
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
  const { locale } = int, inEnglish = locale == 'en-US'
  
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
  const title = addRoles.length>0 && removeRoles.length>0 ? inEnglish ? '🔁 Role reversal' : `🔁 Intercambio de roles` : addRoles.length>0 ? `${emoji.addition} ${inEnglish ? 'Added role' : 'Rol agregado'}` : `${emoji.subtraction} ${inEnglish ? 'Role removed' : 'Rol eliminado'}`  
  const description = addRoles.length>0 && removeRoles.length>0 ? `${inEnglish ? 'You can only have one role of this type therefore I have eliminated you' : 'Solo puedes tener un rol de este tipo por lo tanto te he eliminado'} ${removeRoles.length>1 ? `${inEnglish ? 'the roles' : 'los roles'} `+removeRoles.map((m)=> `**<@&${m.rol}>**`).join(', ') : `${inEnglish ? 'the rol' : 'el rol'} **<@&${removeRoles[0]?.rol}>**`} ${inEnglish ? 'and I have added the role' : 'y te he agregado el rol'} **<@&${addRoles[0]?.rol}>** ${inEnglish ? 'which one have you chosen now?' : 'el cual has elegido ahora'}.` : addRoles.length>0 ? `${inEnglish ? 'The role was added' : 'Se te agrego el rol'} **<@&${addRoles[0].rol}>**.` : `${inEnglish ? 'Your role is removed' : 'Se te elimino el rol'} **<@&${removeRoles[0].rol}>**.`

  const rolStatusEb = new EmbedBuilder({title, description})
  .setColor(addRoles.length>0 && removeRoles.length>0 ? color.yellow : addRoles.length>0 ? color.afirmative : color.negative)
  int.reply({ephemeral: true, embeds: [rolStatusEb]})
}

export const selectMultipleRoles = (int: SelectMenuInteraction<CacheType>, values: string[], dictionary: DictionaryMenu[], author: GuildMember) => {
  const { locale } = int, inEnglish = locale == 'en-US'
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
  const title = addRoles.length>0 && removeRoles.length>0 ? `🔁 ${inEnglish ? 'Roles added and removed' : 'Roles agregados y eliminados'}` : addRoles.length>0 ? `${emoji.addition} ${inEnglish ? 'Added roles' : 'Roles agregados'}` : `${emoji.subtraction} ${inEnglish ? 'Deleted roles' : 'Roles eliminados'}`  

  const rolStatusEb = new EmbedBuilder({title})
  .setDescription(`${addRoles.length>0 ? `${inEnglish ? 'Roles added to you' : 'Roles que se te agregaron'}:\n${addRoles.map((m, i)=> `${i+1}. <@&${m.rol}>`).join('\n')}\n\n` : ''} ${removeRoles.length>0 ? `${inEnglish ? 'Roles that have been removed' : 'Roles que se te eliminaron'}:\n${removeRoles.map((m, i)=> `${i+1}. <@&${m.rol}>`).join('\n')}` : ''}`)
  .setColor(addRoles.length>0 && removeRoles.length>0 ? color.yellow : addRoles.length>0 ? color.afirmative : color.negative)
  int.reply({ephemeral: true, embeds: [rolStatusEb]})
}

export const presences = (dayStates: ActivitiesOptions[], nightStates: ActivitiesOptions[], client: Client) => {
  const tiempo = new Date()
  if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
    client.user?.setPresence({ status: "idle", activities: [nightStates[Math.floor(Math.random() * nightStates.length)]] })
  } else {
    client.user?.setPresence({ status: "online", activities: [dayStates[Math.floor(Math.random() * dayStates.length)]] })
  }
}