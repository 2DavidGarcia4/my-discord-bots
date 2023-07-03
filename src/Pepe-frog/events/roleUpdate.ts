import { Role, Client } from "discord.js";
import { FrogDb } from "../db";

export const roleUpdateEvent = async (oldRole: Role, newRole: Role, client: Client) => {
  const { serverId, principalServerId } = FrogDb
  if(oldRole.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.roles.cache.find(f=> f.name == oldRole.name)?.edit({name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable})

}