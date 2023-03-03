import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Message } from "discord.js"
import { sendMessageText } from "../../../../shared/functions"
import { botDB } from "../../../db"
import { getEmbedColor, getGuildPrefix } from "../../../utils"

export const name = "help"

export const helpCommand = (msg: Message<boolean>, client: Client) => {
  const { member, guild, guildId, author } = msg
  const { botInvite, serverInvite } = botDB

  const prefix = getGuildPrefix(guild)

  msg.channel.sendTyping()
  const HelpEb = new EmbedBuilder()
  .setAuthor({name: `Hola ${member?.nickname || author?.username}`, iconURL: member?.displayAvatarURL()})
  .setTitle(`Soy **${client.user?.username}** Bot multi funcional`)
  .setThumbnail(client.user?.displayAvatarURL() || null)
  .setColor(getEmbedColor(guild))
  .setTimestamp()

  const HelpButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
    .setLabel('Invitame')
    .setEmoji('📨')
    .setStyle(ButtonStyle.Link)
    .setURL(botInvite),

    new ButtonBuilder()
    .setLabel('Servidor de soporte')
    .setEmoji('🔧')
    .setStyle(ButtonStyle.Link)
    .setURL(serverInvite)
  )

  if(guildId == botDB.serverId){
    HelpEb
    .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
    .addFields(
      {name: `${botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
      {name: `${botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
    )
  
  }else{
    HelpEb
    .setDescription(`Mi prefijo en este servidor es \`\`${prefix}\`\` \nPara ver mis comandos puede utilizar mi comando \`\`${prefix}comandos\`\`\n\n*Si quieres reportar un fallo o no sabes como funciona un comando puedes unirte a mi servidor de soporte*`)
  }

  sendMessageText(msg, {embeds: [HelpEb], components: [HelpButtons]})
}

export const alias = ['ayuda']