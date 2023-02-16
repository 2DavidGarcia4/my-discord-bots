import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from "discord.js";
import { botDB } from "../../../db";

export const name = "ticket"

export const ticketCommand = (msg: Message) => {
  if(!msg.member?.permissions.has('Administrator')) return
  
  const embTicket = new EmbedBuilder()
  .setTitle(`${botDB.emoji.ticket} Tickets`)
  .setDescription(`Para crear un ticket has clic en el botón de abajo.`)
  .addFields(
      {name: `❓ **¿Qué es un Ticket?**`, value: `Es un canal privado en el cual solo tu y el equipo de soporte pueden ver y utilizar, en el cual el equipo se encargará de resolver tus dudas y ayudarte en lo que necesites y esté a nuestro alcance.`},
      {name: `⛔ **¿Qué no debes de hacer?**`, value: `No debes de abrir tickets solo por diversión y no trates mal a el miembro de soporte que te atienda, nosotros seremos amables contigo, en caso de que algún miembro no te trate bien repórtalo por MD a <@717420870267830382>.`},
      // {name: ``, value: ``},
  )
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: msg.guild?.name || 'undefined', iconURL: msg.guild?.iconURL() || undefined})
  .setTimestamp()

  const boton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    [
      new ButtonBuilder()
      .setCustomId("crearTicket")
      .setEmoji("962127203645136896")
      .setLabel("Crear ticket")
      .setStyle(ButtonStyle.Success)
    ]
  )
  msg.channel.send({embeds: [embTicket], components: [boton]}).then(() => {
    msg.delete().catch(c=> console.log(c))
  })
}