import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ChannelType } from "discord.js";
import ms from "ms";
import { svStatistics } from "../../..";
import { botDB } from "../../../db";
import { alliancesModel } from "../../../models";
import { sendMessageSlash } from "../../../../shared/functions";
import { interactionCommands } from "../../../events/interaction";

export const statsScb = new SlashCommandBuilder()
.setName("stats")
.setNameLocalization('es-ES', 'estadísticas')
.setDescription('📊 Show bot statistics')
.setDescriptionLocalization('es-ES', `📊 Muestra estadísticas del bot.`).toJSON()

export const statsSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, locale } = int, isEnglish = locale == 'en-US'
  const author = guild?.members.cache.get(user.id)
  await int.deferReply()
  
  const { emoji } = botDB, { ws: { ping }, uptime } = client
  const latency = ping <= 60 ? emoji.ping30ms : ping <= 120 ? emoji.ping60ms : emoji.ping100ms
  const textCh = client.channels.cache.filter(ft => ft.type == ChannelType.GuildText).size, voiseCH = client.channels.cache.filter(fv => fv.type == ChannelType.GuildVoice).size, cateCh = client.channels.cache.filter(fc => fc.type == ChannelType.GuildCategory).size

  const StatsEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || int.user.username, iconURL: author?.displayAvatarURL()})
  .setTitle(`<:grafica:958856872981585981> ${isEnglish ? 'Stats' : 'Estadísticas'}`)
  .setFields(
    { name: `<:wer:920166217086537739> **${isEnglish ? 'Servers' : 'Servidores'}:**`, value: `${client.guilds.cache.size.toLocaleString()}`, inline: true },
    { name: `📑 **${isEnglish ? 'Commands' : 'Comandos'}:**`, value: `${interactionCommands.size}`, inline: true },
    { name: "<:cronometro:948693729588441149> **Uptime:**", value: `<t:${Math.floor(Math.floor(Date.now()-(uptime || 1000)) / 1000)}:R>`, inline: true },
    { name: `${latency} **Ping:**`, value: `${ping} ms`, inline: true },
    { name: `🔢 **${isEnglish ? 'Commands uses' : 'Usos de comandos'}:**`, value: `${botDB.usedCommands.toLocaleString()}`, inline: true },
    { name: `😀 **Emojis:** ${client.emojis.cache.size.toLocaleString()}`, value: `${client.emojis.cache.filter(fn => !fn.animated).size.toLocaleString()} ${isEnglish ? 'normals' : 'normales'}\n${client.emojis.cache.filter(fa => fa.animated).size.toLocaleString()} ${isEnglish ? 'animated' : 'animados'}`, inline: true },
    { name: `👥 **${isEnglish ? 'Users' : 'Usuarios'}: ${client.users.cache.size.toLocaleString()}**`, value: `👤 ${client.users.cache.filter(fu => !fu.bot).size.toLocaleString()} ${isEnglish ? 'members' : 'miembros'}\n🤖 ${client.users.cache.filter(fb => fb.bot).size.toLocaleString()} bots`, inline: true },
    { name: ` **${isEnglish ? 'Channels' : 'Canales'}: ${(textCh + voiseCH + cateCh).toLocaleString()}**`, value: `<:canaldetexto:904812801925738557> ${textCh.toLocaleString()} ${isEnglish ? 'text' : 'texto'}\n <:canaldevoz:904812835295596544> ${voiseCH.toLocaleString()} ${isEnglish ? 'voice' : 'voz'}\n<:carpeta:920494540111093780> ${cateCh.toLocaleString()} ${isEnglish ? 'categories' : 'categorías'}`, inline: true },
  )
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: guild?.name || '', iconURL: guild?.iconURL() || undefined})
  .setTimestamp()

  
  sendMessageSlash(int, {embeds: [StatsEb]})
}