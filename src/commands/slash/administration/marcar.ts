import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, CacheType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { botDB } from "../../../db";
import { suggestionsModel } from "../../../models";
import { addDataMarcar, estadisticas } from "../../..";
import { sendMessageSlash, setSlashErrors } from "../../../utils/functions";

export const marcarScb = new SlashCommandBuilder()
.setName("marcar")
.setDescription(`🚥 Marca el estado de una sugerencia (implementada, en progreso, no sucederá).`)
.addStringOption(suggestionId=>
  suggestionId.setName(`id`)
  .setDescription(`🆔 Proporciona la ID del mensaje de la sugerencia que quieres marcar.`)
  .setRequired(true)
).toJSON()

export const marcarSlashCommadn = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, options } = int, { serverId } = botDB

  estadisticas.comandos++
  const dataSug = await suggestionsModel.findById(serverId), arrayMsgSug = dataSug?.mensajes, messageId = options.getString("id"), suggestionsChannel = guild?.channels.cache.get('828300239488024587')

  if(setSlashErrors(int, [
    [
      Boolean(!arrayMsgSug?.some(s=> s.id == messageId)),
      `La **ID** que has proporcionado *(${messageId})* no pertenece a la de ninguna sugerencia que este en la base de datos.`
    ],
    [
      Boolean(!(suggestionsChannel?.type == ChannelType.GuildText ? suggestionsChannel.messages.cache.get(messageId || '') : false)),
      `No se encontró ninguna sugerencia con la id *${messageId}* que has proporcionado.`
    ]
  ])) return

  await int.deferReply({ephemeral: true})

  const MarcarEb = new EmbedBuilder()
  .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL()})
  .setTitle("🚥 Marca la sugerencia con un estado")
  .setDescription(`Elije un estado para marcar la sugerencia.\n\n🟢 **Implementada:** Esto significara que la sugerencia ha sido implementada al servidor.\n🟡 **en progreso:** Esto significara que la sugerencias esta en progreso de implementación.\n🔴 **no sucedera:** Esto significa que la sugerencia tubo varios votos negativos y por lo tanto nunca se implementara.\n🔵 **normal:** Este estado pone la sugerencia como predeterminado.`)
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()

  const MarcarBtns = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    [
      new ButtonBuilder()
      .setCustomId("implementada")
      .setEmoji("🟢")
      .setLabel("Implementada")
      .setStyle(ButtonStyle.Success),
    
      new ButtonBuilder()
      .setCustomId("en progreso")
      .setEmoji("🟡")
      .setLabel("En progreso")
      .setStyle(ButtonStyle.Secondary),
    
      new ButtonBuilder()
      .setCustomId("no sucedera")
      .setEmoji("🔴")
      .setLabel("No sucederá")
      .setStyle(ButtonStyle.Danger),
    
      new ButtonBuilder()
      .setCustomId("normal")
      .setEmoji("🔵")
      .setLabel("Normal")
      .setStyle(ButtonStyle.Primary)
    ]
  )

  sendMessageSlash(int, {embeds: [MarcarEb], components: [MarcarBtns]})
  addDataMarcar({autorID: user.id, sugID: messageId || ''})
}