import { DMChannel, type NonThreadGuildBasedChannel } from 'discord.js'
import { getVerifiedsData, updateVerifiedsData } from '../lib/services'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'channelDelete'

export async function execute(channel: DMChannel | NonThreadGuildBasedChannel, client: SecondClientData) {
  const { serverId, backupServerId } = client.data
  if(channel.isDMBased() || channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.channels.cache.find(f=> f.name == channel.name)?.delete()

  const verifiedsData = await getVerifiedsData(client)
  if(verifiedsData && verifiedsData.some(s=> s.channelId == channel.id)) {
    verifiedsData.splice(verifiedsData.findIndex(f=> f.channelId == channel.id), 1)
    await updateVerifiedsData(client, verifiedsData)
  }
}