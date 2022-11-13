import { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Message } from "discord.js";
import { botDB } from "../../db";

export const rolesCommand = (msg: Message) => {
  const rolesSelectorEb = new EmbedBuilder()
  .setTitle(`🏅 Roles`)
  .setDescription(`*👀 En tu perfil dentro del servidor veras un apartado de roles en el encontraras todos los roles que tienes.*\n\n${botDB.emoji.information} En el menú de abajo encontraras barios tipos de roles ya sean roles de **colores** aquellos que solo te modifican el color de tu nombre dentro del servidor, roles de **acceso** aquellos que como su nombre lo indica te dan acceso a categorías y canales ocultos, roles de **notificaciones** aquellos que se utilizan para notificar a usuarios sobre algo como un nuevo anuncio o sorteo, roles **personales** aquellos que solo aportan mas información de ti en tu perfil como roles de genero o edad.\n\n*👉 Al seleccionar una opción del menú de abajo se desplegara un nuevo mensaje como este con mas información para cada tipo de rol y podrás elegir uno o varios roles.*`)
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const rolesSelectorMenu = new ActionRowBuilder<SelectMenuBuilder>()
  .addComponents(
    new SelectMenuBuilder()
    .setCustomId('select-type-role')
    .setPlaceholder(`👉 Selecciona un tipo de rol.`)
    .setOptions([
      {
        emoji: '💂',
        label: 'Acceso',
        value: 'access'
      },
      {
        emoji: '🌈',
        label: 'Colores',
        value: 'colors'
      },
      {
        emoji: '🔔',
        label: 'Notificaciones',
        value: 'notifications'
      },
      {
        emoji: '👤',
        label: 'Genero',
        value: 'gender'
      },
      {
        emoji: '🔢',
        label: 'Edad',
        value: 'age'
      },
      {
        emoji: '🎮',
        label: 'Videojuegos',
        value: 'video-games'
      },
    ])
  )
  msg.channel.send({embeds: [rolesSelectorEb], components: [rolesSelectorMenu]})
}