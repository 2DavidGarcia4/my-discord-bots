import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, EmbedBuilder, Message, PartialMessage } from "discord.js";
import { botDB } from "../db";
import { rafflesModel, surveysModel } from "../../models";
import { exemptMessagesIds } from "..";
import { getBotData } from "../utils";


export const messageDeleteEvent = async (msgd: Message | PartialMessage, client: Client) => {
  const { serverId, emoji } = botDB
  if(msgd.guildId != serverId) return;
  if(exemptMessagesIds.some(s=> s == msgd.id)){
    exemptMessagesIds.splice(exemptMessagesIds.findIndex(f=> f == msgd.id), 1)
    return
  }

  let dataSor = await rafflesModel.findById(serverId), arraySo = dataSor?.raffles
  if(arraySo?.some(s=>s.id == msgd.id)){
    arraySo.splice(arraySo.findIndex(f=>f.id == msgd.id),1)
    await rafflesModel.findByIdAndUpdate(serverId, {sorteos: arraySo})
  }

  let dataEnc = await surveysModel.findById(serverId), arrayEn = dataEnc?.surveys
  if(arrayEn?.some(s=>s.id == msgd.id)){
    arrayEn.splice(arrayEn.findIndex(f=>f.id == msgd.id),1)
    await surveysModel.findByIdAndUpdate(serverId, {encuestas: arrayEn})
  }

  if(msgd.content){
    const dataBot = await getBotData(client)
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