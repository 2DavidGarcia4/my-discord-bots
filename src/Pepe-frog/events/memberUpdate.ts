import { GuildMember, type PartialGuildMember } from "discord.js";
import { Frog as client } from "..";
import { FrogDb } from "../db";
import { createVerified } from "../utils/functions";

export async function memberUpdateEvent(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
  if(oldMember.guild.id != FrogDb.serverId) return
  if(oldMember.permissions.has('ManageGuild')) return
  
  const oldRoles = oldMember.roles.cache
  const newRoles = newMember.roles.cache

  if(newRoles.has(FrogDb.roles.verified) && !oldRoles.has(FrogDb.roles.verified)) {
    console.log('Rol agregado')
    createVerified(client, {id: oldMember.id})

  }else if(oldRoles.has(FrogDb.roles.verified) && !newRoles.has(FrogDb.roles.verified)) {
    console.log('Rol eliminado')
  }
}