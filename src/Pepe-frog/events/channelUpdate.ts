import { ChannelType, DMChannel, type NonThreadGuildBasedChannel } from "discord.js";
import { Frog as client } from ".."
import { FrogDb } from "../db";

export async function channelUpdateEvetn(oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel) {
  const { serverId, principalServerId } = FrogDb
  if(oldChannel.isDMBased() || newChannel.isDMBased() || oldChannel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
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