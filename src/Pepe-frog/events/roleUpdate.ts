import { Role } from 'discord.js'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const name: EventName = 'roleUpdate'

export async function execute(oldRole: Role, newRole: Role, client: PepeFrogClient) {
  const { serverId, backupServerId } = client.data
  if(oldRole.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.cache.find(f=> f.name == oldRole.name)?.edit({name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable})

}