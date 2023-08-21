import { DMChannel, type NonThreadGuildBasedChannel } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'
import { VerifiedsModel } from '../../models'

export default class ChannelDeleteEvent extends BotEvent {
  constructor() {
    super('channelDelete')
  }

  async execute(channel: DMChannel | NonThreadGuildBasedChannel, client: SecondClientData) {
    const { serverId, backupServerId } = client.data
    if(channel.isDMBased() || channel.guildId != serverId) return
  
    const principalServer = client.guilds.cache.get(backupServerId)
    principalServer?.channels.cache.find(f=> f.name == channel.name)?.delete()
  
    const verifiedData = await VerifiedsModel.findOne({channelId: channel.id})
    if(verifiedData) verifiedData.deleteOne()
  }
}