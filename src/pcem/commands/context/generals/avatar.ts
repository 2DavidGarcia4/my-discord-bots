import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { sendMessageSlash } from "../../../../shared/functions";

export const avatarCmcb = new ContextMenuCommandBuilder()
.setName('avatar')
.setType(2)

export const avatarContextMenu = async (int: UserContextMenuCommandInteraction<CacheType>) => {
  const { targetId, guild, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(targetId) 
  const url = author?.displayAvatarURL({size: 2048, extension: author?.avatar?.includes('a_') ? 'gif' : 'png'}) || ''
  const authorName = author?.nickname || author?.user.username

  await int.deferReply()

  const AvatarEb = new EmbedBuilder() 
  .setAuthor({name: (isEnglish ? `${authorName} avatar` :  `Avatar de ${authorName}`)})
  .setTitle('🔗 Url')
  .setURL(url)
  .setImage(url)
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()

  sendMessageSlash(int, {embeds: [AvatarEb]})
}