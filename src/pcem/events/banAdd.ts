import { ChannelType, Client, EmbedBuilder, GuildBan } from "discord.js";
import { botDB } from "../db";
import { getBotData } from "../utils";


export const banAddEvent = async (gba: GuildBan, client: Client) => {
  if(gba.guild.id != botDB.serverId) return;

  const dataBot = await getBotData(client), channelLog = client.channels.cache.get(dataBot?.logs.ban || '')
  const embBaneado = new EmbedBuilder()
  .setThumbnail(gba.user.displayAvatarURL())
  .setTitle(`${botDB.emoji.negative} Usuario baneado`)
  .setDescription(`👤 ${gba.user.tag}\n\n🆔 ${gba.user.id}\n\n📝 Razon: ${(await gba.guild.bans.fetch()).filter(fb => fb.user.id === gba.user.id).map(mb => mb.reason)}`)
  .setColor(botDB.color.negative)
  .setFooter({text: gba.guild.name, iconURL: gba.guild.iconURL() || undefined})
  .setTimestamp()
  if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embBaneado]})
}