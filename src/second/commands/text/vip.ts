import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultInfoMessageBody, getInfoMessage } from '../../lib/services'
import { TextCommand, type MessageProp } from '../..'
import { type SecondClientData } from '../..'

export default class VipCommand extends TextCommand {
  constructor() {
    super({name: 'vip'})
  }

  public async execute({message: msg, client}: {
    message: MessageProp
    client: SecondClientData 
  }) {
    const description = await getInfoMessage({
      client,
      channelId: '1139620277488189551',
      language: 'es'
    })+''
  
    defaultInfoMessageBody(msg, {
      title: `⭐ Acceso VIP`,
      description,
      name: 'vip',
      extraButtons: [
        new ButtonBuilder()
        .setCustomId('vip-btn')
        .setLabel('Vista previa de canales')
        .setEmoji('👁️')
        .setStyle(ButtonStyle.Secondary)
      ]
    })
  }
}