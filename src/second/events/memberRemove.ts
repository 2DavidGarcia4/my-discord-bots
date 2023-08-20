import { GuildMember, PartialGuildMember } from 'discord.js'
import { type SecondClientData } from '..'
import { BotEvent } from '../..'

export default class MemberRemoveEvent extends BotEvent {
  constructor() {
    super('guildMemberRemove')
  }

  async execute(member: GuildMember | PartialGuildMember, client: SecondClientData) {
    const { serverId } = client.data
    if(member.guild.id != serverId) return
  
    client.data.leaves++
    if(client.modDb.some(s=> s.id == member.id)) client.modDb.splice(client.modDb.findIndex(f=> f.id == member.id), 1)
  }
}