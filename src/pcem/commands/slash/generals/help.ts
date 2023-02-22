import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botDB } from "../../../db";
import { sendMessageSlash } from "../../../../shared/functions";

export const helpScb = new SlashCommandBuilder()
.setName("help")
.setNameLocalization('es-ES', 'ayuda')
.setDescription(`👋 Do you need help? I can help you.`)
.setDescriptionLocalization('es-ES', '👋 ¿Necesitas ayuda?, te puedo ayudar')
.toJSON()

export const helpSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, locale } = int, isEnglish = locale == 'en-US'
  const { color, emoji, serverInvite, botInvite } = botDB
  const author = guild?.members.cache.get(user.id)
  
  await int.deferReply()

  const HelpEb = new EmbedBuilder()
  .setAuthor({name: `${isEnglish ? 'Hello' : 'Hola'} ${author?.nickname || author?.user.username}`, iconURL: int.user.displayAvatarURL()})
  .setTitle(isEnglish ? `I am multifunctional ${client.user?.username} Bot` : `Soy **${client.user?.username}** Bot multi funcional`)
  .setThumbnail(client.user?.displayAvatarURL() || null)
  .setColor(color.bot)
  .setTimestamp()

  const HelpButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
    .setLabel(isEnglish ? 'Invite me' : 'Invitame')
    .setEmoji('📨')
    .setStyle(ButtonStyle.Link)
    .setURL(botInvite),

    new ButtonBuilder()
    .setLabel(isEnglish ? 'Support server' : 'Servidor de soporte')
    .setEmoji('🔧')
    .setStyle(ButtonStyle.Link)
    .setURL(serverInvite)
  )

  if(int.guildId == botDB.serverId){
    HelpEb
    .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
    .addFields(
      {name: `${botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
      {name: `${botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
    )
  
  }else{
    HelpEb
    .setDescription(isEnglish ? 
      `To see my commands you can use my command </commands:1075587552133783612>\n\n*If you want to report a bug or you don't know how a command works you can join my support server*` :
      `Para ver mis comandos puede utilizar mi comando </commands:1075587552133783612>\n\n*Si quieres reportar un fallo o no sabes como funciona un comando puedes unirte a mi servidor de soporte*`
    )
  }

  sendMessageSlash(int, {embeds: [HelpEb], components: [HelpButtons]})
}