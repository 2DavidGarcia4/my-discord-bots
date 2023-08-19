import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js'
import { type MessageProp, TextCommand } from '../../..'

export default class InfoCommand extends TextCommand{
  constructor() {
    super({
      name: 'info'
    })
  }
  
  public async execute({ message: msg }: { message: MessageProp }): Promise<void> {
    const InfoEb = new EmbedBuilder()
    .setTitle('<a:animate_info:1058179015938158592> Información')
    .setDescription('Aquí podrás obtener información de casi todo lo que hay en el servidor solo selecciona una opción en el menú de abajo y obtendrás información de esa opción.\n\n*En caso de haber leído y aun tener dudas puedes consultar con <@853063286320922634> cualquier duda.*')
    .setColor(msg.guild?.members.me?.displayHexColor || 'White')
    
    const InfoMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      new StringSelectMenuBuilder()
      .setCustomId('info-menu')
      .setPlaceholder('👉 Selecciona una opción.')
      .setOptions([
        {
          emoji: '🥟',
          label: 'Servidor',
          value: 'server'
        },
        {
          emoji: '1058198792282841220',
          label: 'Canales',
          value: 'channels'
        },
        {
          emoji: '🎭',
          label: 'Roles',
          value: 'roles'
        },
        {
          emoji: '🤖',
          label: 'Sobre mí',
          value: 'about-me'
        },
      ])
    )
    
    const InfoBtn = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('en-info-btn')
      .setEmoji('👅')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary)
    )
    
    msg.channel.send({embeds: [InfoEb], components: [InfoMenu, InfoBtn]})
  }
}