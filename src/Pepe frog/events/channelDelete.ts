import { Client, DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { frogDb } from "../db";

export const channelDeleteEvent = async (channel: DMChannel | NonThreadGuildBasedChannel, client: Client) => {
  const { serverId, principalServerId } = frogDb
  if(channel.isDMBased() || channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.channels.cache.find(f=> f.name == channel.name)?.delete()
}