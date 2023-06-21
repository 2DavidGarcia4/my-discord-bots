import { Client, Message, ButtonBuilder, ButtonStyle } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../utils/functions";

export const vipCommand = async (msg: Message<boolean>, client: Client) => {
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