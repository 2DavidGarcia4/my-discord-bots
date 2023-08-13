import { ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../lib/services";
import { type MessageProp, TextCommand } from "../..";
import { PepeFrogClient } from "../../client";

export default class VipCommand extends TextCommand {
  constructor() {
    super({name: 'vip'})
  }

  public async execute({message: msg, client}: {
    message: MessageProp
    client: PepeFrogClient 
  }) {
    const description = await getInfoMessage({
      client,
      channelId: '1114225130395140136',
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