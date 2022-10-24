import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { sendMessageSlash } from "../../../utils/functions";

export const pingScb = new SlashCommandBuilder()
.setName("ping")
.setDescription("🏓 Muestra el ping del bot").toJSON()

export const pingSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const author = int.guild?.members.cache.get(int.user.id), { ws: {ping} } = client, {emoji} = botDB
  const latenci = ping <= 30 ? emoji.ping30ms : ping <= 60 ? emoji.ping60ms : emoji.ping100ms
  
  estadisticas.comandos++
  await int.deferReply()
  
  const embPing = new EmbedBuilder()
  .setAuthor({name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL()})
  .setTitle("🏓 Pong")
  .setDescription(`${latenci} ${client.ws.ping} ms`)
  .setColor(int.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
  .setTimestamp()
  
  sendMessageSlash(int, {embeds: [embPing]})
}