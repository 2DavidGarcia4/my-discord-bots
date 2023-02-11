import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client } from "discord.js";
import { sendMessageSlash } from "../../../../utils/functions";
import { fetchServerRules } from "../../../utils";

export const reglasScb = new SlashCommandBuilder()
.setName("reglas")
.setDescription(`📜 Te muestra las reglas del servidor.`).toJSON()

export const reglasSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const rules = await fetchServerRules(client)
  await int.deferReply({ephemeral: true})
  
  const embReglas = new EmbedBuilder()
  .setAuthor({name: "📜 Reglas"})
  .setDescription(rules || '')
  .setColor(int.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
  .setTimestamp()

  sendMessageSlash(int, {embeds: [embReglas]})
}