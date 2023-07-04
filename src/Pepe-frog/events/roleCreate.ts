import { Role } from "discord.js";
import { Frog as client } from "..";
import { FrogDb } from "../db";

export async function roleCreateEvent(role: Role) {
  const { serverId, principalServerId } = FrogDb
  if(role.guild.id != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  principalServer?.roles.create({name: role.name, permissions: role.permissions})
}