import { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Message } from "discord.js";
import { botDB } from "../../db";

export const informationCommand = (msg: Message) => {
  const embInformacion = new EmbedBuilder({
    title: `${botDB.emoji.information} Información`,
    description: 'En el menú desplegable de abajo encontraras varias opciones, elije una para obtener información sobre ella.'
  }).setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const menu = new ActionRowBuilder<SelectMenuBuilder>()
  .addComponents(
    new SelectMenuBuilder()
      .setCustomId("información")
      .setPlaceholder(`📚 ¡Selecciona una opción!`)
      .addOptions([
        {
          label: `Servidor`,
          emoji: `💚`,
          description: `Muestra información del servidor.`,
          value: `servidor`
        },
        {
          label: `Categoría importante`,
          emoji: `💠`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-importante`
        },
        {
          label: `Categoría colaboradores`,
          emoji: `💎`,
          description: `Muestra información de la categoría.`,
          value: `categoría-colaboradores`
        },
        {
          label: `Categoría Promociones VIP`,
          emoji: `✨`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-promociones-vip`
        },
        {
          label: `Categoría promociónate`,
          emoji: `📣`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-promociónate`
        },
        {
          label: `Categoría general`,
          emoji: `🧭`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-general`
        },
        {
          label: `Categoría user x user`,
          emoji: `👥`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-user-x-user`
        },
        {
          label: `Categoría entretenimiento`,
          emoji: `🎮`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-entretenimiento`
        },
        {
          label: `Categoría audio`,
          emoji: `🔊`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-audio`
        },
        {
          label: `Categoría registros`,
          emoji: `📝`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-registros`
        },
        {
          label: `Categoría soporte`,
          emoji: `🔰`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-soporte`
        },
        {
          label: `Categoría estadísticas`,
          emoji: `📊`,
          description: `Muestra información de los canales de esa categoría.`,
          value: `categoría-estadísticas`
        },
        {
          label: `Roles exclusivos`,
          emoji: `🏆`,
          description: `Muestra información de todos los roles exclusivos.`,
          value: `roles-exclusivos`
        },
        {
          label: `Roles personales`,
          emoji: `🧑`,
          description: `Muestra información de todos los roles personales.`,
          value: `roles-personales`
        },
        {
          label: `Roles de ping`,
          emoji: `🔔`,
          description: `Muestra información de todos los roles de ping o notificaciones.`,
          value: `roles-ping`
        },
        {
          label: `Roles de nivel`,
          emoji: `🎖️`,
          description: `Muestra información de todos los roles de nivel.`,
          value: `roles-nivel`
        },
        {
          label: `Roles color`,
          emoji: `🌈`,
          description: `Muestra información de todos los roles de color.`,
          value: `roles-color`
        },
        {
          label: `Roles de economía`,
          emoji: `💸`,
          description: `Muestra información de todos los roles de economía.`,
          value: `roles-economía`
        },
        {
          label: `Roles del personal`,
          emoji: `👮`,
          description: `Muestra información de los roles del personal del servidor.`,
          value: `roles-personal`
        },
        {
          label: `Otros roles`,
          emoji: `♻️`,
          description: `Muestra información de todos los demás roles.`,
          value: `otros-roles`
        },
        {
          label: `Bot del servidor`,
          emoji: `🤖`,
          description: `Muestra información del bot del servidor.`,
          value: `bot-servidor`
        },
      ])
  )

  msg.channel.send({embeds: [embInformacion], components: [menu]}).then(()=> {
    msg.delete()
  })
}