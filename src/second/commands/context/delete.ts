import { ContextMenuCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js'
import { type SecondClientData } from '../..'
import { ContextCommand, type ContextInteraction } from '../../..'
import { FrogDb } from '../../data'

export const DeleteCmcb = new ContextMenuCommandBuilder()
.setName('Delete')
.setNameLocalizations({
  'es-ES': 'Eliminar',
  'en-US': 'Delete'
})
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setType(3).toJSON()

export default class DeleteContextCommand extends ContextCommand {
  constructor() {
    super({
      struct: DeleteCmcb, 
      guildsIds: [FrogDb.serverId]
    })
  }

  async execute(int: ContextInteraction, client: SecondClientData) {
    if(!int.isMessageContextMenuCommand()) return
    const { guild, locale, targetMessage } = int, isEnglish = locale == 'en-US' ? true : false
  
    const DeleteEb = new EmbedBuilder()
    .setTitle(isEnglish ? 'Message deleted successfully' : 'Mensaje eliminado correctamente')
    .setColor(guild?.members.me?.displayHexColor || 'White')
  
    client.exemptMessagesIds.push(targetMessage.id)
    
    targetMessage.delete().then(()=> {
      int.reply({ephemeral: true, embeds: [DeleteEb]})
      
    }).catch(()=> {
      int.reply({ephemeral: true, content: 'An error has occurred'})
    })
  }
}