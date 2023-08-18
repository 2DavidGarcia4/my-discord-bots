import { EmbedBuilder } from 'discord.js'
import { inspect } from 'util'
import { type SecondClientData } from '../..'
import { TextCommand, type MessageProp } from '../..'
import { sendMessageText, setError } from '../../../shared/functions'
import { FrogDb } from '../../data'
import { setGuildStatus } from '../../lib/services'

export default class EvalCommand extends TextCommand {
  constructor() {
    super({
      name: 'eval'
    })
  }

  public async execute({message: msg, args, client}: {
    message: MessageProp 
    args: string[]
    client: SecondClientData
  }) {
    try {
      const db = FrogDb, setStatus = setGuildStatus, modDB = client.modDb
      msg.channel.sendTyping()
      const code = eval(args.join(' ')), texto = inspect(code)
      const evalEb = new EmbedBuilder()
      .setDescription(`\`\`\`js\n${texto.length > 2040 ? texto.substring(0, 2040).concat('...') : texto}\`\`\``)
      .setColor(msg.guild?.members.me?.displayHexColor || 'White')
      sendMessageText(msg, {embeds: [evalEb]})
    
    } catch (error) {
      setError(msg, `${error}`)
    }
  }
}