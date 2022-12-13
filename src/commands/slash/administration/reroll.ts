import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ChannelType } from "discord.js";
import { botDB } from "../../../db";
import { rafflesModel } from "../../../models";
import { setSlashError, setSlashErrors } from "../../../utils/functions";

export const rerollScb = new SlashCommandBuilder()
.setName(`reroll`)
.setDescription(`🔁 Vuelve a elegir el o los ganadores de un sorteo.`)
.addStringOption(id=> 
  id.setName(`id`)
  .setDescription(`🆔 ID del mensaje del sorteo.`)
  .setRequired(true)
).toJSON()

export const rerollSlashCommand = async (int: ChatInputCommandInteraction<CacheType>) => {
  const { guild, user, options } = int, { serverId, emoji } = botDB

  const dataSor = await rafflesModel.findById(serverId), arraySo = dataSor?.sorteos, messageId = options.getString("id", true)
  
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
      Boolean(arraySo?.filter(f=> f.activo).some(s=> s.id == messageId)),
      `La ID que proporcionaste *(${messageId})* no coincide con la de ningún sorteo finalizado pero si con la de un sorteo aun activo, solo se pueden volver a elegir el o los ganadores de un sorteo que ya haya finalizado.`
    ]
  ])) return


  const raffle = arraySo?.find(f=> f.id==messageId), channel = guild?.channels.cache.get(raffle?.canalID || ''), message = (channel?.type == ChannelType.GuildText || channel?.type == ChannelType.GuildAnnouncement) ? channel.messages.cache.get(messageId) : undefined
  const participants = raffle?.participantes.filter(f=> guild?.members.cache.has(f))

  let bueltas = 1, ganadoresFinal: string[] = []
  if(raffle && participants){
    for(let r=0; r<bueltas; r++){
      let miembroRandom = participants[Math.floor(Math.random()*participants.length)]
      
      if(raffle?.ganadores > ganadoresFinal.length && !ganadoresFinal.some(s=>s==miembroRandom)){
        ganadoresFinal.push(participants[Math.floor(Math.random()*participants.length)])
        bueltas++
      }
    }
  }

  if(ganadoresFinal.length == 0) return setSlashError(int, `No se puede volver a elegir uno o mas ganadores de un sorteo en el cual nadie participo.`)
  
  if(message) {
    const emb = message.embeds[0]
    if(emb.data.author) emb.data.author.name = "Sorteo finalizado"
    emb.fields[0].value = `${ganadoresFinal.length==1 ? `Ganador/a: ${ganadoresFinal.map(m=> `<@${m}>`)[0]}`: `Ganadores: ${ganadoresFinal.map(m=> `<@${m}>`).join(", ")}`}\nParticipantes: **${participants?.length}**\nCreado por: <@${raffle?.autorID}>`
    message.edit({embeds: [emb]})
    message.reply({content: `¡Felicidades ${ganadoresFinal.length==1 ? `${ganadoresFinal.map(m=> `<@${m}>`)[0]} has ganado`: `${ganadoresFinal.map(m=> `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!\n*Comando reroll utilizado por ${int.user.tag}*`})
  }
  
  const embReroll = new EmbedBuilder()
  .setTitle(`Reroll echo`)
  .setDescription(`Se ha vuelto a seleccionar ${raffle?.ganadores==1 ? "el ganador ": "los ganadores"} del sorteo que esta en ${channel?.id == int.channelId ? `este canal`: `el canal <#${channel?.id}>`}.`)
  .setColor("#00ff00")
  int.reply({ephemeral: true, embeds: [embReroll]})
}