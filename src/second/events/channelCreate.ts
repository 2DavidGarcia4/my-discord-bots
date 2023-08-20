import { type NonThreadGuildBasedChannel } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class ChannelCreateEvent extends BotEvent {
  constructor() {
    super('channelCreate')
  }

  async execute(channel: NonThreadGuildBasedChannel, client: SecondClientData) {
    const { serverId, backupServerId } = client.data
    if(channel.guildId != serverId) return
  
    const principalServer = client.guilds.cache.get(backupServerId)
    const prinCategory = principalServer?.channels.cache.find(f=> f.name == channel.parent?.name)
    principalServer?.channels.create({name: channel.name, parent: prinCategory?.id, position: channel.position, type: channel.type})
  }
}