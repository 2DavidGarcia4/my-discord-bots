import { ChannelType, Client, DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { FrogDb } from "../db";

export const channelUpdateEvetn = async (oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel, clien: Client) => {
  const { serverId, principalServerId } = FrogDb
  if(oldChannel.isDMBased() || newChannel.isDMBased() || oldChannel.guildId != serverId) return

  const principalServer = clien.guilds.cache.get(principalServerId)
  const prinCategory = principalServer?.channels.cache.find(f=> f.name == newChannel.parent?.name)
  const prinChannel = principalServer?.channels.cache.find(f=> f.name == oldChannel.name)

  if(prinChannel){
    prinChannel.edit({
      name: newChannel.name, 
      position: newChannel.position, 
      parent: prinCategory?.id, 
    })

    if(newChannel.type == ChannelType.GuildText){
      prinChannel.edit({nsfw: newChannel.nsfw, topic: newChannel.topic})
    }
  }
}