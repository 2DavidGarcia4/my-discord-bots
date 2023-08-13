import { Role } from 'discord.js'
import { FrogDb } from '../db'
import { PepeFrogClient } from '../client'

export const name: EventName = 'roleCreate'

export async function execute(role: Role, client: PepeFrogClient) {
  const { serverId, backupServerId } = FrogDb
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(backupServerId)
  principalServer?.roles.create({name: role.name, permissions: role.permissions})
}