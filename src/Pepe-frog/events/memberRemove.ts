import { GuildMember, PartialGuildMember } from 'discord.js'
import { modDb } from '..'
import { FrogDb } from '../db'

export const name = 'guildMemberRemove'

export async function execute(member: GuildMember | PartialGuildMember) {
  const { serverId } = FrogDb
  if(member.guild.id != serverId) return

  FrogDb.leaves++
  if(modDb.some(s=> s.id == member.id)) modDb.splice(modDb.findIndex(f=> f.id == member.id), 1)
}