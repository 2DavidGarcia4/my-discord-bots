import { Role } from 'discord.js'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const name: EventName = 'roleCreate'

export async function execute(role: Role, client: PepeFrogClient) {
  const { serverId, backupServerId } = client.data
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.create({name: role.name, permissions: role.permissions})
}