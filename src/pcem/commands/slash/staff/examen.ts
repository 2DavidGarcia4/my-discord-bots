import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { sendMessageSlash } from "../../../../utils/functions";

export const examenScb = new SlashCommandBuilder()
.setName("examen")
.setDescription(`📋 Examen para ser ayudante.`).toJSON()

export const examenSlashCommand = async (int: ChatInputCommandInteraction<CacheType>) => {
  const { emoji, color } = botDB, author = int.guild?.members.cache.get(int.user.id)

  estadisticas.comandos++
  await int.deferReply()

  const examenEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || author?.user.username || 'undefined', iconURL: int.user.displayAvatarURL()})
  .setTitle(`${emoji.staff} Examen para ser **Ayudante**`)
  .setDescription(`\`\`1.\`\` ¿Cuál es tu edad?\n\`\`2.\`\` ¿Por que quieres ser ayudante?\n\`\`3.\`\` ¿Cuánto tiempo le dedicarías al servidor?\n\`\`4.\`\` ¿Serias activo en el chat?\n\`\`5.\`\` ¿Que harías si miras a un Mod/Admi abusando de su rango?\n\`\`6.\`\` ¿Sabes bien la información de los roles/canales del servidor?\n\`\`7.\`\` Al estar en una situación difícil de controlar. ¿Qué harías?\n\`\`8.\`\` ¿Tienes paciencia?\n\`\`9.\`\` ¿Estas comprometido/a en que una ves siendo staff todo lo que mires se quedara solo en el grupo del staff?\n\`\`10.\`\` ¿Cómo ayudarías/Guiarías a un usuario?\n\`\`11.\`\` ¿Tienes experiencia siendo helper/ayudante?\n\`\`12.\`\` ¿Cómo conociste este server?\n\`\`13.\`\` ¿Cuál es tu pasado en Discord?\n\`\`14.\`\` ¿Alguna vez formaste parte de una squad o raideaste?\n\`\`15.\`\` Para ti, ¿De que se encarga un helper/ayudante?\n\n<:Pikachu_Feliz:925799716585881640> **Recuerda lo que aquí más importa es tu sinceridad, honestidad y conocimiento.** <:Pikachu_Feliz:925799716585881640>`)
  .setColor(int.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
  .setTimestamp()

  sendMessageSlash(int, {embeds: [examenEb]})
}