import { Role } from 'discord.js'
import { type SecondClientData } from '..'
import { type EventName } from '../..'

export const name: EventName = 'roleUpdate'

export async function execute(oldRole: Role, newRole: Role, client: SecondClientData) {
  const { serverId, backupServerId } = client.data
  if(oldRole.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.cache.find(f=> f.name == oldRole.name)?.edit({name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable})

}