import { ActivitiesOptions, ActivityType, ActionRowBuilder, ButtonBuilder, ChannelType, Client, EmbedBuilder, ButtonStyle, Guild } from "discord.js"
import ms from "ms"
import colors from "colors"
import { suggestionsModel, ticketsModel, rafflesModel, surveysModel, carcelModel, collaboratorsModel, invitesModel, promoLevelModel } from "../models"
import { botDB } from "../db"
import { symbolName } from "typescript"
import { slashComands } from "./interaction"

colors
export const readyEvent = async (client: Client) => {
  if (!client.user) return
  console.log(`Estoy listo ${client.user?.username}`.rainbow.italic)

  const servidor = client.guilds.cache.get(botDB.serverId), readyChannel = client.channels.cache.get('964696468181094410')
  let svch = servidor?.channels.cache.get("828300239488024587")
  const embEncendido = new EmbedBuilder()
  .setTitle(`${botDB.emoji.afirmative} Encendido de nuevo.`)
  .setColor(botDB.color.afirmative)
  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
  .setTimestamp()
  // if (readyChannel && readyChannel.type == ChannelType.GuildText) readyChannel.send({ embeds: [embEncendido] })

  

  // Roles principales automaticos
  servidor?.members.cache.filter(f => !botDB.mainRoles.some(s => f.roles.cache.has(s)) && !f.user.bot).map(m => m).forEach((miembro, ps, mapa) => {
    miembro.roles.add(botDB.mainRoles)
    if (ps + 1 == mapa.length) console.log(`Roles principales agregados a ${ps + 1} miembros.`.blue.italic)
  })

  let dataSug = await suggestionsModel.findById(botDB.serverId), mensajesCargados = 0
  if (dataSug) {
    for (let i in dataSug?.mensajes) {
      if (svch?.type == ChannelType.GuildText && dataSug?.mensajes[i].id.length > 2) {
        await svch?.messages.fetch(dataSug.mensajes[i].id).then(tc => {
          mensajesCargados++
        }).catch(err => {
          console.log("mensaje del sistema de sugerencias no encontrado.".red, err)
        })
      }
    }
    console.log(`Se han cargado ${mensajesCargados} mensajes del sistema de sugerencias`.yellow.italic)
  }

  let dataTs = await ticketsModel.findById(botDB.serverId)
  if (dataTs) {
    dataTs.tickets.forEach(async (objeto) => {
      if (objeto.msgValoracionID != false) {
        const channel = servidor?.channels.cache.get(objeto.id)
        if (channel?.type == ChannelType.GuildText) await channel.messages.fetch(objeto.msgValoracionID).then(msgTC => {
          console.log("Mensaje de valoración cargado.".green)
        })
      }
    })
  }

  let dataSor = await rafflesModel.findById(botDB.serverId), msgsSorteos = 0
  if (dataSor) {
    for (let s of dataSor.sorteos) {
      let canal = servidor?.channels.cache.get(s.canalID)
      if (canal && (canal.type == ChannelType.GuildText || canal.type == ChannelType.GuildAnnouncement)) await canal.messages.fetch(s.id).then(ts => {
        msgsSorteos++
      }).catch(err => {
        console.log("mensaje de sorteo no encontrado.".red, err)
      })
    }
    console.log(msgsSorteos == 0 ? "No hay sorteos que cargar.".magenta.italic : `Se han cargado ${msgsSorteos} sorteos.`.yellow.italic)
  }

  let dataEnc = await surveysModel.findById(botDB.serverId), msgsEncuestas = 0
  if (dataEnc) {
    for (let e of dataEnc.encuestas) {
      let canal = servidor?.channels.cache.get(e.canalID)
      if (canal && (canal.type == ChannelType.GuildText || canal.type == ChannelType.GuildAnnouncement)) {
        await canal.messages.fetch(e.id).then(ts => {
          msgsEncuestas++
        }).catch(err => {
          console.log("mensaje de encuesta no encontrado.", err)
        })
      }
    }
    console.log(msgsEncuestas == 0 ? "No hay encuestas que cargar.".magenta.italic : `Se han cargado ${msgsEncuestas} encuestas.`.yellow.italic)
  }

  function presencias() {
    const estadosDia: ActivitiesOptions[] = [
      {
        name: "p.ayuda",
        type: ActivityType.Listening
      },
      {
        name: "/ayuda",
        type: ActivityType.Listening
      },
      {
        name: `${client.guilds.cache.get(botDB.serverId)?.members.cache.filter(mf => !mf.user.bot).size.toLocaleString()} miembros.`,
        type: ActivityType.Watching
      },
      {
        name: `${client.guilds.cache.get(botDB.serverId)?.channels.cache.filter(ct => ct.type === ChannelType.GuildCategory).size} categorías.`,
        type: ActivityType.Watching
      },
      {
        name: `${client.guilds.cache.get(botDB.serverId)?.members.cache.filter(bf => bf.user.bot).size} Bots.`,
        type: ActivityType.Watching
      },
      {
        name: `${client.guilds.cache.get(botDB.serverId)?.channels.cache.filter(ft => ft.type === ChannelType.GuildText).size} canales.`,
        type: ActivityType.Watching
      },
      {
        name: `${client.guilds.cache.get(botDB.serverId)?.channels.cache.filter(ft => ft.type === ChannelType.GuildVoice).size} canales de voz.`,
        type: ActivityType.Watching
      },
      {
        name: `sus promociones`,
        type: ActivityType.Watching
      },
      {
        name: `moderar con ${client.users.cache.get('935707268090056734')?.username}`,
        type: ActivityType.Playing
      }
    ]

    const estadosNoche: ActivitiesOptions[] = [
      {
        name: `mis sueños, estoy durmiendo.`,
        type: ActivityType.Watching
      },
      {
        name: `a los miembros y durmiendo.`,
        type: ActivityType.Listening
      }
    ]
    let tiempo = new Date()
    if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
      client.user?.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)]] })
    } else {
      client.user?.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)]] })
    }
  }
  // presencias()

  function estadisticas() {
    const server = client.guilds.cache.get(botDB.serverId), todosG = server?.memberCount, soloMiembros = server?.members.cache.filter(fm => !fm.user.bot).size, cantBots = server?.members.cache.filter(fb => fb.user.bot).size
    const channelLog = client.channels.cache.get('960567789263937656')
    const canalTodos = client.channels.cache.get('823349420106973204')
    const canalMiembros = client.channels.cache.get('823349423349301318')
    const canalBots = client.channels.cache.get('823349426264997919')
    if(canalTodos?.type != ChannelType.GuildText) return
    if(canalMiembros?.type != ChannelType.GuildText) return
    if(canalBots?.type != ChannelType.GuildText) return

    let estadoT = null, estadoM = null, estadoB = null, edited = false

    if (canalTodos?.name == `『👥』Todos: ${todosG?.toLocaleString()}`)  estadoT = "Sin actualización"
    else {
      canalTodos.edit({ name: `『👥』Todos: ${todosG?.toLocaleString()}` })
      estadoT = "Se ha actualizado"
      edited = true
    }

    if (canalMiembros.name == `『🧑』Miembros: ${soloMiembros?.toLocaleString()}`) estadoM = "Sin actualización"
    else {
      canalMiembros.edit({ name: `『🧑』Miembros: ${soloMiembros?.toLocaleString()}` })
      estadoM = "Se ha actualizado"
      edited = true
    }

    if (canalBots.name == `『🤖』Bots: ${cantBots?.toLocaleString()}`) {
      estadoB = "Sin actualización"
    } else {
      canalBots.edit({ name: `『🤖』Bots: ${cantBots?.toLocaleString()}` })
      estadoB = "Se ha actualizado"
      edited = true
    }

    if (edited && channelLog?.type == ChannelType.GuildText) {
      const embEstadisticas = new EmbedBuilder()
      .setTitle("Actualización de estadísticas")
      .setDescription(`**『👥』Todos: ${todosG}**\n${estadoT}\n\n**『👤』Miembros: ${soloMiembros}**\n${estadoM}\n\n**『🤖』Bots: ${cantBots}**\n${estadoB}`)
      .setColor(botDB.color.blue)
      .setTimestamp()
      channelLog.send({ embeds: [embEstadisticas] })
    }
  }

  async function carcel() {
    const dataCrc = await carcelModel.findById(botDB.serverId), tiempoActual = Date.now(), canalRegistro = servidor?.channels.cache.get('941170978459910214')
    if (dataCrc && dataCrc.prisioneros.length >= 1) {
      for (let d in dataCrc.prisioneros) {
        const miembro = servidor?.members.cache.get(dataCrc.prisioneros[d].id)
        const tiempo = dataCrc.prisioneros[d].condena
        const msTime = ms(dataCrc.prisioneros[d].condena) || 0
        const durante = msTime >= 86400000 ? `**${Math.floor(msTime / 86400000)}** días` : msTime >= 3600000 ? `**${Math.floor(msTime / 3600000)}** horas` : msTime >= 60000 ? `**${Math.floor(msTime / 60000)}** minutos` : `**${Math.floor(msTime / 1000)}** segundos`
        
        const registroSa = new EmbedBuilder()
        .setTitle(`${botDB.emoji.exit} Pricionero liberado`)
        .setColor(botDB.color.afirmative)
        .setTimestamp()

        if (!miembro && canalRegistro?.type == ChannelType.GuildText) {
          const user = client.users.cache.get(dataCrc.prisioneros[d].id)
          if(user){
            registroSa
            .setAuthor({name: user?.tag, iconURL: user.displayAvatarURL()})
            .setDescription(`👤 ${user.tag}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisioneros[d].razon}`)
          }
          canalRegistro.send({ embeds: [registroSa] })

        } else if(miembro && servidor && canalRegistro?.type == ChannelType.GuildText) {
          // console.log((dataCrc.prisioneros[d].tiempo + msTime) - tiempoActual)
          if ((dataCrc.prisioneros[d].tiempo + msTime) - tiempoActual <= 0) {
            const embMDS = new EmbedBuilder()
            .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
            .setTitle(`${botDB.emoji.afirmative} Has salido de la cárcel`)
            .setDescription(`⏱ Cumpliste con la condena de ${durante} en la cárcel.`)
            .setColor(botDB.color.afirmative)
            .setFooter({ text: servidor.name, iconURL: servidor.iconURL() || undefined})
            .setTimestamp()

            registroSa
            .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
            .setDescription(`👤 ${miembro}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisioneros[d].razon}`)
              

            miembro.roles.remove('830260549098405935').then(r => {
              miembro.send({ embeds: [embMDS] }).catch(() => '')
              canalRegistro.send({ embeds: [registroSa] })
            })

          }
          dataCrc.prisioneros.splice(parseInt(d), 1)
          await dataCrc.save()
        }
      }
    }
  }
  carcel()

  async function colaboradores() {
    let dataCol = await collaboratorsModel.findById(botDB.serverId), arrayCo = dataCol?.colaboradores
    arrayCo?.filter(f => f.colaborador).forEach(async (col, ps) => {
      let canal = servidor?.channels.cache.get(col.canalID), colaborador = client.users.cache.get(col.id)
      if(!canal || !colaborador) return
      if(canal.type != ChannelType.GuildText) return
      if (!colaborador?.dmChannel) {
        colaborador?.createDM()
      }

      const embNotificaccion = new EmbedBuilder()
      .setTitle(`🔔 Notificación`)
      .setDescription(`${colaborador} ya puedes utilizar @everyone o @here en tu canal ${canal}.`)
      .setColor(servidor?.members.cache.get(col.id)?.displayHexColor || 'Random')
      .setFooter({text: `¡Gracias por ser colaborador del servidor.!`, iconURL: client.user?.displayAvatarURL()})

      const boton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        [
          new ButtonBuilder()
          .setCustomId("eliminarMsgMD")
          .setEmoji(botDB.emoji.negative)
          .setLabel("Eliminar mensaje")
          .setStyle(ButtonStyle.Danger)
        ]
      )

      if (col.tiempo == false) {
        if (!col.notificado) {
          colaborador?.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c)
          col.notificado = true
        }
        if(canal && canal.type == ChannelType.GuildText && !canal.permissionsFor(col.id)?.has('MentionEveryone')) {
          canal.permissionOverwrites.edit(col.id, { 'MentionEveryone': true, })
        }

      } else {
        if (col.tiempo <= Date.now()) {
          if (!col.notificado) {
            colaborador?.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c)
            col.notificado = true
            col.tiempo = false
          } else {
            col.tiempo = false
          }
          if (!canal.permissionsFor(col.id)?.has("MentionEveryone")) {
            canal.permissionOverwrites.edit(col.id, { "MentionEveryone": true, })
          }
        } else {
          if (canal.permissionsFor(col.id)?.has("MentionEveryone")) {
            canal.permissionOverwrites.edit(col.id, { "MentionEveryone": false, })
          }
        }
      }
    })
    setTimeout(async () => {
      await collaboratorsModel.findByIdAndUpdate(botDB.serverId, { colaboradores: arrayCo })
    }, 2000)
  }
  colaboradores()

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
  vips()

  async function invitaciones() {
    let dataInv = await invitesModel.findById(botDB.serverId), arrayMi = dataInv?.miembros
    if(!arrayMi) return

    for (const mm of arrayMi) {
      for (const u of mm.invitados) {
        await client.users.fetch(u.id, { force: true }).catch(ci => {
          mm.restantes != 0 ? mm.restantes-- : ""
          mm.falsas++
          mm.invitados.splice(mm.invitados.findIndex(f => f.id == u.id), 1)
        }).then(c => c)
      }
    }

    for (const m of arrayMi) {
      await client.users.fetch(m.id, { force: true }).then(async usuario => {
        if (!servidor?.members.cache.some(s => s.id == usuario.id)) {
          if (m.tiempo != undefined && m.tiempo <= Date.now()) {
            arrayMi?.splice(arrayMi?.findIndex(f => f.id == m.id), 1)
          } else {
            m.tiempo = Math.floor(Date.now() + ms("30d"))
          }
        }
      }).catch(cus => {
        arrayMi?.splice(arrayMi?.findIndex(f => f.id == m.id), 1)
      })
    }

    await servidor?.invites.fetch().then(async invites => {
      for (const invi of invites.map(i => i)) {
        if (arrayMi?.some(s => s.id == invi.inviterId)) {
          let miembro = arrayMi?.find(f => f.id == invi.inviterId)
          if (miembro?.codes.some(s => s.code == invi.code)) {
            let code = miembro?.codes.find(f => f.code == invi.code)
            if (code && code.usos != invi.uses) {
              code.usos = invi.uses || 0
            }
          } else {
            miembro?.codes.push({ code: invi.code, usos: invi.uses || 0 })
          }

        } else if(invi.inviterId) {
          await client.users.fetch(invi.inviterId, { force: true }).then(usuario => {
            if (servidor.members.cache.some(s => s.id == invi.inviterId)) {
              arrayMi?.push({ id: invi.inviterId || 'undefinde', tag: invi.inviter?.tag || 'undefinde', verdaderas: 0, totales: 0, restantes: 0, falsas: 0, tiempo: null, codes: [{ code: invi.code, usos: invi.uses || 0 }], invitados: [] })
            }
          }).catch(c => c)
        }
      }

      let tiempoFor2 = Date.now()
      if(arrayMi){
        for (const mi of arrayMi) {
          let tiempoForAdentro = Date.now()
          let codigos = mi.codes.filter(f => !invites.some(s => s.code == f.code))
          for (const c of codigos) mi.codes.splice(mi.codes.findIndex(f => f.code == c.code), 1)
        }
      }

    }).catch(c => c)
    await invitesModel.findByIdAndUpdate(botDB.serverId, { miembros: arrayMi })

  }
  invitaciones()

  async function sorteos() {
    let dataSor = await rafflesModel.findById(botDB.serverId), arraySo = dataSor?.sorteos
    if(arraySo){
      for (const s of arraySo) {
        if (s.activo && s.finaliza < Date.now()) {
          const channel = client.channels.cache.get(s.canalID)
          if(channel?.type != ChannelType.GuildText) return
          const mensage = channel?.messages?.cache.get(s.id)
          if (mensage) {
            let miembros = s.participantes.filter(f => servidor?.members.cache.has(f))
            let bueltas = 1, ganadoresFinal: string[] = []
            for (let r = 0; r < bueltas; r++) {
              let miembroRandom = miembros[Math.floor(Math.random() * miembros.length)]
  
              if (s.ganadores > ganadoresFinal.length) {
                if (!ganadoresFinal.some(s => s == miembroRandom)) {
                  ganadoresFinal.push(miembros[Math.floor(Math.random() * miembros.length)])
                }
                bueltas++
              }
            }
  
            const emb = mensage.embeds[0]
            if(emb.author?.name) emb.author.name = "⏹️ Sorteo finalizado"
            if (ganadoresFinal.length == 0) {
              emb.fields[0].value = `*No hubo ganadores ya que nadie participo*\nCreado por: <@${s.autorID}>`
              mensage.reply({ content: `Nadie gano el sorteo.` })
  
            } else {
              emb.fields[0].value = `${ganadoresFinal.length == 1 ? `Ganador/a: ${ganadoresFinal.map(m => `<@${m}>`)[0]}` : `Ganadores: ${ganadoresFinal.map(m => `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${s.autorID}>`
              mensage.reply({ content: `¡Felicidades ${ganadoresFinal.length == 1 ? `${ganadoresFinal.map(m => `<@${m}>`)[0]} has ganado` : `${ganadoresFinal.map(m => `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!` })
            }
            s.activo = false
            mensage.edit({ embeds: [emb] })
            await rafflesModel.findByIdAndUpdate(botDB.serverId, { sorteos: arraySo })
          }
        }
      }
    }
  }
  sorteos()

  async function encuestas() {
    let dataEnc = await surveysModel.findById(botDB.serverId), arrayEn = dataEnc?.encuestas
    if(arrayEn){
      for (const e of arrayEn) {
        if (e.activa && e.finaliza < Date.now()) {
          const channel = client.channels.cache.get(e.canalID)
          if(channel?.type != ChannelType.GuildText) return
          let mensage = channel?.messages.cache.get(e.id)
          if (mensage) {
            let opcionesOrdenadas = e.opciones.sort((a, b) => b.votos - a.votos), totalVotos = 0, bueltas = 1, tabla = []
            opcionesOrdenadas.map(m => totalVotos += m.votos)
  
            for (const o of opcionesOrdenadas) {
              let porcentaje = (o.votos * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
  
              for (let i = 0; i < 20; i++) {
                if (i < parseInt(porcentaje) / 100 * 20) {
                  diseño = diseño.concat(carga)
                } else {
                  diseño = diseño.concat(vacio)
                }
              }
              tabla.push(`**${bueltas == 1 ? "🥇" : bueltas == 2 ? "🥈" : bueltas == 3 ? "🥉" : `${bueltas}`}.** ${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
              bueltas++
            }
  
            const embed = mensage.embeds[0]
            if(embed.author?.name) embed.author.name = `▶️ Encuesta finalizada`
            embed.fields[0].value = tabla.join("\n\n")
            embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas[0].opcion}**\nVotos totales: **${totalVotos}**\nCreada por: <@${e.autorID}>`
            mensage.edit({ embeds: [embed] })
            e.activa = false
            await surveysModel.findByIdAndUpdate(botDB.serverId, { encuestas: arrayEn })
  
          }
        }
      }
    }
  }
  // encuestas()

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

  async function promoNvl() {
    let dataPrl = await promoLevelModel.findById(botDB.serverId), arrayPl = dataPrl?.miembros, canal = servidor?.channels.cache.get(dataPrl?.datos.canalID || '')
    if(arrayPl && canal?.type == ChannelType.GuildText){
      arrayPl.filter(f => servidor?.members.cache.has(f.id)).forEach((miembro) => {
        const usuario = client.users.cache.get(miembro.id)
        if (!usuario?.dmChannel) usuario?.createDM()
        
        const embNotificaccion = new EmbedBuilder()
          .setTitle(`🔔 Notificación`)
          .setDescription(`${usuario} ya puedes publicar contenido en ${canal}.`)
          .setColor(servidor?.members.cache.get(miembro.id)?.displayHexColor || 'Random')
          .setFooter({text: `Si no quieres ser notificado bloquéame`, iconURL: client.user?.displayAvatarURL()})
  
        const boton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          [
            new ButtonBuilder()
            .setCustomId("eliminarMsgMD")
            .setEmoji(botDB.emoji.negative)
            .setLabel("Eliminar mensaje")
            .setStyle(ButtonStyle.Danger)
          ]
        )

        if (!miembro.tiempo) {
          if (!miembro.notificado) {
            miembro.notificado = true
            usuario?.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c)
          }
          if (usuario?.id && !canal?.permissionsFor(usuario?.id)?.has('SendMessages') && canal?.type == ChannelType.GuildText) {
            canal?.permissionOverwrites.edit(usuario?.id, { "SendMessages": true, })
          }
  
        } else if(canal?.type == ChannelType.GuildText && usuario?.id) {
          if (miembro.tiempo <= Date.now()) {
            if (!miembro.notificado) {
              miembro.notificado = true
              usuario?.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c)
            }
            miembro.tiempo = null
            if (!canal?.permissionsFor(miembro.id)?.has("SendMessages")) {
              canal.permissionOverwrites.edit(usuario.id, { "SendMessages": true, })
            }
          } else {
            if (canal.permissionsFor(miembro.id)?.has("SendMessages")) {
              canal.permissionOverwrites.edit(usuario.id, { "SendMessages": false, })
            }
          }
        }
      })
    }

    setTimeout(async () => {
      await promoLevelModel.findByIdAndUpdate(botDB.serverId, { miembros: arrayPl })
    }, 6000)
  }
  // promoNvl()

  // setInterval(async () => {
  //   presencias()
  //   colaboradores()
  //   sorteos()
  //   encuestas()
  // }, 2 * 60000)

  // setInterval(async () => {
  //   estadisticas()
  //   carcel()
  //   vips()
  //   promoNvl()
  // }, 30 * 60000)

  slashComands?.forEach(async (command, position) => {
    if(!(await servidor?.commands.fetch())?.some(s=> s.name == command.name)){
      servidor?.commands.create(command).then((cmd)=> {
        console.log(`Comando ${cmd.name} creado | posicion: ${position}`.cyan.italic)
      }).catch((err)=> console.log('Error: ', err))
    }
  })

  // console.log((await servidor?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))

  // const command = slashComands.get('encarcelar')
  // ;(await servidor?.commands.fetch('972168438321651752', {force: true}))?.edit({defaultMemberPermissions: 'ManageMessages'}).then(c=> console.log('Comando actualizado'))
}