import { Client, NonThreadGuildBasedChannel } from "discord.js";
import { frogDb } from "../db";

export const channelCreateEvent = async (channel: NonThreadGuildBasedChannel, client: Client) => {
  const { serverId, principalServerId } = frogDb
  if(channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  const prinCategory = principalServer?.channels.cache.find(f=> f.name == channel.parent?.name)
  principalServer?.channels.create({name: channel.name, parent: prinCategory?.id, position: channel.position, type: channel.type})
}