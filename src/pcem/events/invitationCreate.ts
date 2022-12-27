import { Client, Invite } from "discord.js";
import { botDB } from "../db";
import { invitesModel } from "../models";

export const invitationCreateEvent = async (invite: Invite, client: Client) => {
  const { serverId } = botDB
  if(invite.guild?.id != serverId) return;

  const dataInv = await invitesModel.findById(serverId), arrayMi = dataInv?.miembros
  const miembro = arrayMi?.find(f=> f.id==invite.inviterId)
  if(miembro){
    miembro.codes.push({code: invite.code, usos: 0})
  }else{
    arrayMi?.push({id: invite.inviterId || '', tag: client.users.cache.get(invite.inviterId || '')?.tag || '', verdaderas: 0, totales: 0, restantes: 0, falsas: 0, tiempo: null, codes: [{code: invite.code, usos: 0}], invitados: []})
  }
  await invitesModel.findByIdAndUpdate(serverId, {miembros: arrayMi})
}