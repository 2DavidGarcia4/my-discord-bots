import { ChannelType, Client, DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { botDB } from "../db";

export const channelDeleteEvent = async (cd: DMChannel |NonThreadGuildBasedChannel, client: Client) => {
  if(cd.type == ChannelType.DM) return;
  if(cd.guildId != botDB.serverId) return;
  

  
}