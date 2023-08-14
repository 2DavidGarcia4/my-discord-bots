import { GuildMember, type PartialGuildMember } from 'discord.js'
import { FrogDb } from '../db'
import { createVerified } from '../lib/services'
import { getSnackData } from '../lib/notion'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const name: EventName = 'guildMemberUpdate'

export async function execute(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember, client: PepeFrogClient) {
  if(oldMember.guild.id != FrogDb.serverId) return
  if(oldMember.permissions.has('ManageGuild')) return

  const SnackData = await getSnackData()
  
  const oldRoles = oldMember.roles.cache
  const newRoles = newMember.roles.cache

  if(newRoles.has(SnackData.roles.verified) && !oldRoles.has(SnackData.roles.verified)) {
    console.log('Rol agregado')
    createVerified(client, {id: oldMember.id})

  }else if(oldRoles.has(SnackData.roles.verified) && !newRoles.has(SnackData.roles.verified)) {
    console.log('Rol eliminado')
  }
}