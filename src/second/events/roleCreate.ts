import { Role } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class RoleCreateEvent extends BotEvent {
  constructor() {
    super('roleCreate')
  }

  async execute(role: Role, client: SecondClientData) {
    const { serverId, backupServerId } = client.data
    if(role.guild.id != serverId) return
  
    const principalServer = client.guilds.cache.get(backupServerId)
    principalServer?.roles.create({name: role.name, permissions: role.permissions})
  }
}