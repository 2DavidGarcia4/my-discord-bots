import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client } from "discord.js";
import ms from "ms";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { alliancesModel, suggestionsModel } from "../../../models";
import { sendMessageSlash } from "../../../utils/functions";

export const estadisticasScb = new SlashCommandBuilder()
.setName("estadísticas")
.setDescription(`📊 Muestra estadísticas del servidor.`).toJSON()

export const estadisticasSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const dataAli = await alliancesModel.findById(botDB.serverId)
  const dataSug = await suggestionsModel.findById(botDB.serverId)
  
  await int.deferReply()
  estadisticas.comandos++

  if(!dataAli || !dataSug) return
  
  let alianzas = 0
  for(let i=0; i<dataAli.miembros.length; i++){
    alianzas += dataAli.miembros[i].cantidad
  }

  const estadisticasEb = new EmbedBuilder()
  .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL()})
  .setTitle("📊 Estadísticas")
  .setDescription(`Estadísticas por información recolectada hace ${ms(client.uptime || 0)}.`)
  .addFields(
    {name: `👤 **Miembros:**`, value: `${int.guild?.members.cache.size.toLocaleString()}`, inline: true},
    {name: `📑 **Canales:**`, value: `${int.guild?.channels.cache.size.toLocaleString()}`, inline: true},
    {name: `📌 **Roles:**`, value: `${int.guild?.roles.cache.size.toLocaleString()}`, inline: true},
    {name: `🤝 **Alianzas:**`, value: `Creadas: ${alianzas.toLocaleString()}`, inline: true},
    {name: `🗳️ **Sugerencias: ${dataSug.sugerencias.cantidad}**`, value: `aceptadas: **${dataSug.sugerencias.aceptadas}**\ndenegadas: **${dataSug.sugerencias.denegadas}**\nimplementadas: **${dataSug.sugerencias.implementadas}**\nen progreso: **${dataSug.sugerencias.en_progreso}**\nno sucederán: **${dataSug.sugerencias.no_sucedera}**`, inline: true},
    {name: `\u200B`, value: `Estadísticas por información recolectada hace ${ms(client.uptime || 0)}.`, inline: false},
    {name: `🪄 **Comandos usados:**`, value: `${estadisticas.comandos.toLocaleString()}`, inline: true},
    {name: `📨 **Mensajes:**`, value: `${estadisticas.mensajes.toLocaleString()}`, inline: true},
    {name: `📥 **Entradas:**`, value: `${estadisticas.entradas.toLocaleString()}`, inline: true},
    {name: `📤 **Salidas:**`, value: `${estadisticas.salidas.toLocaleString()}`, inline: true},
    {name: `📝 **Postulaciones:**`, value: `Cerradas`, inline: true},
  )
  .setColor(int.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
  .setTimestamp()
  
  sendMessageSlash(int, {embeds: [estadisticasEb]})
}