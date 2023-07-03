import { Client, GuildMember, PartialGuildMember } from "discord.js";
import { FrogDb } from "../db";
import { modDb } from "..";

export const memberRemoveEvent = async (member: GuildMember | PartialGuildMember, client: Client) => {
  const { serverId } = FrogDb
  if(member.guild.id != serverId) return

  FrogDb.leaves++
  if(modDb.some(s=> s.id == member.id)) modDb.splice(modDb.findIndex(f=> f.id == member.id), 1)
}