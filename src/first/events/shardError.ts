import { ChannelType, EmbedBuilder } from 'discord.js'
import { FirstClientData } from '..'
import { BotEvent } from '../..'
import { getBotData } from '../utils'
import { isDevelopment } from '../../config'


export default class ShardErrorEvent extends BotEvent {
  constructor() {
    super('shardError')
  }
  
  async execute(error: Error, shardId: number, client: FirstClientData) {
    const { emoji, color } = client.data
  
    const dataBot = await getBotData(client), channelLog = client.getChannelById(dataBot?.logs.errors || '')
    console.log(error)
  
    const embErr = new EmbedBuilder()
    .setTitle(`${emoji.negative} Ocurrió un error`)
    .setDescription(`\`\`\`js\n${error.name}\n\n${error.message}\n\n${error.stack}\`\`\``)
    .setColor(color.negative)
    .setTimestamp()
    if((!isDevelopment) && channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embErr]})
  }
}