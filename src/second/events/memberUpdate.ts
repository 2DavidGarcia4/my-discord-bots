import { GuildMember, type PartialGuildMember } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class MemberUpdateEvent extends BotEvent {
  constructor() {
    super('guildMemberUpdate')
  }

  async execute(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember, client: SecondClientData) {
    if(oldMember.guild.id != client.data.serverId) return
    if(oldMember.permissions.has('ManageGuild')) return
  
    const { roles } = client.data
    
    const oldRoles = oldMember.roles.cache
    const newRoles = newMember.roles.cache
  
    if(newRoles.has(roles.verified) && !oldRoles.has(roles.verified)) {
      console.log('Rol agregado')
      // createVerified(client, {id: oldMember.id})
  
    }else if(oldRoles.has(roles.verified) && !newRoles.has(roles.verified)) {
      console.log('Rol eliminado')
    }
  }
}