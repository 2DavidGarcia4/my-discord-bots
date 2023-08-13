import { ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../lib/services";
import { TextCommand, type MessageProp } from "../..";
import { PepeFrogClient } from "../../client";

export default class PacksCommand extends TextCommand {
  constructor() {
    super({name: 'packs'})
  }

  public async execute({message: msg, client}: {
    message: MessageProp
    client: PepeFrogClient
  }) {
    const description = await getInfoMessage({
      client,
      channelId: '1120917353862017134',
      language: 'es'
    })+''
  
    defaultInfoMessageBody(msg, {
      title: `📁 Acceso packs`,
      description,
      name: 'packs',
      extraButtons: [
        new ButtonBuilder()
        .setCustomId('packs-btn')
        .setLabel('Vista previa de canales')
        .setEmoji('👁️')
        .setStyle(ButtonStyle.Secondary)
      ]
    })
  }
} 