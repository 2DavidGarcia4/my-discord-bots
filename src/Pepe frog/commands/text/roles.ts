import { Message, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";

export const rolesCommand = async (msg: Message<boolean>) => {
  const RolesEb = new EmbedBuilder()
  .setTitle('🌈 Roles')
  .setDescription('Hola, aquí podrás obtener los roles que quieras, unos roles te notifican sobre acciones que se realizan en el servidor mientras que otros son solo de adorno como roles que cambian tu color.\n\nPara obtener un rol seleccione el tipo de rol que quieres obtener abajo en el menú desplegable.')
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const RolesBtn = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
    .setCustomId('en-roles-btn')
    .setEmoji('👅')
    .setLabel('English')
    .setStyle(ButtonStyle.Primary)
  )

  const RolesMenu = new ActionRowBuilder<SelectMenuBuilder>()
  .addComponents(
    new SelectMenuBuilder()
    .setCustomId('roles-menu')
    .setPlaceholder('👉 Selecciona un tipo de rol')
    .setOptions([
      {
        label: 'Notificaciones',
        emoji: '🔔',
        description: 'Roles que te notifican sobre acciones.',
        value: 'notifications'
      },
      {
        label: 'Colores',
        emoji: '🌈',
        description: 'Roles que cambian el color de tu nombre.',
        value: 'colors'
      },
    ])
  )

  msg.channel.send({embeds: [RolesEb], components: [RolesMenu, RolesBtn ]})
}