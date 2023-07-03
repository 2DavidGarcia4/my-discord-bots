import { ContextMenuCommandBuilder, type CacheType, PermissionFlagsBits, type MessageContextMenuCommandInteraction, EmbedBuilder } from "discord.js";

export const DeleteReactionsCmcb = new ContextMenuCommandBuilder()
.setName('Delete reactions')
.setNameLocalizations({
  'es-ES': 'Eliminar reacciones',
  'en-US': 'Delete reactions'
})
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setType(3).toJSON()

async function deleteReactionsCM(int: MessageContextMenuCommandInteraction<CacheType>) {
  const { locale } = int, isEnglish = locale == 'en-US' ? true : false

  const DeleteReactionsEb = new EmbedBuilder()
  .setTitle(isEnglish ? 'Deleted reactions from this message' : 'Reacciones eliminadas de este mensaje')
  .setColor('Random')

  int.targetMessage.reactions.removeAll().then(()=> {
    int.reply({ephemeral: true, embeds: [DeleteReactionsEb]})
    
  }).catch(()=> {
    int.reply({ephemeral: true, content: 'An error has occurred'})
  })
}

export default {
  Command: DeleteReactionsCmcb,
  run: deleteReactionsCM
}