import { Client, EmbedBuilder, Message } from "discord.js"
import { sendMessageText } from "../../../../shared/functions"
import { botDB } from "../../../db"

export const name = "help"

export const helpCommand = (msg: Message<boolean>, client: Client) => {
  const { member, guild, guildId } = msg

  msg.channel.sendTyping()
  const HelpEb = new EmbedBuilder()
  .setAuthor({name: `Hola ${member?.nickname || member?.user.username}`, iconURL: member?.user.displayAvatarURL()})
  .setTitle(`Soy **${client.user?.username}** Bot multi funcional`)
  .setThumbnail(client.user?.displayAvatarURL() || null)
  .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()

  if(guildId == botDB.serverId){
    HelpEb
    .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
    .addFields(
      {name: `${botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
      {name: `${botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
    )
  
  }else{
    HelpEb
    .setDescription(`Usa el comando \`\`${botDB.prefix}comandos\`\` para conocer todos mis comandos.\nMi prefijo en este servidor es: \`\`${botDB.prefix}\`\`\n[📨 **Invítame a tu servidor**](${'https://invitation.com'})\n[🔧 **Servidor de soporte**](${botDB.serverInvite})`)
  }

  sendMessageText(msg, {embeds: [HelpEb]})
}

export const alias = ['ayuda']