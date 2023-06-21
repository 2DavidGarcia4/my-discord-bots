import { Client, Message, ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../utils/functions";

export const packsCommand = async (msg: Message<boolean>, client: Client) => {
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