import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, CacheType, Client, Collection, EmbedBuilder, Interaction, RESTPostAPIApplicationCommandsJSONBody, StringSelectMenuBuilder } from "discord.js";
import { selectMultipleRoles, selectRole } from "../../shared/functions";

import { moveScb, moveSlashCommand } from "../commands/slash/move";

import { sendCmcb, sendCM } from "../commands/contextMenu/send";
import { deleteReactionsCM, deleteReactionsCmcb } from "../commands/contextMenu/deleteReactions";
import { deleteCM, deleteCmcb } from "../commands/contextMenu/delete";
import { getRules } from "../utils/functions";

export const commands = new Collection<string, RESTPostAPIApplicationCommandsJSONBody>()
;[sendCmcb, deleteReactionsCmcb, deleteCmcb, moveScb].forEach(cmd=> commands.set(cmd.name, cmd))

export const interactionCreateEvent = async (int: Interaction<CacheType>, client: Client) => {
  
  if(int.isChatInputCommand()){
    const { commandName } = int
    
    if(commandName == 'move') moveSlashCommand(int, client)
  }

  if(int.isContextMenuCommand()){
    const { commandType, commandName, user } = int
    
    if(commandType == ApplicationCommandType.Message){
      if(commandName == 'Send') sendCM(int, client)
      if(commandName == 'Delete reactions') deleteReactionsCM(int)
      if(commandName == 'Delete') deleteCM(int)
    }
  }
  
  if(int.isButton()){
    const { customId, guild, locale } = int, inEnglish = locale == 'en-US'

    if(customId == 'en-rules-btn') {
      const rules = await getRules(client, 'en')

      const RulesEb = new EmbedBuilder()
      .setTitle('📖 Rules')
      .setDescription(`${rules}`)
      .setColor(int.message.member?.displayHexColor || 'White')
      int.reply({ephemeral: true, embeds: [RulesEb]})
    }

    if(customId == 'en-roles-btn'){
      const RolesEb = new EmbedBuilder()
      .setTitle('🎭 Roles')
      .setDescription('Hello, here you can get the roles you want, some roles notify you about actions that are performed on the server while others are just for decoration like roles that change your color.\n\nTo get a role select the type of role you want get down in the drop down menu.')
      .setColor(int.message?.member?.displayHexColor || 'White')

      const RolesMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('roles-menu')
        .setPlaceholder('👉 Select a role type')
        .setOptions([
          {
            label: 'Notifications',
            emoji: '🔔',
            description: 'Roles that notify you about actions.',
            value: 'notifications'
          },
          {
            label: 'Colors',
            emoji: '🌈',
            description: 'Roles that change the color of your name.',
            value: 'colors'
          },
          {
            label: 'Genders',
            emoji: '👥',
            description: 'Roles that identify you with a gender.',
            value: 'genders'
          },
        ])
      )

      int.reply({ephemeral: true, embeds: [RolesEb], components: [RolesMenu]})
    }

    if(customId == 'en-girls-btn'){
      const GirlsEb = new EmbedBuilder()
      .setTitle(`<a:info_animate:1052698253394710599> Information`)
      .setDescription(`**Are you a woman and you sell your content?**, this is for you.\n\nYou can have a totally exclusive channel for you in this category, in the channel you can promote yourself, publish that you sell content and with it be able to use the mentions @everyone or @here the first mention notifies all members while the second only notifies members connected but these mentions can only be used once a week.\n\nTo obtain these benefits you have to be **18** years old or older and go through a verification, this consists of sending a photo of yourself with a piece of paper showing the name of the server *(you can write the name of the server wherever you want)*, once you pass the verification you will be given a unique role and the channel with the name of your choice.\n*Esta verificación es para comprobar que en realidad eres mujer y no un hombre haciéndose pasar por una.*\n\n*If you are satisfied with this and want to start with the verification or have questions, you can speak privately with one of the administrator who are <@853063286320922634>*`)
      .setColor(guild?.members.me?.displayHexColor || 'White')

      const VerifiedsBtn = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('verifieds-btn')
        .setLabel('Verifieds')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success)
      )

      int.reply({ephemeral: true, embeds: [GirlsEb], components: [VerifiedsBtn]})
    }

    if(customId == 'verifieds-btn'){
      const VerifiedsEb = new EmbedBuilder()
      .setTitle('✅ '+(inEnglish ? 'Verified women' : 'Mujeres verificadas'))
      .setDescription(`${guild?.members.cache.filter(f=> f.roles.cache.has('1057720387464593478')).map(({id})=> `**<@${id}>**`).join('\n')}`)
      .setColor('LuminousVividPink')

      int.reply({ephemeral: true, embeds: [VerifiedsEb]})
    }

    if(customId == 'en-info-btn'){
      const InfoEb = new EmbedBuilder()
      .setTitle('<a:animate_info:1058179015938158592> Information')
      .setDescription('Here you can get information about almost everything on the server, just select an option in the menu below and you will get information about that option.\n\n*In case you have read and still have doubts, you can consult <@853063286320922634> with any questions.*')
      .setColor(guild?.members.me?.displayHexColor || 'White')

      const InfoMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('info-menu')
        .setPlaceholder('👉 Select an option.')
        .setOptions([
          {
            emoji: '🥟',
            label: 'Server',
            value: 'server'
          },
          {
            emoji: '1058198792282841220',
            label: 'Channels',
            value: 'channels'
          },
          {
            emoji: '🎭',
            label: 'Roles',
            value: 'roles'
          },
          {
            emoji: '🤖',
            label: 'About me',
            value: 'about-me'
          },
        ])
      )

      int.reply({ephemeral: true, embeds: [InfoEb], components: [InfoMenu]})
    }
  }

  if(int.isStringSelectMenu()){
    const { customId, locale, values, guild, user } = int, inEnglish = locale == 'en-US'

    if(customId == 'roles-menu'){
      const option = values[0]

      if(option == 'notifications'){
        const members = int.guild?.members.cache
        const announcements = members?.filter(f=> f.roles.cache.has('1053391025906921472')).size
        const surveys = members?.filter(f=> f.roles.cache.has('1053410859700994128')).size
        const contents = members?.filter(f=> f.roles.cache.has('1053411182935023657')).size
        const verifieds = members?.filter(f=> f.roles.cache.has('1083060304054849676')).size

        const NotificationsEb = new EmbedBuilder()
        .setTitle('🔔 '+(inEnglish ? 'Notification roles' : 'Roles de notificación'))
        .setDescription(inEnglish ? 
        `> **<@&1053391025906921472>:**\n> This role will notify you when there is a new announcement.\n> **${announcements?.toLocaleString()}** members have the role.\n\n> **<@&1053410859700994128>:**\n> This role will notify you when there is a new survey.\n> **${surveys?.toLocaleString()}** members have the role.\n\n> **<@&1053411182935023657>:**\n> This role will notify you when there is new content.\n> **${contents?.toLocaleString()}** members have the role.\n\n> **<@&1083060304054849676>:**\n> This role will notify you when a verified woman talks on your channel.\n> **${verifieds?.toLocaleString()}** members have the role.` : 
        `> **<@&1053391025906921472>:**\n> Este rol te notificará cuando haya un nuevo anuncio.\n> **${announcements?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053410859700994128>:**\n> Este rol te notificará cuando haya una nueva encuesta.\n> **${surveys?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053411182935023657>:**\n> Este rol te notificará cuando haya contenido nuevo.\n> **${contents?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1083060304054849676>:**\n> Este rol te notificará cuando una mujer verificada hable en su canal.\n> **${verifieds?.toLocaleString()}** miembros tienen el rol.`)
        .setColor(int.guild?.members.me?.displayHexColor || 'White')

        const NotificationsMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
          .setCustomId('notifications-menu')
          .setMaxValues(3)
          .setPlaceholder(inEnglish ? '👉 Select the roles you want.' : '👉 Selecciona los roles que quieres.')
          .setOptions([
            {
              label: inEnglish ? 'Announcements' : 'Anuncios',
              emoji: '📢',
              value: 'announcements'
            },
            {
              label: inEnglish ? 'Surveys' : 'Encuestas',
              emoji: '📊',
              value: 'surveys'
            },
            {
              label: inEnglish ? 'Content' : 'Contenido',
              emoji: '🔞',
              value: 'content'
            },
            {
              label: inEnglish ? 'Verified speak' : 'Habla verificada',
              emoji: '🗣️',
              value: 'verified-speak'
            },
          ])
        )

        int.reply({ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu]})
      }

      if(option == 'colors'){
        const rolesIds = [
          '1053418871547248671',
          '1053418889649868800',
          '1053418924290621490',
          '1053419338029346817',
          '1053419357767745617',
          '1053419365820801044',
          '1053419380026908801',
          '1053419388625231952',
          '1053419392634994748',
          '1053419396179185685',
          '1053419401300430939',
          '1053419404924297277',
          '1053419409617735790',
        ]

        const ColorsEb = new EmbedBuilder()
        .setTitle('🔔 '+(inEnglish ? 'Color roles' : 'Roles de colores'))
        .setDescription((inEnglish ? 
        `These roles paint your name within the server, select one to change the color of your name.\n\n` : 
        `estos roles pintan tu nombre dentro del servidor, selecciona uno para cambiar el color de tu nombre.\n\n`)+rolesIds.map(m=> `**<@&${m}>**`).join('\n'))
        .setColor(int.guild?.members.me?.displayHexColor || 'White')

        const ColorsMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
          .setCustomId('colors-menu')
          .setPlaceholder(inEnglish ? '👉 Select a role.' : '👉 Selecciona un rol.')
          .setOptions([
            {
              label: inEnglish ? 'White' : 'Blanco',
              emoji: '🧻',
              value: 'white'
            },
            {
              label: inEnglish ? 'Gray' : 'Gris',
              emoji: '🐺',
              value: 'gray'
            },
            {
              label: inEnglish ? 'Yellow' : 'Amarillo',
              emoji: '🍌',
              value: 'yellow'
            },
            {
              label: inEnglish ? 'Cyan' : 'Cían',
              emoji: '🧼',
              value: 'cyan'
            },
            {
              label: inEnglish ? 'Green' : 'Verde',
              emoji: '🌳',
              value: 'green'
            },
            {
              label: inEnglish ? 'Orange' : 'Naranja',
              emoji: '🧡',
              value: 'orange'
            },
            {
              label: inEnglish ? 'Blue' : 'Azul',
              emoji: '💦',
              value: 'blue'
            },
            {
              label: inEnglish ? 'Red' : 'Rojo',
              emoji: '❤️',
              value: 'red'
            },
            {
              label: inEnglish ? 'Violet' : 'Violeta',
              emoji: '☂️',
              value: 'violet'
            },
            {
              label: inEnglish ? 'Purple' : 'Morado',
              emoji: '🍆',
              value: 'purple'
            },
            {
              label: inEnglish ? 'Pink' : 'Rosa',
              emoji: '🫦',
              value: 'pink'
            },
            {
              label: inEnglish ? 'Brown' : 'Marrón',
              emoji: '🍩',
              value: 'brown'
            },
            {
              label: inEnglish ? 'Black' : 'Negro',
              emoji: '♟️',
              value: 'black'
            },
          ])
        )

        int.reply({ephemeral: true, embeds: [ColorsEb], components: [ColorsMenu]})
      }

      if(option == 'genders'){
        const members = int.guild?.members.cache
        const women = members?.filter(f=> f.roles.cache.has('1058546950414278756')).size
        const mens = members?.filter(f=> f.roles.cache.has('1058546982014160947')).size
        const oter = members?.filter(f=> f.roles.cache.has('1058547126252093542')).size

        const NotificationsEb = new EmbedBuilder()
        .setTitle('👥 '+(inEnglish ? 'Gender roles' : 'Roles de género'))
        .setDescription(inEnglish ? 
          `> **<@&1058546950414278756>:**\n> This role identifies you as a woman.\n> **${women?.toLocaleString()}** members have the role.\n\n> **<@&1058546982014160947>:**\n> This role identifies you as a man.\n> **${mens?.toLocaleString()}** members have the role.\n\n> **<@&1058547126252093542>:**\n> Choose this role if there is no role that identifies you.\n> **${oter?.toLocaleString()}** members have the role.` : 
          `> **<@&1058546950414278756>:**\n> Este rol te identifica como mujer.\n> **${women?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1058546982014160947>:**\n> Este rol te identifica como hombre.\n> **${mens?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1058547126252093542>:**\n> Elige este rol si no hay ningun rol que te identifique.\n> **${oter?.toLocaleString()}** miembros tienen el rol.`)
        .setColor(int.guild?.members.me?.displayHexColor || 'White')

        const NotificationsMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
          .setCustomId('genders-menu')
          .setPlaceholder(inEnglish ? '👉 Select the roles you want.' : '👉 Selecciona los roles que quieres.')
          .setOptions([
            {
              label: inEnglish ? 'Woman' : 'Mujer',
              emoji: '👩',
              value: 'woman'
            },
            {
              label: inEnglish ? 'Man' : 'Hombre',
              emoji: '👨',
              value: 'man'
            },
            {
              label: inEnglish ? 'Oter' : 'Otro',
              emoji: '👤',
              value: 'oter'
            },
          ])
        )

        int.reply({ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu]})
      }
    }

    if(customId == 'notifications-menu'){
      const author = guild?.members.cache.get(user.id)
      const dictionary = [
        {
          value: 'announcements',
          rol: '1053391025906921472',
          status: ''
        },
        {
          value: 'surveys',
          rol: '1053410859700994128',
          status: ''
        },
        {
          value: 'content',
          rol: '1053411182935023657',
          status: ''
        },
        {
          value: 'verified-speak',
          rol: '1083060304054849676',
          status: ''
        }
      ]
      if(author) selectMultipleRoles(int, values, dictionary, author)
    }

    if(customId == 'colors-menu'){
      const author = guild?.members.cache.get(user.id)
      const dictionary = [
        {
          value: 'white',
          rol: '1053418871547248671',
          status: ''
        },
        {
          value: 'gray',
          rol: '1053418889649868800',
          status: ''
        },
        {
          value: 'yellow',
          rol: '1053418924290621490',
          status: ''
        },
        {
          value: 'cyan',
          rol: '1053419338029346817',
          status: ''
        },
        {
          value: 'green',
          rol: '1053419357767745617',
          status: ''
        },
        {
          value: 'orange',
          rol: '1053419365820801044',
          status: ''
        },
        {
          value: 'blue',
          rol: '1053419380026908801',
          status: ''
        },
        {
          value: 'red',
          rol: '1053419388625231952',
          status: ''
        },
        {
          value: 'violet',
          rol: '1053419392634994748',
          status: ''
        },
        {
          value: 'purple',
          rol: '1053419396179185685',
          status: ''
        },
        {
          value: 'pink',
          rol: '1053419401300430939',
          status: ''
        },
        {
          value: 'brown',
          rol: '1053419404924297277',
          status: ''
        },
        {
          value: 'black',
          rol: '1053419409617735790',
          status: ''
        }
      ]
      if(author) selectRole(int, values[0], dictionary, author)
    }

    if(customId == 'genders-menu'){
      const author = guild?.members.cache.get(user.id)
      const dictionary = [
        {
          value: 'woman',
          rol: '1058546950414278756',
          status: ''
        },
        {
          value: 'man',
          rol: '1058546982014160947',
          status: ''
        },
        {
          value: 'oter',
          rol: '1058547126252093542',
          status: ''
        }
      ]
      if(author) selectRole(int, values[0], dictionary, author)
    }

    if(customId == 'info-menu'){
      const [value] = values

      if(value == 'server'){
        const createdAt = Math.floor((guild?.createdAt.valueOf() || 0) /1000)
        const ServerEb = new EmbedBuilder()
        .setTitle('<a:discord:1058552953755160627> '+(inEnglish ? 'Server information' : 'Información del servidor'))
        .setDescription(inEnglish ? 
          `Server focused on female sexual content, created on <t:${createdAt}> by ${client.user} a bot that is managed by <@853063286320922634>, here you will find various channels with content of this type, you can also contribute content on the corresponding channels.\n\n*Thank you for being here!*` : 
          `Servidor enfocado en el contenido sexual femenino, creado el <t:${createdAt}> por ${client.user} un bot que es administrado por <@853063286320922634>, aquí encontraras diversos canales con contenido de ese tipo además podrás aportar contenido en los canales correspondientes.\n\n*¡Gracias por estar aquí!*`
        )
        .setColor(guild?.members.me?.displayHexColor || 'White')
      
        int.reply({ephemeral: true, embeds: [ServerEb]})
      }
      
      if(value == 'channels'){
        const ChannelsEb1 = new EmbedBuilder()
      }
      
      if(value == 'roles'){}

      if(value == 'about-me'){
        const AboutMeEb = new EmbedBuilder()
        .setTitle('🤖 '+(inEnglish ? `Hello i am ${client.user?.username}` : `Hola soy ${client.user?.username}`))
        .setDescription(inEnglish ?
          `The creator and owner of the server and I am a **bot** managed by my creator <@853063286320922634> who also manages the server.\n\n*I am not programmed to answer private messages, I just help automate some tasks within the server*` :
          `El creador y dueño del servidor y soy un **bot** administrado por mi creador <@853063286320922634> quien también administra el servidor.\n\n*No estoy programado para contestar mensajes privados, solo ayudo a automatizar algunas tareas dentro del servidor*`  
        )
        .setColor('Green')

        int.reply({ephemeral: true, embeds: [AboutMeEb]})
      }
    }
  }
}