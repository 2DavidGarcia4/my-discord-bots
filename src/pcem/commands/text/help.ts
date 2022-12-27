import { Client, Message, EmbedBuilder } from "discord.js";
import { botDB } from "../../db";
import { sendMessageText } from "../../../utils/functions";

export const helpCommand: any = (msg: Message<boolean>, client: Client) => {
  msg.channel.sendTyping()
  const embedMen = new EmbedBuilder()
  .setAuthor({ name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
  .setThumbnail(client.user?.displayAvatarURL() || null)
  .setTitle(`Soy ${client.user?.username}`)
  .setDescription(`**El bot de ${msg.guild?.name}**, ¿necesitas información o ayuda?`)
  .addFields(
    { name: `${botDB.emoji.information} **Información**`, value: `Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>.` },
    { name: `${botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." }
  )
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')
  .setFooter({ text: msg.guild?.name || 'undefined', iconURL: msg.guild?.iconURL() || undefined })
  .setTimestamp()
  sendMessageText(msg, {embeds: [embedMen]})
}