import { ChannelType, Client, EmbedBuilder, GuildBan } from "discord.js";
import { botDB } from "../db";
import { getBotData } from "../utils";


export const banRemoveEvent = async (gbr: GuildBan, client: Client) => {
  if(gbr.guild.id != botDB.serverId) return;
    
  const dataBot = await getBotData(client), channelLog = client.channels.cache.get(dataBot?.logs.unban || '')
  const embDesbaneado = new EmbedBuilder()
  .setThumbnail(gbr.user.displayAvatarURL())
  .setTitle(`${botDB.emoji.afirmative} Usuario desbaneado`)
  .setDescription(`👤 ${gbr.user.tag}\n\n🆔 ${gbr.user.id}\n📄 ${gbr.reason || 'no encontre la razón'}`)
  .setColor(botDB.color.afirmative)
  .setFooter({text: gbr.guild.name, iconURL: gbr.guild.iconURL() || undefined})
  .setTimestamp()
  if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embDesbaneado]})
}