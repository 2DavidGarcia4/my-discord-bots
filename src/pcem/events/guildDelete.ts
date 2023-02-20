import { Client, EmbedBuilder, Guild } from "discord.js";
import { getBotData } from "../utils";


export const guildDeleteEvent = async (guild: Guild, client: Client) => {
  const botData = await getBotData(client)
  const owner = guild.members.cache.get(guild.ownerId), channelLog = client.channels.cache.get(botData?.logs.guildDelete || '')
  const guildRoles = guild.roles.cache.filter(f => !f.managed && f.id != guild.id).map(m => ({ posicion: m.position, nombre: m.name })).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ")

  const GuildDeleteEb = new EmbedBuilder()
  .setAuthor({name: owner?.user.tag || '', iconURL: owner?.user.displayAvatarURL()})
  .setThumbnail(guild.iconURL({size: 2048}))
  .setImage(guild.bannerURL({size: 2048}))
  .setTitle("➖ Kicked from a server")
  .setDescription(`${guild.name}\n${guild.description || '*No description*'}`)
  .setFields(
    { name: `<:wer:920166217086537739> **Guild:**`, value: `🆔 ID: ${guild.id}\n📅 Created at <t:${Math.floor(guild.createdAt.valueOf() / 1000)}:F> *(<t:${Math.floor(guild.createdAt.valueOf() / 1000)}:R>)*`, inline: true },
    { name: `👥 **Members:** ${guild.members.cache.size.toLocaleString()}`, value: `👤 Users: ${guild.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true },
    { name: `🌈 **Roles:** ${guild.roles.cache.size}`, value: `${guildRoles}`, inline: true },
    { name: `👑 **Owner:**`, value: `${owner?.user.tag}\n🆔 ${owner?.id}` },
  )
  .setColor('Red')
  .setTimestamp()

  if(channelLog?.isTextBased()) channelLog.send({ embeds: [GuildDeleteEb] })
}