import { EmbedBuilder } from 'discord.js'
import { inspect } from 'util'
import { sendMessageText, setError } from '../../../shared/functions'
import { botDB } from '../../data'
import { getEmbedColor } from '../../utils'
import { TextCommand, type MessageProp } from '../../..'
import { type FirstClientData } from '../..'

export default class EvalTextCommand extends TextCommand{
  constructor() {
    super({
      name: 'eval',
      users: botDB.owners
    })
  }

  async execute({message: msg, args, client}: {
    message: MessageProp
    args: string[]
    client: FirstClientData
  }) {
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
}