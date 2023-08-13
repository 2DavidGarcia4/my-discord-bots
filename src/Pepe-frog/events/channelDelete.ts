import { DMChannel, type NonThreadGuildBasedChannel } from 'discord.js'
import { FrogDb } from '../db'
import { getVerifiedsData, updateVerifiedsData } from '../lib/services'
import { PepeFrogClient } from '../client'

export const name: EventName = 'channelDelete'

export async function execute(channel: DMChannel | NonThreadGuildBasedChannel, client: PepeFrogClient) {
  const { serverId, backupServerId } = FrogDb
  if(channel.isDMBased() || channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.channels.cache.find(f=> f.name == channel.name)?.delete()

  const verifiedsData = await getVerifiedsData(client)
  if(verifiedsData && verifiedsData.some(s=> s.channelId == channel.id)) {
    verifiedsData.splice(verifiedsData.findIndex(f=> f.channelId == channel.id), 1)
    await updateVerifiedsData(client, verifiedsData)
  }
}