import { Client, EmbedBuilder, Message } from "discord.js"
import { inspect } from 'util'
import { modDb } from "../.."
import { sendMessageText, setError } from "../../../utils/functions"
import { frogDb } from "../../db"
import { setGuildStatus } from "../../utils/functions"
// import { modDb } from "../../events/messageCreate"

export const evalCommand = (msg: Message, client: Client, args: string) => {
  try {
    const db = frogDb, setStatus = setGuildStatus, modDB = modDb
    msg.channel.sendTyping()
    const code = eval(args), texto = inspect(code)
    const evalEb = new EmbedBuilder()
    .setDescription(`\`\`\`js\n${texto.length > 2040 ? texto.substring(0, 2040).concat('...') : texto}\`\`\``)
    .setColor(msg.guild?.members.me?.displayHexColor || 'White')
    sendMessageText(msg, {embeds: [evalEb]})
  
  } catch (error) {
    setError(msg, `${error}`)
  }
}