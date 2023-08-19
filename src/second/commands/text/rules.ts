import { defaultInfoMessageBody, getInfoMessage } from '../../lib/services'
import { type SecondClientData } from '../..'
import { type MessageProp, TextCommand } from '../../..'

export default class RulesCommand extends TextCommand {
  constructor() {
    super({name: 'rules'})
  }
  
  async execute({message: msg, client}: {
    message: MessageProp
    client: SecondClientData 
  }) {
    const description = await getInfoMessage({
      client,
      channelId: '1139620584750334052',
      language: 'es'
    })+''
    
    defaultInfoMessageBody(msg, {
      title: '📖 Reglas',
      description,
      name: 'rules'
    })
  }
}