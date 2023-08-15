"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const functions_1 = require("../../shared/functions");
const services_1 = require("../lib/services");
const notion_1 = require("../lib/notion");
exports.name = 'interactionCreate';
async function execute(int, client) {
    const { roles } = await (0, notion_1.getSnackData)();
    if (int.isChatInputCommand()) {
        const { commandName } = int;
        const slashCommand = client.slashCommands.find(f => f.struct.name == commandName);
        if (slashCommand)
            return slashCommand.execute(int, client);
    }
    if (int.isContextMenuCommand()) {
        const { commandType, commandName, user } = int;
        const constexCommand = client.contextCommands.find(f => f.struct.name == commandName);
        if (constexCommand)
            return constexCommand.execute(int, client);
    }
    if (int.isButton()) {
        const { customId, guild, locale, user } = int, inEnglish = locale == 'en-US';
        const author = int.guild?.members.cache.get(user.id);
        const translatedInformationMessageData = db_1.buttonInfoInteractions.find(f => f.id == customId);
        if (translatedInformationMessageData)
            await translatedInformationMessageData.run(int, client);
        if (customId == 'en-roles-btn') {
            const RolesEb = new discord_js_1.EmbedBuilder()
                .setTitle('🎭 Roles')
                .setDescription('Hello, here you can get the roles you want, some roles notify you about actions that are performed on the server while others are just for decoration like roles that change your color.\n\nTo get a role select the type of role you want get down in the drop down menu.')
                .setColor(int.message?.member?.displayHexColor || 'White');
            const RolesMenu = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
            ]));
            int.reply({ ephemeral: true, embeds: [RolesEb], components: [RolesMenu] });
        }
        if (customId == 'verifieds-btn') {
            const VerifiedsEb = new discord_js_1.EmbedBuilder()
                .setTitle('✅ ' + (inEnglish ? 'Verified women' : 'Mujeres verificadas'))
                .setDescription(`${guild?.members.cache.filter(f => f.roles.cache.has(roles.verified)).map(({ id }) => `**<@${id}>**`).join('\n')}`)
                .setColor('LuminousVividPink');
            int.reply({ ephemeral: true, embeds: [VerifiedsEb] });
        }
        const previwChannels = [
            {
                id: 'vip-btn',
                accessRoles: ['1139581587848188064', '1139581616499470386'],
                previewRol: '1139702331756261386',
                run: services_1.handlePreviewChannels
            }
        ].find(f => f.id == customId);
        previwChannels?.run(int);
        if (customId == 'en-info-btn') {
            const InfoEb = new discord_js_1.EmbedBuilder()
                .setTitle('<a:animate_info:1058179015938158592> Information')
                .setDescription('Here you can get information about almost everything on the server, just select an option in the menu below and you will get information about that option.\n\n*In case you have read and still have doubts, you can consult <@853063286320922634> with any questions.*')
                .setColor(guild?.members.me?.displayHexColor || 'White');
            const InfoMenu = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
            ]));
            int.reply({ ephemeral: true, embeds: [InfoEb], components: [InfoMenu] });
        }
    }
    if (int.isStringSelectMenu()) {
        const { customId, locale, values, guild, user } = int, inEnglish = locale == 'en-US';
        if (customId == 'roles-menu') {
            const option = values[0];
            if (option == 'notifications') {
                const members = int.guild?.members.cache;
                const announcements = members?.filter(f => f.roles.cache.has(roles.announcement)).size;
                const surveys = members?.filter(f => f.roles.cache.has(roles.survey)).size;
                const contents = members?.filter(f => f.roles.cache.has(roles.content)).size;
                const verifieds = members?.filter(f => f.roles.cache.has(roles.verifiedSpeech)).size;
                const NotificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Notification roles' : 'Roles de notificación'))
                    .setDescription(inEnglish ?
                    `> **<@&${roles.announcement}>:**\n> This role will notify you when there is a new announcement.\n> **${announcements?.toLocaleString()}** members have the role.\n\n> **<@&${roles.survey}>:**\n> This role will notify you when there is a new survey.\n> **${surveys?.toLocaleString()}** members have the role.\n\n> **<@&${roles.content}>:**\n> This role will notify you when there is new content.\n> **${contents?.toLocaleString()}** members have the role.\n\n> **<@&${roles.verifiedSpeech}>:**\n> This role will notify you when a verified woman talks on your channel.\n> **${verifieds?.toLocaleString()}** members have the role.` :
                    `> **<@&${roles.announcement}>:**\n> Este rol te notificará cuando haya un nuevo anuncio.\n> **${announcements?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&${roles.survey}>:**\n> Este rol te notificará cuando haya una nueva encuesta.\n> **${surveys?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&${roles.content}>:**\n> Este rol te notificará cuando haya contenido nuevo.\n> **${contents?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&${roles.verifiedSpeech}>:**\n> Este rol te notificará cuando una mujer verificada hable en su canal.\n> **${verifieds?.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(int.guild?.members.me?.displayHexColor || 'White');
                const NotificationsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                ]));
                int.reply({ ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu] });
            }
            if (option == 'colors') {
                const witheColor = guild?.roles.cache.get(roles.withe);
                const colorRoles = guild?.roles.cache.filter(f => f.position <= (witheColor?.position || 0) && f.position > (witheColor?.position ? witheColor.position - 25 : 0));
                if (!colorRoles)
                    return;
                const rolesIds = colorRoles.sort((a, b) => b.position - a.position).map(m => `**<@&${m.id}>**`);
                const ColorsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Color roles' : 'Roles de colores'))
                    .setDescription((inEnglish ?
                    `These roles paint your name within the server, select one to change the color of your name.\n\n` :
                    `estos roles pintan tu nombre dentro del servidor, selecciona uno para cambiar el color de tu nombre.`))
                    .setFields({
                    name: '\u200B',
                    value: rolesIds.slice(0, 9).join('\n'),
                    inline: true
                }, {
                    name: '\u200B',
                    value: rolesIds.slice(9, 18).join('\n'),
                    inline: true
                }, {
                    name: '\u200B',
                    value: rolesIds.slice(18, 27).join('\n'),
                    inline: true
                })
                    .setColor(int.guild?.members.me?.displayHexColor || 'White');
                const ColorsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId('colors-menu')
                    .setPlaceholder(inEnglish ? '👉 Select a role.' : '👉 Selecciona un rol.')
                    .setOptions([
                    {
                        label: inEnglish ? 'White' : 'Blanco',
                        emoji: '🧻',
                        value: 'white'
                    },
                    {
                        label: inEnglish ? 'Light grey' : 'Gris claro',
                        emoji: '🏐',
                        value: 'light grey'
                    },
                    {
                        label: inEnglish ? 'Beige' : 'Beige',
                        emoji: '🍞',
                        value: 'beige'
                    },
                    {
                        label: inEnglish ? 'Light blue' : 'Azul celeste',
                        emoji: '🫧',
                        value: 'light blue'
                    },
                    {
                        label: inEnglish ? 'Turquoise' : 'Turquesa',
                        emoji: '🧼',
                        value: 'turquoise'
                    },
                    {
                        label: inEnglish ? 'Cyan' : 'Cían',
                        emoji: '🐬',
                        value: 'cyan'
                    },
                    {
                        label: inEnglish ? 'Blue' : 'Azul',
                        emoji: '💦',
                        value: 'blue'
                    },
                    {
                        label: inEnglish ? 'Navy blue' : 'Azul marino',
                        emoji: '🌊',
                        value: 'navy blue'
                    },
                    {
                        label: inEnglish ? 'Green lime' : 'Verde lima',
                        emoji: '🍃',
                        value: 'green lime'
                    },
                    {
                        label: inEnglish ? 'Green' : 'Verde',
                        emoji: '🌳',
                        value: 'green'
                    },
                    {
                        label: inEnglish ? 'Olive green' : 'Verde oliva',
                        emoji: '🫒',
                        value: 'olive green'
                    },
                    {
                        label: inEnglish ? 'Yellow' : 'Amarillo',
                        emoji: '🍌',
                        value: 'yellow'
                    },
                    {
                        label: inEnglish ? 'Gold' : 'Oro',
                        emoji: '🏆',
                        value: 'gold'
                    },
                    {
                        label: inEnglish ? 'Orange' : 'Naranja',
                        emoji: '🧡',
                        value: 'orange'
                    },
                    {
                        label: inEnglish ? 'Bronze' : 'Bronce',
                        emoji: '🥉',
                        value: 'bronze'
                    },
                    {
                        label: inEnglish ? 'Brown' : 'Marrón',
                        emoji: '🍩',
                        value: 'brown'
                    },
                    {
                        label: inEnglish ? 'Red' : 'Rojo',
                        emoji: '❤️',
                        value: 'red'
                    },
                    {
                        label: inEnglish ? 'Pink' : 'Rosa',
                        emoji: '🫦',
                        value: 'pink'
                    },
                    {
                        label: inEnglish ? 'Violet' : 'Violeta',
                        emoji: '☂️',
                        value: 'violet'
                    },
                    {
                        label: inEnglish ? 'Magenta' : 'Magenta',
                        emoji: '🌺',
                        value: 'magenta'
                    },
                    {
                        label: inEnglish ? 'Purple' : 'Morado',
                        emoji: '🍆',
                        value: 'purple'
                    },
                    {
                        label: inEnglish ? 'Silver' : 'Plata',
                        emoji: '🥈',
                        value: 'silver'
                    },
                    {
                        label: inEnglish ? 'Gray' : 'Gris',
                        emoji: '🐺',
                        value: 'gray'
                    },
                    {
                        label: inEnglish ? 'Dark gray' : 'Gris oscuro',
                        emoji: '🪨',
                        value: 'dark gray'
                    },
                    {
                        label: inEnglish ? 'Black' : 'Negro',
                        emoji: '♟️',
                        value: 'black'
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [ColorsEb], components: [ColorsMenu] });
            }
            if (option == 'genders') {
                const members = int.guild?.members.cache;
                const women = members?.filter(f => f.roles.cache.has(roles.woman)).size;
                const mens = members?.filter(f => f.roles.cache.has(roles.man)).size;
                const oter = members?.filter(f => f.roles.cache.has(roles.oter)).size;
                const NotificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('👥 ' + (inEnglish ? 'Gender roles' : 'Roles de género'))
                    .setDescription(inEnglish ?
                    `> **<@&${roles.woman}>:**\n> This role identifies you as a woman.\n> **${women?.toLocaleString()}** members have the role.\n\n> **<@&${roles.man}>:**\n> This role identifies you as a man.\n> **${mens?.toLocaleString()}** members have the role.\n\n> **<@&${roles.oter}>:**\n> Choose this role if there is no role that identifies you.\n> **${oter?.toLocaleString()}** members have the role.` :
                    `> **<@&${roles.woman}>:**\n> Este rol te identifica como mujer.\n> **${women?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&${roles.man}>:**\n> Este rol te identifica como hombre.\n> **${mens?.toLocaleString()}** miembros tienen el rol.\n\n> **<@&${roles.oter}>:**\n> Elige este rol si no hay ningun rol que te identifique.\n> **${oter?.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(int.guild?.members.me?.displayHexColor || 'White');
                const NotificationsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                ]));
                int.reply({ ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu] });
            }
        }
        if (customId == 'notifications-menu') {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'announcements',
                    rol: roles.announcement,
                    status: ''
                },
                {
                    value: 'surveys',
                    rol: roles.survey,
                    status: ''
                },
                {
                    value: 'content',
                    rol: roles.content,
                    status: ''
                },
                {
                    value: 'verified-speak',
                    rol: roles.verifiedSpeech,
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == 'colors-menu') {
            const witheColor = guild?.roles.cache.get(roles.withe);
            const colorRoles = guild?.roles.cache.filter(f => f.position <= (witheColor?.position || 0) && f.position > (witheColor?.position ? witheColor.position - 25 : 0)).sort((a, b) => b.position - a.position).map(c => c);
            if (!colorRoles)
                return;
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                { value: 'white' },
                { value: 'light grey' },
                { value: 'beige' },
                { value: 'light blue' },
                { value: 'turquoise' },
                { value: 'cyan' },
                { value: 'blue' },
                { value: 'navy blue' },
                { value: 'green lime' },
                { value: 'green' },
                { value: 'olive green' },
                { value: 'yellow' },
                { value: 'gold' },
                { value: 'orange' },
                { value: 'bronze' },
                { value: 'brown' },
                { value: 'red' },
                { value: 'pink' },
                { value: 'violet' },
                { value: 'magenta' },
                { value: 'purple' },
                { value: 'silver' },
                { value: 'gray' },
                { value: 'dark gray' },
                { value: 'black' }
            ].map(({ value }, i) => ({ value, rol: colorRoles[i].id, status: '' }));
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == 'genders-menu') {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'woman',
                    rol: roles.woman,
                    status: ''
                },
                {
                    value: 'man',
                    rol: roles.man,
                    status: ''
                },
                {
                    value: 'oter',
                    rol: roles.oter,
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == 'info-menu') {
            const [value] = values;
            if (value == 'server') {
                const createdAt = Math.floor((guild?.createdAt.valueOf() || 0) / 1000);
                const ServerEb = new discord_js_1.EmbedBuilder()
                    .setTitle('<a:discord:1058552953755160627> ' + (inEnglish ? 'Server information' : 'Información del servidor'))
                    .setDescription(inEnglish ?
                    `Server focused on female sexual content, created on <t:${createdAt}> by ${client.user} a bot that is managed by <@853063286320922634>, here you will find various channels with content of this type, you can also contribute content on the corresponding channels.\n\n*Thank you for being here!*` :
                    `Servidor enfocado en el contenido sexual femenino, creado el <t:${createdAt}> por ${client.user} un bot que es administrado por <@853063286320922634>, aquí encontraras diversos canales con contenido de ese tipo además podrás aportar contenido en los canales correspondientes.\n\n*¡Gracias por estar aquí!*`)
                    .setColor(guild?.members.me?.displayHexColor || 'White');
                int.reply({ ephemeral: true, embeds: [ServerEb] });
            }
            if (value == 'channels') {
                const ChannelsEb1 = new discord_js_1.EmbedBuilder();
            }
            if (value == 'roles') { }
            if (value == 'about-me') {
                const AboutMeEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🤖 ' + (inEnglish ? `Hello i am ${client.user?.username}` : `Hola soy ${client.user?.username}`))
                    .setDescription(inEnglish ?
                    `The creator and owner of the server and I am a **bot** managed by my creator <@853063286320922634> who also manages the server.\n\n*I am not programmed to answer private messages, I just help automate some tasks within the server*` :
                    `El creador y dueño del servidor y soy un **bot** administrado por mi creador <@853063286320922634> quien también administra el servidor.\n\n*No estoy programado para contestar mensajes privados, solo ayudo a automatizar algunas tareas dentro del servidor*`)
                    .setColor('Green');
                int.reply({ ephemeral: true, embeds: [AboutMeEb] });
            }
        }
    }
}
exports.execute = execute;
