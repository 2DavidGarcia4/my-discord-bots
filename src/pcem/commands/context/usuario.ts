import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction, CacheType, EmbedBuilder } from "discord.js"
import { sendMessageSlash } from "../../../shared/functions"

export const usuarioCmcb = new ContextMenuCommandBuilder()
.setName("Usuario")
.setType(2)

export const usuarioContextMenu = async (int: UserContextMenuCommandInteraction<CacheType>) => {
  const { guild, user } = int, author = guild?.members.cache.get(user.id)

  const member = guild?.members.cache.get(int.targetId)
  if(!member) return
  await int.deferReply()

  const usuarioEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL()})
  .setTitle(`Información de ${member?.user.tag}`)
  .setThumbnail(member?.displayAvatarURL({size: 2048}) || null)
  .addFields(
    {name: "**📅 Creo la cuenta:**", value: `<t:${Math.round(member.user.createdAt.valueOf() / 1000)}:R>`, inline: true},
    {name: "**📥 Se unió:**", value: `<t:${Math.round((member.joinedAt?.valueOf() || 0) / 1000)}:R>`, inline: true},
  )
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()
  sendMessageSlash(int, {embeds: [usuarioEb]})
}