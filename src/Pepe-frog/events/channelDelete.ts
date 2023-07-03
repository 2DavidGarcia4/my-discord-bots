import { Client, DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { FrogDb } from "../db";
import { getVerifiedsData, updateVerifiedsData } from "../utils/functions";

export const channelDeleteEvent = async (channel: DMChannel | NonThreadGuildBasedChannel, client: Client) => {
  const { serverId, principalServerId } = FrogDb
  if(channel.isDMBased() || channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.channels.cache.find(f=> f.name == channel.name)?.delete()

  const verifiedsData = await getVerifiedsData(client)
  if(verifiedsData && verifiedsData.some(s=> s.channelId == channel.id)) {
    verifiedsData.splice(verifiedsData.findIndex(f=> f.channelId == channel.id), 1)
    await updateVerifiedsData(client, verifiedsData)
  }
}