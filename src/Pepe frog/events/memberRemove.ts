import { Client, GuildMember, PartialGuildMember } from "discord.js";
import { frogDb } from "../db";

export const memberRemoveEvent = async (member: GuildMember | PartialGuildMember, client: Client) => {
  const { serverId } = frogDb
  if(member.guild.id != serverId) return

  frogDb.leaves++
}