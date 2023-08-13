import { ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../lib/services";
import { MessageProp, TextCommand } from "../..";
import { PepeFrogClient } from "../../client";

export default class GirlsCommand extends TextCommand {
  constructor() {
    super({
      name: 'girls'
    })
  }

  public async execute({message: msg, client}: {
    message: MessageProp
    client: PepeFrogClient
  }) {
    const description = await getInfoMessage({
      client,
      channelId: '1053399734582263938',
      language: 'es'
    })+''
  
    defaultInfoMessageBody(msg, {
      title: `<a:animate_info:1058179015938158592> Información`,
      description,
      name: 'verifieds',
      extraButtons: [
        new ButtonBuilder()
        .setCustomId('verifieds-btn')
        .setLabel('Verificadas')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success)
      ]
    })
  }
}