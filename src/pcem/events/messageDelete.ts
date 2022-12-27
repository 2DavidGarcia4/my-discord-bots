import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, EmbedBuilder, Message, PartialMessage } from "discord.js";
import { botDB } from "../db";
import { botModel, rafflesModel, surveysModel, ticketsModel } from "../models";


export const messageDeleteEvent = async (msgd: Message | PartialMessage, client: Client) => {
  const { serverId, color, emoji } = botDB
  if(msgd.guildId != serverId) return;

  let dataTs = await ticketsModel.findById(serverId), arrayTs = dataTs?.tickets, ticket = arrayTs?.find(f=> f.id==msgd.channelId)
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
    await ticketsModel.findByIdAndUpdate(serverId, {tickets: arrayTs})
  }

  let dataSor = await rafflesModel.findById(serverId), arraySo = dataSor?.sorteos
  if(arraySo?.some(s=>s.id == msgd.id)){
    arraySo.splice(arraySo.findIndex(f=>f.id == msgd.id),1)
    await rafflesModel.findByIdAndUpdate(serverId, {sorteos: arraySo})
  }

  let dataEnc = await surveysModel.findById(serverId), arrayEn = dataEnc?.encuestas
  if(arrayEn?.some(s=>s.id == msgd.id)){
    arrayEn.splice(arrayEn.findIndex(f=>f.id == msgd.id),1)
    await surveysModel.findByIdAndUpdate(serverId, {encuestas: arrayEn})
  }

  if(msgd.content){
    const dataBot = await botModel.findById(client.user?.id)
    if(!dataBot) return
    const channelLog = client.channels.cache.get(dataBot?.logs.deleteMessages)
  
    const logs = await msgd.guild?.fetchAuditLogs()
    const executor = logs?.entries.filter(f=> f.actionType == 'Delete' && f.targetType == 'Message').first()?.executor

    const DeleteMessageEb = new EmbedBuilder()
    .setAuthor({name: msgd.member?.nickname || msgd.author?.username || 'undefined', iconURL: msgd.author?.displayAvatarURL()})
    .setTitle('🗑️ Mensaje eliminado')
    .setDescription(`**📄 Mensaje:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000)+'...' : msgd.content}`)
    .setFields(
      {name: '🧑 **Autor:**', value: `${msgd.author} ||*(\`\`${msgd.author?.id}\`\`)*||`, inline: true},
      {name: `${emoji.textChannel} **Canal:**`, value: `${msgd.channel}`, inline: true},
      {name: '👮 **Ejecutor:**', value: `${executor} ||*(\`\`${executor?.id}\`\`)*||`, inline: true},
    )
    .setColor('Red')
    .setTimestamp()
    if(channelLog?.type == ChannelType.GuildText) return channelLog.send({embeds: [DeleteMessageEb]})
  }
}