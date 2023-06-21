import { Message, Client } from "discord.js";
import { defaultInfoMessageBody, getInfoMessages } from "../../utils/functions";

export const rulesCommand = async (msg: Message<boolean>, client: Client) => {
  const { getMessage } = getInfoMessages(client) 
  const description = await getMessage('1090736733047492638', 'es')+''
  
  defaultInfoMessageBody(msg, {
    title: '📖 Reglas',
    description,
    name: 'rules'
  })
}