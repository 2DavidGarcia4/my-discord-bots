import { Role } from 'discord.js'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'roleCreate'

export async function execute(role: Role, client: SecondClientData) {
  const { serverId, backupServerId } = client.data
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.create({name: role.name, permissions: role.permissions})
}