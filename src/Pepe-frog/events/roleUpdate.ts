import { Role } from 'discord.js'
import { PepeFrogClient } from '../client'
import { FrogDb } from '../db'

export const name: EventName = 'roleUpdate'

export async function execute(oldRole: Role, newRole: Role, client: PepeFrogClient) {
  const { serverId, backupServerId } = FrogDb
  if(oldRole.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.cache.find(f=> f.name == oldRole.name)?.edit({name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable})

}