import { defaultInfoMessageBody, getInfoMessage } from '../../lib/services'
import { TextCommand, type MessageProp } from '../..'
import { type SecondClientData } from '../..'

export default class RulesCommand extends TextCommand {
  constructor() {
    super({name: 'rules'})
  }
  
  public async execute({message: msg, client}: {
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