import { ContextMenuCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { type SecondClientData } from '../..'
import { ContextCommand, type ContextInteraction } from '../../..'
import { setSlashError } from '../../../shared/functions'
import { SnackFilesModel } from '../../../models'

const SaveFilesCmcb = new ContextMenuCommandBuilder()
.setName('Save files')
.setNameLocalization('es-ES', 'Guardar archivos')
.setType(3)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON()

export default class SaveFilesContextCommand extends ContextCommand {
  constructor() {
    super({
      struct: SaveFilesCmcb
    })
  }

  async execute(int: ContextInteraction, client: SecondClientData) {
    if(!int.isMessageContextMenuCommand()) return
    const { guild, targetMessage } = int

    if(!targetMessage.attachments.size) return setSlashError(int, 'The message does not contain files')
    
    await int.deferReply({ephemeral: true})

    const SavingFilesEb = new EmbedBuilder()
    .setTitle('🗂️ Saving files...')
    .setColor('Blue')

    await int.editReply({embeds: [SavingFilesEb]})
    let savedFiles = 0

    for (const [_, attachment] of targetMessage.attachments) {
      try {
        const file = await SnackFilesModel.findOne({fileUrl: attachment.url})
  
        if (file === null) {
          await SnackFilesModel.create({
            fileUrl: attachment.url,
            categories: [],
            size: attachment.size,
            type: attachment.contentType,
            width: attachment.width,
            height: attachment.height
          })
  
          savedFiles++
        }
      } catch (error) {
        console.error(error)
      }
    }

    const SavedFilesEb = new EmbedBuilder({
      title: `🗂️ ${savedFiles === 0 ? 'No files saved' : 'Saved files'}`,
      description: `${savedFiles}/${targetMessage.attachments.size} saved files.`
    }).setColor('Green')

    await int.editReply({embeds: [SavedFilesEb]})
  }
}