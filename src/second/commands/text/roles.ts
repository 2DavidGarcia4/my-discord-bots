import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js'
import { type MessageProp, TextCommand } from '../../..'

export default class RolesCommand extends TextCommand {
  constructor() {
    super({name: 'roles'})
  }

  public async execute({message: msg}: {message: MessageProp}) {
    const RolesEb = new EmbedBuilder()
    .setTitle('🎭 Roles')
    .setDescription('Hola, aquí podrás obtener los roles que quieras, unos roles te notifican sobre acciones que se realizan en el servidor mientras que otros son solo de adorno como roles que cambian el color de tu nombre.\n\nPara obtener un rol seleccione el tipo de rol que quieres obtener abajo en el menú desplegable.')
    .setFooter({text: "you don't speak Spanish?, Click blue button below"})
    .setColor(msg.guild?.members.me?.displayHexColor || 'White')
  
    const RolesBtn = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('en-roles-btn')
      .setEmoji('👅')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary)
    )
  
    const RolesMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      new StringSelectMenuBuilder()
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
        {
          label: 'Géneros',
          emoji: '👥',
          description: 'Roles que te identifican con un género.',
          value: 'genders'
        },
      ])
    )
  
    msg.channel.send({embeds: [RolesEb], components: [RolesMenu, RolesBtn ]})
  }
}