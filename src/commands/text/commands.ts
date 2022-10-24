import { Client, EmbedBuilder, Message } from "discord.js";
import { botDB } from "../../db";
import { sendMessageText } from "../../utils/functions";

export const commandsCommand = (msg: Message<boolean>, client: Client, args: string[]) => {
  msg.channel.sendTyping()
  const { prefix } = botDB
  const generalCommands = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`
  const moderationCommands = `**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`
  let descripcion = ""

  if (args[0] == 'all' && msg.author.id == botDB.creatorId) {
    descripcion = `**⚜️ Administración:**\n\`\`${prefix}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefix}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.\n\n💎 **Creador:**\n\`\`${prefix}addalianzas\`\` **|** Agrega alianzas a un miembro del servidor.\n\`\`${prefix}removealianzas\`\` **|** Elimina alianzas de un miembro.\n\`\`${prefix}removeusersystemali\`\` **|** Elimina un miembro del sistema de alianzas.\n\`\`${prefix}expulsarpersonal\`\` **|** Elimina un miembro del personal del sistema y le elimina todos los roles del personal.`
  } else {
    if (msg.member?.permissions.has('Administrator')) {
      descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.\n\n**⚜️ Administración:**\n\`\`${prefix}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefix}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.`
    } else {
      if (msg.member?.roles.cache.get("773271945894035486")) {
        descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`
      } else {
        if (!msg.member?.roles.cache.get("773271945894035486") || !msg.member?.permissions.has('Administrator')) {
          descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`
        }
      }
    }
  }

  const embComandos = new EmbedBuilder()
  .setAuthor({name: msg.member?.nickname ? msg.member?.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL()})
  .setTitle("📃 Comandos")
  .setDescription(descripcion)
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')
  .setFooter({ text: msg.guild?.name || 'indefined', iconURL: msg.guild?.iconURL() || undefined})
  .setTimestamp()
  sendMessageText(msg, {embeds: [embComandos]})
}