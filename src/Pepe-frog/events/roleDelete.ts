import { Role } from "discord.js";
import { Frog as client } from "..";
import { FrogDb } from "../db";

export async function roleDeleteEvent(role: Role) {
  const { serverId, principalServerId } = FrogDb
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.roles.cache.find(f=> f.name == role.name)?.delete()
}