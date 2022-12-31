import { Client, GuildMember, PartialGuildMember } from "discord.js";
import { frogDb } from "../db";
import { modDb } from "..";

export const memberRemoveEvent = async (member: GuildMember | PartialGuildMember, client: Client) => {
  const { serverId } = frogDb
  if(member.guild.id != serverId) return

  frogDb.leaves++
  if(modDb.some(s=> s.id == member.id)) modDb.splice(modDb.findIndex(f=> f.id == member.id), 1)
}