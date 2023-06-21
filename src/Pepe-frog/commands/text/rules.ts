import { Message, Client } from "discord.js";
import { defaultInfoMessageBody, getInfoMessage } from "../../utils/functions";

export const rulesCommand = async (msg: Message<boolean>, client: Client) => {
  const description = await getInfoMessage({
    client,
    channelId: '1090736733047492638',
    language: 'es'
  })+''
  
  defaultInfoMessageBody(msg, {
    title: '📖 Reglas',
    description,
    name: 'rules'
  })
}