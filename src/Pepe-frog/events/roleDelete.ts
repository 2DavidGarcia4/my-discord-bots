import { Client, Role } from "discord.js";
import { FrogDb } from "../db";

export const roleDeleteEvent = async (role: Role, client: Client) => {
  const { serverId, principalServerId } = FrogDb
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.roles.cache.find(f=> f.name == role.name)?.delete()
}