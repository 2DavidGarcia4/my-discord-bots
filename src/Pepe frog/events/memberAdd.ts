import { Client, GuildMember } from "discord.js";
import { frogDb } from "../db";

export const memberAddEvent = async (member: GuildMember, client: Client) => {
  const { serverId } = frogDb
  if(member.guild.id != serverId) return
  
  frogDb.joins++
}