import { ChannelType, Client, Collection, EmbedBuilder, Message, MessageType } from 'discord.js'
import ms from 'ms'
import { readdirSync } from 'fs'
import { botDB } from '../db'
import { autoModeration, svStatistics, exemptMessagesIds } from '..'
import { getBotData, moderationSanction } from '../utils'

const isDist = __dirname.includes('src') ? 'src' : 'dist'

export const textCommands = new Collection<string, {run: ((msg: any, client: any, args: string[])=> any), alias: string[]}>()
readdirSync(`./${isDist}/first/commands/text/`).forEach(async folder=> {
  readdirSync(`./${isDist}/first/commands/text/${folder}/`).forEach(async file=> {
    const command = require(`../commands/text/${folder}/${file}`)
    const cmdFunction = command[Object.keys(command)[1]]
    const alias = command[Object.keys(command)[2]] || []
    textCommands.set(command.name, {run: cmdFunction, alias})
  })
})


export const messageEvent = async (msg: Message<boolean>, client: Client) => {
  const { member, guild, guildId } = msg, { prefix, emoji, color, serverId } = botDB

  if(msg.guildId == botDB.serverId){
    svStatistics.messages++

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


    //* Auto moderación -----------------------------
    const discordDomains = ["discord.gg/","discord.com/invite/"]
    const urlIncludes = ['https://', 'http://', '.com', 'discord.']
    if(!msg.member?.roles.cache.has('887444598715219999') && !msg.member?.permissions.has('Administrator') && urlIncludes.some(s=> msg.content.includes(s))){
      const dataBot = await getBotData(client)
      if(!dataBot) return
      const canalesPerIDs = msg.guild?.channels.cache.filter(fc => dataBot.autoModeration.ignoreCategories.includes(fc.parentId || '')).map(mc => mc.id)
      const otrosIDCha = dataBot.autoModeration.ignoreChannels
      canalesPerIDs?.push(...otrosIDCha)
      

      if(!canalesPerIDs?.some(s=> s == msg.channelId)){
        let urls = msg.content.split(/ +/g).map(m=> m.split('\n')).flat().filter(f=> urlIncludes.some(s=> f.includes(s)))
        const UrlWarningEb = new EmbedBuilder()
        .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
        .setTitle(`🔗 Auto moderación de enlaces`)
        .setDescription(`En este canal no están permitidos los enlaces, hay otros canales que si los permiten pero no todo tipo de enlaces.\n\n*Lee la descripción de cada canal, normalmente contiene información de que esta permitido en el canal o puedes preguntarle a un administrador o moderador*`)
        .setColor(color.negative)
        .setFooter({text: msg.guild?.name || 'undefined', iconURL: msg.guild?.iconURL() || undefined})

        if(urls.every(e=> discordDomains.some(s=> e.includes(s)))){
          for(let url of urls) {
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

  //TODO: Mensaje por mención
  if(msg.content.match(`^<@!?${client.user?.id}>( |)$`)){
    textCommands.get('help')?.run(msg, client, [])
  }

  if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return
  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const commandName = args.shift()?.toLowerCase()

  

  if(commandName) {
    const command = textCommands.get(commandName) || textCommands.find(f=> f.alias.some(s=> s==commandName))
    svStatistics.commands++
    botDB.usedCommands++
    if(command) return command.run(msg, client, args)
  }
}