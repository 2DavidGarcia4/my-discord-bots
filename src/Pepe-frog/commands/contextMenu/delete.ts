import { ContextMenuCommandBuilder, CacheType, PermissionFlagsBits, MessageContextMenuCommandInteraction, EmbedBuilder } from "discord.js";
import { exemptMessagesIds } from "../..";

export const deleteCmcb = new ContextMenuCommandBuilder()
.setName('Delete')
.setNameLocalizations({
  'es-ES': 'Eliminar',
  'en-US': 'Delete'
})
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setType(3).toJSON()

export const deleteCM = async (int: MessageContextMenuCommandInteraction<CacheType>) => {
  const { guild, locale, targetMessage } = int, isEnglish = locale == 'en-US' ? true : false

  const DeleteEb = new EmbedBuilder()
  .setTitle(isEnglish ? 'Message deleted successfully' : 'Mensaje eliminado correctamente')
  .setColor(guild?.members.me?.displayHexColor || 'White')

  exemptMessagesIds.push(targetMessage.id)
  
  targetMessage.delete().then(()=> {
    int.reply({ephemeral: true, embeds: [DeleteEb]})
    
  }).catch(()=> {
    int.reply({ephemeral: true, content: 'An error has occurred'})
  })
}