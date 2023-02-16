import { Client, Invite } from "discord.js";
import { botDB } from "../db";

export const invitationCreateEvent = async (invite: Invite, client: Client) => {
  const { serverId } = botDB
  if(invite.guild?.id != serverId) return;

}