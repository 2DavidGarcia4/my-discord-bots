import { CacheType, ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botDB } from "../../../db";
import { sendMessageSlash } from "../../../../shared/functions";

export const helpScb = new SlashCommandBuilder()
.setName("help")
.setNameLocalization('es-ES', 'ayuda')
.setDescription(`👋 Do you need help? I can help you.`)
.setDescriptionLocalization('es-ES', '👋 ¿Necesitas ayuda?, te puedo ayudar')
.toJSON()

export const helpSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const author = int.guild?.members.cache.get(int.user.id)
  
  await int.deferReply()

  const HelpEb = new EmbedBuilder()
  .setAuthor({name: `Hola ${author?.nickname || author?.user.username}`, iconURL: int.user.displayAvatarURL()})
  .setTitle(`Soy **${client.user?.username}** Bot multi funcional`)
  .setThumbnail(client.user?.displayAvatarURL() || null)
  .setTimestamp()

  if(int.guildId == botDB.serverId){
    HelpEb
    .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
    .addFields(
      {name: `${botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
      {name: `${botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
    )
  
  }else{
    HelpEb
    .setDescription(`[📨 **Invítame a tu servidor**](${'invitacion'})\n[🔧 **Servidor de soporte**](${botDB.serverInvite})`)
  }

  sendMessageSlash(int, {embeds: [HelpEb]})
}