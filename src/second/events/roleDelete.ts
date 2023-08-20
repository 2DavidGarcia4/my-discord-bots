import { Role } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class DoleDeleteEvent extends BotEvent {
  constructor() {
    super('roleDelete')
  }
  
  async execute(role: Role, client: SecondClientData) {
    const { serverId, backupServerId } = client.data
    if(role.guild.id != serverId) return
  
    const principalServer = client.guilds.cache.get(backupServerId)
    principalServer?.roles.cache.find(f=> f.name == role.name)?.delete()
  }
}