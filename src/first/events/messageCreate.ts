import { ChannelType, EmbedBuilder, Message, MessageType } from 'discord.js'
import ms from 'ms'
import { botDB } from '../data'
import { type FirstClientData } from '..'
import { BotEvent } from '../..'

export default class MessageCreateEvent extends BotEvent {
  constructor() {
    super('messageCreate')
  }

  async execute(msg: Message<boolean>, client: FirstClientData) {
    const { member, guild, guildId } = msg 
    const { prefix, emoji, color, serverId } = client.data
  
    if(msg.guildId == botDB.serverId){  
      if(msg.author.bot) return
  
      //TODO: Roles de timpo
      if(member){
        const tiempo = Math.floor(Date.now()-Number(member.joinedAt?.valueOf()))
        const tiempos = [
          {condicion: tiempo>=ms("30d") && tiempo<ms("60d"), rol: "975068365032947792"},
          {condicion: tiempo>=ms("60d") && tiempo<ms("90d"), rol: "975068396406329434"},
          {condicion: tiempo>=ms("90d") && tiempo<ms("120d"), rol: "975068402576154654"},
          {condicion: tiempo>=ms("120d") && tiempo<ms("150d"), rol: "975068408464949298"},
          {condicion: tiempo>=ms("150d") && tiempo<ms("180d"), rol: "975068418850050098"},
          {condicion: tiempo>=ms("180d") && tiempo<ms("210d"), rol: "975068424466214922"},
          {condicion: tiempo>=ms("210d") && tiempo<ms("240d"), rol: "975068413816868894"},
          {condicion: tiempo>=ms("240d") && tiempo<ms("270d"), rol: "975068429834915850"},
          {condicion: tiempo>=ms("270d") && tiempo<ms("300d"), rol: "975068435434319903"},
          {condicion: tiempo>=ms("300d") && tiempo<ms("330d"), rol: "975068435832770581"},
          {condicion: tiempo>=ms("330d") && tiempo<ms("360d"), rol: "975068441650274314"},
          {condicion: tiempo>=ms("360d") && tiempo<ms("547d"), rol: "975068449015480402"},
          {condicion: tiempo>=ms("547d") && tiempo<ms("730d"), rol: "975068458045825024"},
          {condicion: tiempo>=ms("730d"), rol: "975068463687139349"},
        ]
        const option = tiempos.find(f=> f.condicion)
        if(option) member.roles.add(option?.rol)
        tiempos.forEach(time=> {
          if(member.roles.cache.has(time.rol) && time.rol != option?.rol){
            member.roles.remove(time.rol)
          } 
        })
      }
      
  
      //TODO: Sistema VIP
      if(msg.channelId == '826193847943037018' && msg.channel.type == ChannelType.GuildText && msg.mentions.everyone && msg.member?.roles.cache.has('826197551904325712') && !msg.member?.permissions.has('Administrator')){
        msg.channel.permissionOverwrites.edit(msg.author.id, {'MentionEveryone': false,})
      }
  
      //TODO: Auto emojis memes
      if(msg.channelId == '845396662930112533'){
        let mci = msg.content
        if(msg.attachments.size >= 1 || mci.includes(".png") || mci.includes(".jpg") || mci.includes(".mp4")){
          msg.react('😂')
          msg.react('938907043014770780')
          msg.react('939974041593319486')
        }
      }
  
      //TODO: General channel
      if(msg.channelId == "773404850972524615"){
        //? Boost/mejoras
        const newBoostEb = new EmbedBuilder()
        .setTitle(`${botDB.emoji.animateBoost} Nueva mejora`)
        .setColor(msg.member?.displayHexColor || 'White')
  
        if(msg.type == MessageType.GuildBoost){
          msg.channel.sendTyping()
          newBoostEb
          .setDescription(`**Gracias** ${msg.author} por la mejora, reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
          setTimeout(()=>{
            msg.channel.send({embeds: [newBoostEb], content: `<@${msg.author.id}>`}).then(mb=> {
              mb.pin(`${msg.author.tag} ha boosteado el servidor.`)
            })
          }, 500)
        }
        if(msg.type == MessageType.GuildBoostTier1){
          msg.channel.sendTyping()
          newBoostEb
          .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **1**, reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
          setTimeout(()=>{
            msg.channel.send({embeds: [newBoostEb], content: `<@${msg.author.id}>`}).then(mb=> {
              mb.pin(`${msg.author.tag} ha boosteado el servidor y por su boost llegamos al nivel 1.`)
            })
          }, 500)
        }
        if(msg.type == MessageType.GuildBoostTier2){
          msg.channel.sendTyping()
          newBoostEb
          .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **2** reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
          setTimeout(()=>{
            msg.channel.send({embeds: [newBoostEb], content: `<@${msg.author.id}>`}).then(mb=> {
              mb.pin(`${msg.author.tag} ha boosteado el servidor y por su boost llegamos al nivel 2.`)
            })
          }, 500)
        }
        if(msg.type == MessageType.GuildBoostTier3){
          msg.channel.sendTyping()
          newBoostEb
          .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **3** reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
          setTimeout(()=>{
            msg.channel.send({embeds: [newBoostEb], content: `<@${msg.author.id}>`}).then(mb=> {
              mb.pin(`${msg.author.tag} ha boosteado el servidor y por su boost llegamos al nivel 3.`)
            })
          }, 500)
        }
  
        //? Respuestas aleatorias
        let cantidad = Math.floor(Math.random()*(100-1)+1)
        if(msg.content.toLowerCase() == "hola" && cantidad >= 30 && cantidad <= 60){
          msg.channel.sendTyping()
          setTimeout(()=>{
            msg.reply("Hola")
          }, 600)
        }
        let xds = ["xd","jaja","jajaja","sjsjs","jsjs","jiji","XD","Xd","xD"]
        if(xds.some(s=> s == msg.content.toLowerCase()) && cantidad >= 30 && cantidad <= 60){
          msg.channel.sendTyping()
          setTimeout(()=>{
            msg.channel.send(xds[Math.floor(Math.random()*xds.length)])
          }, 600)
        }
      }
    }
  
    //TODO: Mensaje por mención
    if(msg.content.match(`^<@!?${client.user?.id}>( |)$`)){
      client.textCommands.get('help')?.execute({message: msg, client})
    }
  
    if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return
    const args = msg.content.slice(prefix.length).trim().split(/ +/g)
    const commandName = args.shift()?.toLowerCase()
  
    if(commandName) {
      client.textCommands.get(commandName)?.execute({message: msg, args, client})
    }
  }
}