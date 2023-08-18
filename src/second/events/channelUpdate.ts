import { ChannelType, DMChannel, type NonThreadGuildBasedChannel } from 'discord.js'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'channelUpdate'

export async function execute(oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel, client: SecondClientData) {
  const { serverId, backupServerId } = client.data
  if(oldChannel.isDMBased() || newChannel.isDMBased() || oldChannel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  const prinCategory = principalServer?.channels.cache.find(f=> f.name == newChannel.parent?.name)
  const prinChannel = principalServer?.channels.cache.find(f=> f.name == oldChannel.name)

  if(prinChannel){
    prinChannel.edit({
      name: newChannel.name, 
      position: newChannel.position, 
      parent: prinCategory?.id, 
    })
    
    if(newChannel.type == ChannelType.GuildText){
      prinChannel.edit({
        nsfw: newChannel.nsfw, 
        topic: newChannel.topic,
        rateLimitPerUser: newChannel.rateLimitPerUser
      })
    }
  }
}