import { CacheType, ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { sendMessageSlash } from "../../../utils/functions";

export const ayudaScb = new SlashCommandBuilder()
.setName("ayuda")
.setDescription(`✋ ¿Necesitas ayuda o estas perdido/a?, te muestra información que te puede ayudar.`).toJSON()

export const ayudaSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const author = int.guild?.members.cache.get(int.user.id)
  
  estadisticas.comandos++
  await int.deferReply()

  const embAyuda = new EmbedBuilder()
  .setAuthor({name: `Hola ${author?.nickname || author?.user.username}`, iconURL: int.user.displayAvatarURL()})
  .setThumbnail(client.user?.displayAvatarURL() || null)
  .setTitle(`Soy ${client.user?.username}`)
  .setDescription(`**El bot de ${int.guild?.name}**, ¿necesitas información o ayuda?`)
  .addFields(
    {name: `${botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
    {name: `${botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
  )
  .setColor(int.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
  .setTimestamp()
  
  sendMessageSlash(int, {embeds: [embAyuda]})
}