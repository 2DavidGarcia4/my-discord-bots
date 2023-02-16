import { ChannelType, Client, EmbedBuilder, GuildMember, PartialGuildMember } from "discord.js";
import ms from "ms";
import { svStatistics } from "..";
import { botDB } from "../db";
import { getBotData } from "../utils";

export const memberRemoveEvent = async (gmr: GuildMember | PartialGuildMember, client: Client) => {
  const { color, serverId } = botDB
  if(gmr.guild.id != serverId) return;
  svStatistics.leaves++
  
  const dataBot = await getBotData(client)
  if(!dataBot) return

  const leaveLog = client.channels.cache.get(dataBot.logs.exit)
  if(leaveLog?.type != ChannelType.GuildText) return
  
  const leaveLogEb = new EmbedBuilder()
  .setTimestamp()
  if(gmr.user.bot){
    leaveLogEb
    .setTitle("🤖 Se fue un bot")
    .setThumbnail(gmr.displayAvatarURL())
    .setDescription(`${gmr}\n${gmr.user.tag}\nSeunio: <t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`)
    .setColor('Orange')

  }else{
    const mbanner = await client.users.fetch(gmr.id, {force: true})
    leaveLogEb
    .setAuthor({name: gmr.user.username, iconURL: gmr.user.displayAvatarURL({size: 2048})})
    .setThumbnail(gmr.user.displayAvatarURL())
    .setImage(mbanner.bannerURL({size: 2048}) || null)
    .setTitle("📤 Se fue un miembro")
    .setDescription(`Se fue ${gmr} (*no se por quien fue invitado/a*).\n📥 **Seunio:**\n<t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`)
    .setColor(color.negative)
    .setFooter({text: gmr.guild.name, iconURL: gmr.guild.iconURL() || undefined})

    leaveLog.send({embeds: [leaveLogEb]})
  }
}