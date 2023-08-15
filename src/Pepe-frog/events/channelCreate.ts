import { type NonThreadGuildBasedChannel } from 'discord.js'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const name: EventName = 'channelCreate'

export async function execute(channel: NonThreadGuildBasedChannel, client: PepeFrogClient) {
  const { serverId, backupServerId } = client.data
  if(channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  const prinCategory = principalServer?.channels.cache.find(f=> f.name == channel.parent?.name)
  principalServer?.channels.create({name: channel.name, parent: prinCategory?.id, position: channel.position, type: channel.type})
}