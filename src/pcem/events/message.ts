import { ChannelType, Client, ColorResolvable, EmbedBuilder, Message, MessageType, WebhookClient } from "discord.js";
import ms from "ms";
import { botModel, ticketsModel } from "../models";
import { botDB } from "../db";
import { helpCommand } from "../commands/text/help";
import { commandsCommand } from "../commands/text/commands";
import { addReactionCommand } from "../commands/text/addReaction";
import { rolesCommand } from "../commands/text/roles";
import { ticketCommand } from "../commands/text/ticket";
import { informationCommand } from "../commands/text/information";
import { autoModeration, estadisticas, exemptMessagesIds } from "..";
import { sendMessageText } from "../../utils/functions";
import { evalCommand } from "../commands/text/eval";
import { moderationSanction } from "../utils";
import { rulesCommand } from "../commands/text/reglas";


export const messageEvent = async (msg: Message<boolean>, client: Client) => {
  const { member } = msg, { prefix, emoji, color } = botDB

  if(msg.guildId == botDB.serverId){
    estadisticas.mensajes++

    //TODO: Sistema de tickets
    let dataTs = await ticketsModel.findById(botDB.serverId), arrayTs = dataTs?.tickets, servidor2 = client.guilds.cache.get('949860813915705354')
    if(arrayTs){
      arrayTs.forEach(async (objeto) =>{
        if(objeto.id == msg.channelId){
          if(objeto.publico && msg.member?.roles.cache.has('887444598715219999') && msg.channel.type == ChannelType.GuildText){
            objeto.publico = false
            objeto.personalID = msg.author.id
            await ticketsModel.findByIdAndUpdate(botDB.serverId, {tickets: arrayTs})

            msg.channel.permissionOverwrites.edit(msg.author.id, {'ViewChannel': true, 'SendMessages': true})
            msg.channel.permissionOverwrites.delete('773271945894035486')
            msg.channel.permissionOverwrites.delete('831669132607881236')
          }
  
          if(msg.content.length == 0 && msg.embeds.length == 0 && msg.components.length == 0 && msg.attachments.size == 0) return;
          const channelServer2 = servidor2?.channels.cache.get(objeto.copiaID)
          if(channelServer2?.type == ChannelType.GuildText){
            let webhook = (await channelServer2.fetchWebhooks()).map(w=>w.url)
            const webhookCl = new WebhookClient({url: webhook[0]})
            const contentWebhook = {
              username: msg.author.username, 
              avatarURL: msg.author.displayAvatarURL(), 
              content: msg.content || undefined, 
              embeds: msg.embeds, 
              components: msg.components, 
              files: msg.attachments.map(a=>a)
            }
            webhookCl.send(contentWebhook)
          }
        }
      })
    }
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

    //TODO: Mensaje por mención
    if(msg.content.match(`^<@!?${client.user?.id}>( |)$`)){
      msg.channel.sendTyping()
      const embedMen = new EmbedBuilder()
      .setAuthor({name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL()})
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .setTitle(`Soy ${client.user?.username}`)
      .setDescription(`**El bot de ${msg.guild?.name}**, ¿necesitas información o ayuda?`)
      .addFields(
        {name: `${emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
        {name: `${emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
      )
      .setColor(msg.guild?.members.me?.displayHexColor || 'White')
      .setFooter({text: msg.guild?.name || 'undefined', iconURL: msg.guild?.iconURL() || undefined})
      .setTimestamp()
      sendMessageText(msg, {embeds: [embedMen]})
    }


    //* Auto moderación -----------------------------
    const discordDomains = ["discord.gg/","discord.com/invite/"]
    const urlIncludes = ['https://', 'http://', '.com', 'discord.']
    if(!msg.member?.roles.cache.has('887444598715219999') && !msg.member?.permissions.has('Administrator') && urlIncludes.some(s=> msg.content.includes(s))){
      const dataBot = await botModel.findById(client.user?.id)
      if(!dataBot) return
      const canalesPerIDs = msg.guild?.channels.cache.filter(fc => dataBot.autoModeration.ignoreCategories.includes(fc.parentId || '')).map(mc => mc.id)
      const otrosIDCha = dataBot.autoModeration.ignoreChannels
      canalesPerIDs?.push(...otrosIDCha)
      

      if(!canalesPerIDs?.some(s=> s == msg.channelId)){
        console.log('aaa')
        let urls = msg.content.split(/ +/g).map(m=> m.split('\n')).flat().filter(f=> urlIncludes.some(s=> f.includes(s)))
        const UrlWarningEb = new EmbedBuilder()
        .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
        .setTitle(`🔗 Auto moderación de enlaces`)
        .setDescription(`En este canal no están permitidos los enlaces, hay otros canales que si los permiten pero no todo tipo de enlaces.\n\n*Lee la descripción de cada canal, normalmente contiene información de que esta permitido en el canal o puedes preguntarle a un administrador o moderador*`)
        .setColor(color.negative)
        .setFooter({text: msg.guild?.name || 'undefined', iconURL: msg.guild?.iconURL() || undefined})

        if(urls.every(e=> discordDomains.some(s=> e.includes(s)))){
          for(let url of urls) {
            console.log(url)

            let invitation = await client.fetchInvite(url)

            if(!(invitation.guild?.id == msg.guildId)){
              msg.reply({embeds: [UrlWarningEb], content: `<@${msg.author.id}>`}).then(te=> {
                exemptMessagesIds.push(te.id)
                setTimeout(()=> msg.delete().catch(), 300)
                setTimeout(()=> {
                  te.delete().catch()
                }, 25000)
              })

              const autoModMember = autoModeration.find(f=> f.memberId==msg.author.id)
              
              if(autoModMember){
                autoModMember.warnings++
                moderationSanction(msg, autoModMember)
              }else{
                autoModeration.push({memberId: msg.author.id, warnings: 1})
              } 
              return
            }
          }
        }else{
          msg.reply({embeds: [UrlWarningEb], content: `<@${msg.author.id}>`}).then(te=> {
            exemptMessagesIds.push(te.id)
            setTimeout(()=> msg.delete().catch(), 300)
            setTimeout(()=> {
              te.delete().catch()
            }, 25000)
          })

          const autoModMember = autoModeration.find(f=> f.memberId==msg.author.id)
          
          if(autoModMember){
            autoModMember.warnings++
            moderationSanction(msg, autoModMember)
          }else{
            autoModeration.push({memberId: msg.author.id, warnings: 1})
          } 
          return
        }
      }
    }
  }

  if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return
  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift()?.toLowerCase()

  if(command == 'ayuda') helpCommand(msg, client)

  if(['comandos', 'cmds'].some(s=> s==command)) commandsCommand(msg, client, args)

  if(msg.member?.permissions.has('Administrator')){
    if(['addreaction', 'addrc'].some(s=> s==command)) addReactionCommand(msg, client, args)
    if(command == 'roles') rolesCommand(msg)
    if(command == 'ticket') ticketCommand(msg)
    if(command == 'informacion') informationCommand(msg)
    if(command == 'rules') rulesCommand(msg, client)
  }

  if(botDB.owners.some(s=> s==msg.author.id)){
    if(['eval', 'ev'].some(s=> s==command)) evalCommand(msg, client, args.join(' '))
  }
}