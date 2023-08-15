import ms from "ms"
import { ActivitiesOptions, ActivityType, ApplicationCommandOptionData, ChannelType, Client, EmbedBuilder } from "discord.js"
import { rafflesModel, surveysModel, carcelModel } from "../../models"
import { botDB } from "../db"
import { svInteractionCommands, interactionCommands } from "./interaction"
import { getBotData, getGuildsData } from "../utils"
import { defaultReady } from "../../shared/functions"

export const readyEvent = async (client: Client) => {
  if (!client.user) return

  const guildsDB = await getGuildsData(client)
  if(guildsDB) botDB.guilds = guildsDB 
  
  const dataBot = await getBotData(client)
  // console.log(botDB)
  defaultReady(client, dataBot?.logs.connections || '', botDB.color.afirmative)
  botDB.color = {...botDB.color, ...dataBot?.color}

  const servidor = client.guilds.cache.get(botDB.serverId)
  const channelSuggestions = servidor?.channels.cache.get(dataBot?.logs.suggestions || '828300239488024587')

  // const newModel = new carcelModel({
  //   _id: botDB.serverId,
  //   prisoners: [],
  // })
  // await newModel.save()

  //! Roles principales automaticos
  servidor?.members.cache.filter(f => !botDB.mainRoles.some(s => f.roles.cache.has(s)) && !f.user.bot).map(m => m).forEach((miembro, ps, mapa) => {
    miembro.roles.add(botDB.mainRoles)
    if (ps + 1 == mapa.length) console.log(`Roles principales agregados a ${ps + 1} miembros.`)
  })

  //? load raffles model
  // let dataSor = await rafflesModel.findById(botDB.serverId), msgsSorteos = 0
  // if (dataSor && dataSor.raffles.length) {
  //   for (let s of dataSor.raffles) {
  //     let canal = servidor?.channels.cache.get(s.channelId)
  //     if (canal && (canal.type == ChannelType.GuildText || canal.type == ChannelType.GuildAnnouncement)) await canal.messages.fetch(s.id).then(ts => {
  //       msgsSorteos++
  //     }).catch(err => {
  //       console.log("mensaje de sorteo no encontrado.", err)
  //     })
  //   }
  //   console.log(msgsSorteos == 0 ? "No hay sorteos que cargar." : `Se han cargado ${msgsSorteos} sorteos.`)
  // }

  //? Load surveys model
  // let dataEnc = await surveysModel.findById(botDB.serverId), msgsEncuestas = 0
  // if (dataEnc && dataEnc.surveys.length) {
  //   for (let e of dataEnc.surveys) {
  //     let canal = servidor?.channels.cache.get(e.channelId)
  //     if (canal && (canal.type == ChannelType.GuildText || canal.type == ChannelType.GuildAnnouncement)) {
  //       await canal.messages.fetch(e.id).then(ts => {
  //         msgsEncuestas++
  //       }).catch(err => {
  //         console.log("mensaje de encuesta no encontrado.", err)
  //       })
  //     }
  //   }
  //   console.log(msgsEncuestas == 0 ? "No hay encuestas que cargar." : `Se han cargado ${msgsEncuestas} encuestas.`)
  // }

  function presencias() {
    const estadosDia: ActivitiesOptions[] = [
      {
        name: botDB.prefix+"ayuda",
        type: ActivityType.Listening
      },
      {
        name: "/ayuda",
        type: ActivityType.Listening
      },
      {
        name: `${client.users.cache.size.toLocaleString()} users.`,
        type: ActivityType.Watching
      },
      {
        name: `moderar con ${client.users.cache.get('935707268090056734')?.username}`,
        type: ActivityType.Playing
      }
    ]

    const estadosNoche: ActivitiesOptions[] = [
      {
        name: `mis sueños.`,
        type: ActivityType.Watching
      },
      {
        name: `zzz`,
        type: ActivityType.Playing
      }
    ]
    let tiempo = new Date()
    if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
      client.user?.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)]] })
    } else {
      client.user?.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)]] })
    }
  }
  presencias()

  function estadisticas() {
    const server = client.guilds.cache.get(botDB.serverId), todosG = server?.memberCount, online = server?.members.cache.filter(f=> f.presence?.status == 'dnd' || f.presence?.status == 'idle' || f.presence?.status == 'online').size, cantBots = server?.members.cache.filter(fb => fb.user.bot).size
    const canalTodos = client.channels.cache.get('823349420106973204')
    const canalMiembros = client.channels.cache.get('823349423349301318')
    const canalBots = client.channels.cache.get('823349426264997919')
    if(canalTodos?.type != ChannelType.GuildVoice) return
    if(canalMiembros?.type != ChannelType.GuildVoice) return
    if(canalBots?.type != ChannelType.GuildVoice) return

    if (canalTodos.name != `『👥』Todos: ${todosG?.toLocaleString()}`){
      canalTodos.edit({ name: `『👥』Todos: ${todosG?.toLocaleString()}` })
    }

    if (canalMiembros.name != `『🟢』En linea: ${online?.toLocaleString()}`){
      canalMiembros.edit({ name: `『🟢』En linea: ${online?.toLocaleString()}` })
    }

    if (canalBots.name != `『🤖』Bots: ${cantBots?.toLocaleString()}`){
      canalBots.edit({ name: `『🤖』Bots: ${cantBots?.toLocaleString()}` })
    }
  }
  estadisticas()

  async function carcel() {
    const dataBot = await getBotData(client)
    const dataCrc = await carcelModel.findById(botDB.serverId), tiempoActual = Date.now(), canalRegistro = servidor?.channels.cache.get(dataBot?.logs.moderation || '')
    
    if (dataCrc && dataCrc.prisoners.length >= 1) {
      for (let d in dataCrc.prisoners) {
        const miembro = servidor?.members.cache.get(dataCrc.prisoners[d].id)
        const msTime = ms(dataCrc.prisoners[d].sentence) || 0
        const durante = msTime >= 86400000 ? `**${Math.floor(msTime / 86400000)}** días` : msTime >= 3600000 ? `**${Math.floor(msTime / 3600000)}** horas` : msTime >= 60000 ? `**${Math.floor(msTime / 60000)}** minutos` : `**${Math.floor(msTime / 1000)}** segundos`
        
        const registroSa = new EmbedBuilder()
        .setTitle(`${botDB.emoji.exit} Pricionero liberado`)
        .setColor(botDB.color.afirmative)
        .setTimestamp()

        
        if (!miembro) {
          const user = client.users.cache.get(dataCrc.prisoners[d].id)
          if(user){
            registroSa
            .setAuthor({name: user?.tag, iconURL: user.displayAvatarURL()})
            .setDescription(`👤 ${user.tag}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisoners[d].reazon}`)
          }
          if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({ embeds: [registroSa] })
          dataCrc.prisoners.splice(parseInt(d), 1)
          await dataCrc.save()

        } else if(miembro && servidor) {
          if ((dataCrc.prisoners[d].time + msTime) - tiempoActual <= 0) {
            const embMDS = new EmbedBuilder()
            .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
            .setTitle(`${botDB.emoji.afirmative} Has salido de la cárcel`)
            .setDescription(`⏱ Cumpliste con la condena de ${durante} en la cárcel.`)
            .setColor(botDB.color.afirmative)
            .setFooter({ text: servidor.name, iconURL: servidor.iconURL() || undefined})
            .setTimestamp()

            registroSa
            .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
            .setDescription(`👤 ${miembro}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisoners[d].reazon}`)
              

            miembro.roles.remove('830260549098405935').then(r => {
              miembro.send({ embeds: [embMDS] }).catch(() => '')
              if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({ embeds: [registroSa] })
            })

            dataCrc.prisoners.splice(parseInt(d), 1)
            await dataCrc.save()
          }
        }
      }
    }
  }
  carcel()

  function vips() {
    let tiempo = new Date(), canal = servidor?.channels.cache.get("826193847943037018")
    if(!canal) return
    if(canal.type != ChannelType.GuildText) return

    if (!canal.permissionsFor("826197551904325712")?.has('MentionEveryone') && [2, 5].some(s => s == tiempo.getDay())) {
      canal.permissionOverwrites.edit("826197551904325712", { "MentionEveryone": true, })

    } else {
      if (canal.permissionsFor("826197551904325712")?.has("MentionEveryone") && ![2, 5].some(s => s == tiempo.getDay())) {
        canal.permissionOverwrites.edit("826197551904325712", { "MentionEveryone": false, })
      }
      servidor?.members.cache.filter(f => !f.user.bot && f.roles.cache.has("826197551904325712")).forEach((miembro) => {
        if (!miembro.permissions.has('Administrator') && !canal?.permissionsFor(miembro.id)?.has("MentionEveryone") && canal?.type == ChannelType.GuildText) {
          canal?.permissionOverwrites.delete(miembro.id)
        }
      })
    }
  }

  async function sorteos() {
    const dataSor = await rafflesModel.findById(botDB.serverId), arraySo = dataSor?.raffles
    if(arraySo){
      for (let s of arraySo) {
        if (s.active && s.ends < Date.now()) {          
          const channel = client.channels.cache.get(s.channelId)
          if(channel?.type != ChannelType.GuildText && channel?.type != ChannelType.GuildAnnouncement) return
          const mensage = channel?.messages?.cache.get(s.id)
          if (mensage) {
            let miembros = s.participants.filter(f => servidor?.members.cache.has(f))
            let bueltas = 1, ganadoresFinal: string[] = []
            for (let r = 0; r < bueltas; r++) {
              let miembroRandom = miembros[Math.floor(Math.random() * miembros.length)]
  
              if (s.winners > ganadoresFinal.length) {
                if (!ganadoresFinal.some(s => s == miembroRandom)) {
                  ganadoresFinal.push(miembros[Math.floor(Math.random() * miembros.length)])
                }
                bueltas++
              }
            }
  
            const emb = mensage.embeds[0]
            if(emb.data.author?.name) emb.data.author.name = "⏹️ Sorteo finalizado"
            if (ganadoresFinal.length == 0) {
              emb.fields[0].value = `*No hubo ganadores ya que nadie participo*\nCreado por: <@${s.authorId}>`
              mensage.reply({ content: `Nadie gano el sorteo.` })
  
            } else {
              emb.fields[0].value = `${ganadoresFinal.length == 1 ? `Ganador/a: ${ganadoresFinal.map(m => `<@${m}>`)[0]}` : `Ganadores: ${ganadoresFinal.map(m => `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${s.authorId}>`
              mensage.reply({ content: `¡Felicidades ${ganadoresFinal.length == 1 ? `${ganadoresFinal.map(m => `<@${m}>`)[0]} has ganado` : `${ganadoresFinal.map(m => `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!` })
            }
            s.active = false
            mensage.edit({ embeds: [emb], content: `*¡Sorteo finalizado!*` })
            await rafflesModel.findByIdAndUpdate(botDB.serverId, { raffles: arraySo })
          }
        }
      }
    }
  }

  async function encuestas() {
    let dataEnc = await surveysModel.findById(botDB.serverId), arrayEn = dataEnc?.surveys
    if(arrayEn){
      for (const e of arrayEn) {
        if (e.active && e.ends < Date.now()) {
          const channel = client.channels.cache.get(e.channelId)
          if(channel?.type != ChannelType.GuildText) return
          const mensage = channel?.messages.cache.get(e.id)

          if (mensage) {
            let opcionesOrdenadas = e.options.sort((a, b) => b.votes - a.votes), totalVotos = 0, bueltas = 1, tabla = []
            opcionesOrdenadas.map(m => totalVotos += m.votes)
  
            for (const o of opcionesOrdenadas) {
              let porcentaje = (o.votes * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
  
              for (let i = 0; i < 20; i++) {
                if (i < parseInt(porcentaje) / 100 * 20) {
                  diseño = diseño.concat(carga)
                } else {
                  diseño = diseño.concat(vacio)
                }
              }
              tabla.push(`**${bueltas == 1 ? "🥇" : bueltas == 2 ? "🥈" : bueltas == 3 ? "🥉" : `${bueltas}`}.** ${o.emoji} ${o.option} *(${o.votes})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
              bueltas++
            }

            mensage.reactions.cache.forEach(react => react.remove())
  
            const embed = mensage.embeds[0]
            if(embed.data.author) embed.data.author.name = `⏹️ Encuesta finalizada`
            embed.fields[0].value = tabla.join("\n\n")
            embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas[0].option}**\nVotos totales: **${totalVotos}**\nCreada por: <@${e.authorId}>`
            mensage.edit({ embeds: [embed], content: '*¡Encuesta finalizada!*' })
            e.active = false
            await surveysModel.findByIdAndUpdate(botDB.serverId, { encuestas: arrayEn })
          }
        }
      }
    }
  }

  function mensajesTemporales() {
    const canales = ["826205120173310032", "823639152922460170", "828300239488024587"]
    canales.forEach(m => {
      const channel = servidor?.channels.cache.get(m)
      if(channel && channel.type == ChannelType.GuildText){
        channel?.send(`***${botDB.emoji.cat} ¡Hola!***`).then(tms => setTimeout(() => { tms.delete() }, 2000))
      }
    })
  }
  // mensajesTemporales()


  setInterval(async () => {
    presencias()
  }, 60 * 60000)

  setInterval(async () => {
    estadisticas()
    carcel()
  }, 30 * 60000)


  // console.log(svInteractionCommands.map(m=> m))
  // console.log(interactionCommands.map(m=> ({name: m.struct.name, pr: m.struct.default_member_permissions})))
  
  svInteractionCommands?.forEach(async (command, key) => {
    if(!(await servidor?.commands.fetch())?.some(s=> s.name == command.struct.name)){
      servidor?.commands.create(command.struct).then((cmd)=> {
        console.log(`Comando ${key} creado`)
      }).catch((err)=> console.log('Error: ', err))
    }
  })

  interactionCommands?.forEach(async (command, key) => {
    if(!(await client.application?.commands.fetch())?.some(s=> s.name == command.struct.name)){
      client.application?.commands.create(command.struct).then((cmd)=> {
        console.log(`Comando publico ${key} creado`)
      }).catch((err)=> console.log('Error: ', err))
    }
  })
  
  // console.log((await servidor?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
  // console.log((await client.application?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))

  // const command = svInteractionCommands.get('crear')?.struct.options as ApplicationCommandOptionData[] | undefined

  // ;(await servidor?.commands.fetch('971218630631129168', {force: true}))?.edit({options: command}).then(c=> console.log('Comando actualizado'))
  // ;(await servidor?.commands.fetch('974763995837894687', {force: true}))?.delete().then(c=> console.log(`Comando ${c.name} eliminado`))
  
  //! Public
  // const command = interactionCommands.get('set')
  
  // ;(await client.application?.commands.fetch('1076941760753840200', {force: true}))?.edit({options: command?.struct.options, defaultMemberPermissions: PermissionFlagsBits.ManageGuild}).then(c=> console.log(`Comando publico ${c.name} actualizado`))
  // ;(await client.application?.commands.fetch('1076941760753840200', {force: true}))?.delete().then(c=> console.log(`Comando publico ${c.name} eliminado`))
}