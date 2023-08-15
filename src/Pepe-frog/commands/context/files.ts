import { APIEmbedField, ContextMenuCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { type CommandClient, ContextCommand, type ContextInteraction } from '../..'
import { FrogDb } from '../../data'
import { sendMessageSlash, setSlashError } from '../../../shared/functions'

const FilesCmcb = new ContextMenuCommandBuilder()
.setName('Files')
.setNameLocalization('es-ES', 'Archivos')
.setType(3)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON()

export default class FilesContextCommand extends ContextCommand {
  constructor() {
    super(FilesCmcb, [FrogDb.serverId, FrogDb.backupServerId, FrogDb.publishingServerId, '949861760096145438'])
  }

  public async execute(int: ContextInteraction, client: CommandClient) {
    if(!int.isMessageContextMenuCommand()) return
    const { guild, targetMessage } = int

    if(!targetMessage.attachments.size) return setSlashError(int, 'The message contains no files')
    
    await int.deferReply()

    const FilesEb = new EmbedBuilder()
    .setTitle('🗂️ Files')
    .setColor('Blue')

    const embedFields: APIEmbedField[] = []
    targetMessage.attachments.forEach(at=> {
      embedFields.push({
        name: `${at.name}`,
        value: `Size: *${(at.size/1048576).toFixed(3)}*\nDimentions: *${at.width}×${at.height}*\nContent type: ${at.contentType}${at.description ? '\nDescription: '+at.description : ''}`,
        inline: true
      })
    })

    FilesEb.data.fields = embedFields
    sendMessageSlash(int, {embeds: [FilesEb]})
  }
}