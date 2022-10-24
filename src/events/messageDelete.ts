import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, PartialMessage } from "discord.js";
import { botDB } from "../db";
import { rafflesModel, surveysModel, ticketsModel } from "../models";


export const messageDeleteEvent = async (msgd: Message | PartialMessage) => {
  if(msgd.guildId != botDB.serverId) return;

  let dataTs = await ticketsModel.findById(botDB.serverId), arrayTs = dataTs?.tickets, ticket = arrayTs?.find(f=> f.id==msgd.channelId)
  if(arrayTs?.some(s=> s.id==msgd.channelId) && ticket.msgCerrarID == msgd.id && !ticket.cerrado){
    const botonCerrar = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("cerrarTicket")
      .setEmoji("962574398190145566")
      .setLabel("Cerrar ticket")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(false)
    )
    await msgd.channel.messages.fetch(ticket.msgPrincipalID).then(msgPrincipal => {
      msgPrincipal.edit({components: [botonCerrar]})
    }).catch(c=> console.log(c))
    ticket.msgCerrarID = false
    await ticketsModel.findByIdAndUpdate(botDB.serverId, {tickets: arrayTs})
  }

  let dataSor = await rafflesModel.findById(botDB.serverId), arraySo = dataSor?.sorteos
  if(arraySo?.some(s=>s.id == msgd.id)){
    arraySo.splice(arraySo.findIndex(f=>f.id == msgd.id),1)
    await rafflesModel.findByIdAndUpdate(botDB.serverId, {sorteos: arraySo})
  }

  let dataEnc = await surveysModel.findById(botDB.serverId), arrayEn = dataEnc?.encuestas
  if(arrayEn?.some(s=>s.id == msgd.id)){
    arrayEn.splice(arrayEn.findIndex(f=>f.id == msgd.id),1)
    await surveysModel.findByIdAndUpdate(botDB.serverId, {encuestas: arrayEn})
  }
}