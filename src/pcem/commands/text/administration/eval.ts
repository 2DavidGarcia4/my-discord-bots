import { Client, EmbedBuilder, Message } from "discord.js";
import { inspect } from "util"
import { sendMessageText, setError } from "../../../../shared/functions";
import { botDB } from "../../../db";
import { getEmbedColor } from "../../../utils";

export const name = "eval"

export const evalCommand = (msg: Message, client: Client, args: string[]) => {
  if(!botDB.owners.some(s=> s==msg.author.id)) return

  try {
    msg.channel.sendTyping()
    const text = args.join(' ')
    const code = eval(text), texto = inspect(code)
    const evalEb = new EmbedBuilder()
    .setDescription(`\`\`\`js\n${texto.length > 2040 ? texto.substring(0, 2040).concat('...') : texto}\`\`\``)
    .setColor(getEmbedColor(msg.guild))
    sendMessageText(msg, {embeds: [evalEb]})
  } catch (error) {
    setError(msg, `${error}`)
  }
}