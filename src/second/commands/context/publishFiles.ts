import { ChannelType, ContextMenuCommandBuilder, PermissionFlagsBits } from 'discord.js'
import { type SecondClientData } from '../..'
import { ContextCommand, type ContextInteraction } from '../../..'
import { setSlashError } from '../../../shared/functions'
import { FrogDb } from '../../data'
import { getWebhookClientByChannel } from '../../lib/services'

const PublishFilesCmcb = new ContextMenuCommandBuilder()
.setName('Publish files')
.setNameLocalization('es-ES', 'Publicar archivos')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setType(3)
.toJSON()

export default class PublishFiles extends ContextCommand {
  constructor() {
    super({
      struct: PublishFilesCmcb, 
      guildsIds: [FrogDb.publishingServerId]
    })
  }

  async execute(int: ContextInteraction, client: SecondClientData) {
    const { guildId, locale } = int, isEnglish = locale == 'en-US'
    const { serverId, publishingServerId, serverIconUrl } = client.data
    
    if(guildId != '1028793496674500659') return
    if(!int.isMessageContextMenuCommand()) return
    const { targetMessage, channel } = int

    if(!targetMessage.attachments.size) return setSlashError(int, isEnglish ? 'The message does not contain files.' : 'El mensaje no contiene archivos')

    if(channel?.type == ChannelType.GuildText){
      const server = client.guilds.cache.get(serverId), channelServer = server?.channels.cache.find(f=> f.name == channel.name)
      
      if(channelServer?.type == ChannelType.GuildText){
        const PublishingWebhook = await getWebhookClientByChannel(channelServer)
        
        PublishingWebhook.send({
          avatarURL: serverIconUrl,
          username: server?.name,
          files: targetMessage.attachments.map(at=> at)
        }).then(async ()=> {
          const s = targetMessage.attachments.size == 1 ? '' : 's'
          await int.reply({ephemeral: true, content: `File${s} successfully posted to the ${channelServer} channel.`})
        })
      }
    }
  }
}