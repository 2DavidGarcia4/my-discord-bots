import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ChannelType } from "discord.js";
import { botDB } from "../../../db";
import { rafflesModel, surveysModel } from "../../../models";
import { setSlashError, setSlashErrors } from "../../../utils/functions";

export const finalizarScb = new SlashCommandBuilder()
.setName("finalizar")
.setDescription(`¡Finaliza algo!`)
.addSubcommand(encuesta=> 
  encuesta.setName(`encuesta`)
  .setDescription(`⏹️ Finaliza una encuesta antes del tiempo determinado.`)
  .addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del mensaje de la encuesta a finalizar.`)
  .setRequired(true))
)
.addSubcommand(sorteo=> 
  sorteo.setName(`sorteo`)
  .setDescription(`⏹️ Finaliza un sorteo antes del tiempo determinado.`)
  .addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del mensaje del sorteo a finalizar.`)
  .setRequired(true))
).toJSON()


export const finalizarSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, options } = int, subCommand = options.getSubcommand(true), { emoji, color, serverId } = botDB, author = guild?.members.cache.get(user.id)

  if(subCommand == "encuesta"){
    const dataEnc = await surveysModel.findById(serverId), arrayEn = dataEnc?.encuestas, messageId = int.options.getString('id', true)

    if(setSlashErrors(int, [
      [
        Boolean(isNaN(Number(messageId))),
        `La ID de la encuesta *(${messageId})* no es valida ya que contiene caracteres no numéricos.`
      ],
      [
        Boolean(!arrayEn?.some(s=>s.id == messageId)),
        `La ID que proporcionaste *(${messageId})* no coincide con la ID de ningúna encuesta en el servidor.`
      ],
      [
        Boolean(!arrayEn?.filter(f=> f.activa).some(s=>s.id == messageId)),
        `La ID que proporcionaste *(${messageId})* no coincide con la de ningúna encuesta activa pero si con la de una encuesta que ha finalizado, solo puedes finalizar las encuestas que estén activas.`
      ]
    ])) return

    const encuesta = arrayEn?.find(f=> f.id == messageId), canal = client.channels.cache.get(encuesta?.canalID || ''), message = canal?.type == ChannelType.GuildText ? canal.messages.cache.get(messageId) : undefined
    if(message){
      let opcionesOrdenadas = encuesta?.opciones.sort((a,b)=> b.votos - a.votos), totalVotos = 0, bueltas = 1, tabla = []
      opcionesOrdenadas?.forEach(m=> totalVotos += m.votos)

      message.reactions.cache.forEach(react=> react.remove())

      if(opcionesOrdenadas){
        for(let o of opcionesOrdenadas){
          let porcentaje = (o.votos*100/totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
          
          for(let i=0; i<20; i++){
            if(i < parseInt(porcentaje)/100*20){
              diseño = diseño.concat(carga)
            }else{
              diseño = diseño.concat(vacio)
            }
          }
          tabla.push(`**${bueltas==1 ? "🥇": bueltas==2 ? "🥈": bueltas==3 ? "🥉": `${bueltas}`}.** ${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
          bueltas++
        }
      }

      if(encuesta?.opciones.filter(f=> f.votos>0).length==0) return setSlashError(int, `No puedes finalizar la encuesta ya que nadie ha participado en ella.`)
      
      const embed = message?.embeds[0]
      if(embed.data.author) embed.data.author.name = `⏹️ Encuesta finalizada forzadamente por ${int.user.tag}`
      embed.fields[0].value = tabla.join("\n\n")
      embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas?.[0].opcion}**\nVotos totales: **${totalVotos}**\nCreada por: <@${encuesta?.autorID}>`
      message.edit({embeds: [embed], content: '*¡Encuata finalizada!*'})
      if(encuesta) encuesta.activa = false
      await surveysModel.findByIdAndUpdate(serverId, {encuestas: arrayEn})

      const embFinalizada = new EmbedBuilder()
      .setTitle(`⏹️ Encuesta finalizada`)
      .setDescription(`Has finalizado la encuesta de **${embed.title}** en ${int.channelId == canal?.id ? "este canal": `el canal ${canal}`}.`)
      .setColor(color.afirmative)
      int.reply({ephemeral: true, embeds: [embFinalizada]})
      

    }else setSlashError(int, `No pude encontrar la encuesta, puede ser que se haya eliminado.`)
  }

  if(subCommand == "sorteo"){
    const dataSor = await rafflesModel.findById(serverId), arraySo = dataSor?.sorteos, messageId = int.options.getString('id', true)

    if(setSlashErrors(int, [
      [
        Boolean(isNaN(Number(messageId))),
        `La ID del sorteo *(${messageId})* no es valida ya que contiene caracteres no numéricos.`
      ],
      [
        Boolean(!arraySo?.some(s=>s.id == messageId)),
        `La ID que proporcionaste *(${messageId})* no coincide con la ID de ningún sorteo en el servidor.`
      ],
      [
        Boolean(!arraySo?.filter(f=> f.activo).some(s=>s.id == messageId)),
        `La ID que proporcionaste *(${messageId})* no coincide con la de ningún sorteo activo pero si con la de un sorteo que ha finalizado, solo puedes finalizar los sorteos que estén activos.`
      ]
    ])) return

    const sorteo = arraySo?.find(f=>f.id == messageId), canal = client.channels.cache.get(sorteo?.canalID || ''), message = canal?.type == ChannelType.GuildText ? canal.messages.cache.get(messageId) : undefined
    if(message && sorteo){
      const miembros = sorteo?.participantes.filter(f=> guild?.members.cache.has(f))
      let bueltas = 1, ganadoresFinal: string[] = []

      if(sorteo && miembros && miembros.length > 0){
        for(let r=0; r<bueltas; r++){
          let miembroRandom = miembros[Math.floor(Math.random()*miembros.length)]
          
          if(sorteo.ganadores > ganadoresFinal.length && !ganadoresFinal.some(s=> s==miembroRandom)){
            ganadoresFinal.push(miembros[Math.floor(Math.random()*miembros.length)])
            bueltas++
          }
        }
      }

      if(ganadoresFinal.length == 0) return setSlashError(int, 'No puedes finalizar el sorteo ya que nadie a participado en el sorteo.')
      
      const emb = message.embeds[0]
      if(emb.data?.author) emb.data.author.name = "⏹️ Sorteo finalizado"
      emb.fields[0].value = `${ganadoresFinal.length==1 ? `Ganador/a: ${ganadoresFinal.map(m=> `<@${m}>`)[0]}`: `Ganadores: ${ganadoresFinal.map(m=> `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${sorteo.autorID}>`
      message.edit({embeds: [emb], content: '*¡Sorteo finalizado!*'})
      message.reply({content: `¡Felicidades ${ganadoresFinal.length==1 ? `${ganadoresFinal.map(m=> `<@${m}>`)[0]} has ganado`: `${ganadoresFinal.map(m=> `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!\n*Sorteo finalizado forzadamente por ${int.user.tag}.*`})
      sorteo.activo = false
      await rafflesModel.findByIdAndUpdate(serverId, {sorteos: arraySo})

      const embFinalizado = new EmbedBuilder()
      .setTitle(`⏹️ Sorteo finalizado`)
      .setDescription(`Has finalizado el sorteo de **${emb.title}** en ${int.channelId == canal?.id ? "este canal": `el canal ${canal}`}.`)
      .setColor(color.afirmative)
      int.reply({ephemeral: true, embeds: [embFinalizado]})

    }else setSlashError(int, `No pude encontrar el sorteo, puede ser que se haya eliminado.`)
  }
}