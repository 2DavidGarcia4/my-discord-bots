import { ActionRowBuilder, CacheType, Client, EmbedBuilder, Interaction, SelectMenuBuilder } from "discord.js";

export const interactionCreateEvent = async (int: Interaction<CacheType>, client: Client) => {
  if(int.isButton()){
    const { customId } = int

    if(customId == 'en-rules-btn') {
      const RulesEb = new EmbedBuilder()
      .setTitle('📖 Rules')
      .setDescription(`> **1.** Mutual respect, treat others with respect. Harassment, witch hunts, sexism, racism, or hate speech will not be tolerated.\n\n> **2.** Do not encourage others to do malicious practices such as raiding, scam among others.\n\n> 3. No spamming or self-promotion (server invites, advertisements, etc.) without permission from a staff member. This also includes DMing other members.\n\n> **4.** No fotopollas, please do not send photos of your penis is prohibited at the moment since this server is a server focused on female sexual content.\n\n> **5.** If you see something that is against the rules or that doesn't make you feel safe, please let the staff know. We want this server to be a welcoming place!`)
      .setColor(int.message.member?.displayHexColor || 'White')
      int.reply({ephemeral: true, embeds: [RulesEb]})
    }

    if(customId == 'en-roles-btn'){
      const RolesEb = new EmbedBuilder()
      .setTitle('🌈 Roles')
      .setDescription('Hello, here you can get the roles you want, some roles notify you about actions that are performed on the server while others are just for decoration like roles that change your color.\n\nTo get a role select the type of role you want get down in the drop down menu.')
      .setColor(int.message?.member?.displayHexColor || 'White')

      const RolesMenu = new ActionRowBuilder<SelectMenuBuilder>()
      .addComponents(
        new SelectMenuBuilder()
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
        ])
      )

      int.reply({ephemeral: true, embeds: [RolesEb], components: [RolesMenu]})
    }
  }

  if(int.isSelectMenu()){
    const { customId, locale, values } = int, inEnglish = locale == 'en-US'
    console.log(locale)

    if(customId == 'roles-menu'){
      console.log('roles')
      const option = values[0]

      if(option == 'notifications'){
        const members = int.guild?.members.cache
        const announcements = members?.filter(f=> f.roles.cache.has('1038137927080882318')).size
        const surveys = members?.filter(f=> f.roles.cache.has('1038138022341906433')).size
        const contents = members?.filter(f=> f.roles.cache.has('1038138996351578154')).size

        const NotificationsEb = new EmbedBuilder()
        .setTitle('🔔 '+(inEnglish ? 'Notification roles' : 'Roles de notificación'))
        .setDescription(inEnglish ? 
        `> **<@&1038137927080882318>:**\nThis role will notify you when there is a new announcement.\n**${announcements?.toLocaleString()}** members have the role.\n\n> **<@&1038138022341906433>:**\nThis role will notify you when there is a new survey.\n**${surveys?.toLocaleString()}** members have the role.\n\n> **<@&1038138996351578154>:**\nThis role will notify you when there is new content.\n**${contents?.toLocaleString()}** members have the role.` : 
        `> **<@&1038137927080882318>:**\nEste rol te notificará cuando haya un nuevo anuncio.\n**${announcements?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138022341906433>:**\nEste rol te notificará cuando haya una nueva encuesta.\n**${surveys?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138996351578154>:**\nEste rol te notificará cuando haya contenido nuevo.\n**${contents?.toLocaleString()}** miembros tienen el rol.`)
        .setColor(int.guild?.members.me?.displayHexColor || 'White')

        const NotificationsMenu = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
          new SelectMenuBuilder()
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
              value: 'contents'
            },
          ])
        )

        int.reply({ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu]})
      }

      if(option == 'colors'){
        const members = int.guild?.members.cache
        const announcements = members?.filter(f=> f.roles.cache.has('1038137927080882318')).size
        const surveys = members?.filter(f=> f.roles.cache.has('1038138022341906433')).size
        const contents = members?.filter(f=> f.roles.cache.has('1038138996351578154')).size

        const ColorsEb = new EmbedBuilder()
        .setTitle('🔔 '+(inEnglish ? 'Color roles' : 'Roles de colores'))
        .setDescription(inEnglish ? 
        `> **<@&1038137927080882318>:**\nThis role will notify you when there is a new announcement.\n**${announcements?.toLocaleString()}** members have the role.\n\n> **<@&1038138022341906433>:**\nThis role will notify you when there is a new survey.\n**${surveys?.toLocaleString()}** members have the role.\n\n> **<@&1038138996351578154>:**\nThis role will notify you when there is new content.\n**${contents?.toLocaleString()}** members have the role.` : 
        `> **<@&1038137927080882318>:**\nEste rol te notificará cuando haya un nuevo anuncio.\n**${announcements?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138022341906433>:**\nEste rol te notificará cuando haya una nueva encuesta.\n**${surveys?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138996351578154>:**\nEste rol te notificará cuando haya contenido nuevo.\n**${contents?.toLocaleString()}** miembros tienen el rol.`)
        .setColor(int.guild?.members.me?.displayHexColor || 'White')

        const ColorsMenu = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
          new SelectMenuBuilder()
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
              value: 'contents'
            },
          ])
        )

        int.reply({ephemeral: true, embeds: [ColorsEb], components: [ColorsMenu]})
      }
    }
  }
}