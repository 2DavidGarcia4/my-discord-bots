import { Client, Invite } from "discord.js";
import { botDB } from "../db";
import { invitesModel } from "../models";

export const invitationDeleteEvent = async (invite: Invite, client: Client) => {
  const { serverId } = botDB
  if(invite.guild?.id != serverId) return;

  const dataInv = await invitesModel.findById(serverId), arrayMi = dataInv?.miembros
  const miembro = arrayMi?.find(f=> f.codes.some(s=> s.code==invite.code))
  if(miembro){
    miembro.codes.splice(miembro.codes.findIndex(f=> f.code==invite.code), 1)
    for(let i of miembro.codes){
      await client.fetchInvite(i.code).catch(c=> {
        miembro?.codes.splice(miembro?.codes.findIndex(f=> f.code==i.code), 1)
      })
    }
    await invitesModel.findByIdAndUpdate(serverId, {miembros: arrayMi})
  }
}