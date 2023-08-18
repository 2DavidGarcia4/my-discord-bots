import { ContextMenuCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js'
import { ContextCommand, type ContextInteraction } from '../../..'
import { FrogDb } from '../../data'

export const DeleteReactionsCmcb = new ContextMenuCommandBuilder()
.setName('Delete reactions')
.setNameLocalizations({
  'es-ES': 'Eliminar reacciones',
  'en-US': 'Delete reactions'
})
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setType(3).toJSON()

export default class DeleteReactionsContexCommand extends ContextCommand {
  constructor() {
    super(DeleteReactionsCmcb, [FrogDb.serverId])
  }

  public async execute(int: ContextInteraction) {
    const { locale } = int, isEnglish = locale == 'en-US' ? true : false

    if(!int.isMessageContextMenuCommand()) return
  
    const DeleteReactionsEb = new EmbedBuilder()
    .setTitle(isEnglish ? 'Deleted reactions from this message' : 'Reacciones eliminadas de este mensaje')
    .setColor('Random')
  
    int.targetMessage.reactions.removeAll().then(()=> {
      int.reply({ephemeral: true, embeds: [DeleteReactionsEb]})
      
    }).catch(()=> {
      int.reply({ephemeral: true, content: 'An error has occurred'})
    })
  }
}