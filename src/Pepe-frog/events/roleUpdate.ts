import { Role } from "discord.js";
import { Frog as client } from "..";
import { FrogDb } from "../db";

export async function roleUpdateEvent(oldRole: Role, newRole: Role) {
  const { serverId, principalServerId } = FrogDb
  if(oldRole.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.roles.cache.find(f=> f.name == oldRole.name)?.edit({name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable})

}