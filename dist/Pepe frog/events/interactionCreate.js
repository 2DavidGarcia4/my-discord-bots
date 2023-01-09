"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionCreateEvent = exports.commands = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../utils/functions");
const move_1 = require("../commands/slash/move");
const send_1 = require("../commands/contextMenu/send");
const deleteReactions_1 = require("../commands/contextMenu/deleteReactions");
const delete_1 = require("../commands/contextMenu/delete");
exports.commands = new discord_js_1.Collection();
[send_1.sendCmcb, deleteReactions_1.deleteReactionsCmcb, delete_1.deleteCmcb, move_1.moveScb].forEach(cmd => exports.commands.set(cmd.name, cmd));
const interactionCreateEvent = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (int.isChatInputCommand()) {
        const { commandName } = int;
        if (commandName == 'move')
            (0, move_1.moveSlashCommand)(int, client);
    }
    if (int.isContextMenuCommand()) {
        const { commandType, commandName, user } = int;
        if (commandType == discord_js_1.ApplicationCommandType.Message) {
            if (commandName == 'Send')
                (0, send_1.sendCM)(int, client);
            if (commandName == 'Delete reactions')
                (0, deleteReactions_1.deleteReactionsCM)(int);
            if (commandName == 'Delete')
                (0, delete_1.deleteCM)(int);
        }
    }
    if (int.isButton()) {
        const { customId, guild, locale } = int, inEnglish = locale == 'en-US';
        if (customId == 'en-rules-btn') {
            const RulesEb = new discord_js_1.EmbedBuilder()
                .setTitle('📖 Rules')
                .setDescription(`> **1.** Mutual respect, treat others with respect. Harassment, witch hunts, sexism, racism, or hate speech will not be tolerated.\n\n> **2.** Do not encourage others to do malicious practices such as raiding, scam among others.\n\n> 3. No spamming or self-promotion (server invites, advertisements, etc.) without permission from a staff member. This also includes DMing other members.\n\n> **4.** No fotopollas, please do not send photos of your penis is prohibited at the moment since this server is a server focused on female sexual content.\n\n> **5.** The sexual content of minors is not allowed, in case of publishing content of this type you will be banned from the server.\n\n> **6.** If you see something that is against the rules or that doesn't make you feel safe, please let the staff know. We want this server to be a welcoming place!`)
                .setColor(((_a = int.message.member) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White');
            int.reply({ ephemeral: true, embeds: [RulesEb] });
        }
        if (customId == 'en-roles-btn') {
            const RolesEb = new discord_js_1.EmbedBuilder()
                .setTitle('🎭 Roles')
                .setDescription('Hello, here you can get the roles you want, some roles notify you about actions that are performed on the server while others are just for decoration like roles that change your color.\n\nTo get a role select the type of role you want get down in the drop down menu.')
                .setColor(((_c = (_b = int.message) === null || _b === void 0 ? void 0 : _b.member) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White');
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
        if (customId == 'en-girls-btn') {
            const GirlsEb = new discord_js_1.EmbedBuilder()
                .setTitle(`<a:info_animate:1052698253394710599> Information`)
                .setDescription(`**Are you a woman and you sell your content?**, this is for you.\n\nYou can have a totally exclusive channel for you in this category, in the channel you can promote yourself, publish that you sell content and with it be able to use the mentions @everyone or @here the first mention notifies all members while the second only notifies members connected but these mentions can only be used once a week.\n\nTo obtain these benefits you have to be **18** years old or older and go through a verification, this consists of sending a photo of yourself with a piece of paper showing the name of the server *(you can write the name of the server wherever you want)*, once you pass the verification you will be given a unique role and the channel with the name of your choice.\n*Esta verificación es para comprobar que en realidad eres mujer y no un hombre haciéndose pasar por una.*\n\n*If you are satisfied with this and want to start with the verification or have questions, you can speak privately with one of the administrator who are <@853063286320922634>*`)
                .setColor(((_d = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White');
            const VerifiedsBtn = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId('verifieds-btn')
                .setLabel('Verifieds')
                .setEmoji('✅')
                .setStyle(discord_js_1.ButtonStyle.Success));
            int.reply({ ephemeral: true, embeds: [GirlsEb], components: [VerifiedsBtn] });
        }
        if (customId == 'verifieds-btn') {
            const VerifiedsEb = new discord_js_1.EmbedBuilder()
                .setTitle('✅ ' + (inEnglish ? 'Verified women' : 'Mujeres verificadas'))
                .setDescription(`${guild === null || guild === void 0 ? void 0 : guild.members.cache.filter(f => f.roles.cache.has('1057720387464593478')).map(({ id }) => `**<@${id}>**`).join('\n')}`)
                .setColor('LuminousVividPink');
            int.reply({ ephemeral: true, embeds: [VerifiedsEb] });
        }
        if (customId == 'en-info-btn') {
            const InfoEb = new discord_js_1.EmbedBuilder()
                .setTitle('<a:animate_info:1058179015938158592> Information')
                .setDescription('Here you can get information about almost everything on the server, just select an option in the menu below and you will get information about that option.\n\n*In case you have read and still have doubts, you can consult <@853063286320922634> with any questions.*')
                .setColor(((_e = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _e === void 0 ? void 0 : _e.displayHexColor) || 'White');
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
                const members = (_f = int.guild) === null || _f === void 0 ? void 0 : _f.members.cache;
                const announcements = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053391025906921472')).size;
                const surveys = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053410859700994128')).size;
                const contents = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053411182935023657')).size;
                const NotificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Notification roles' : 'Roles de notificación'))
                    .setDescription(inEnglish ?
                    `> **<@&1053391025906921472>:**\n> This role will notify you when there is a new announcement.\n> **${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** members have the role.\n\n> **<@&1053410859700994128>:**\n> This role will notify you when there is a new survey.\n> **${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** members have the role.\n\n> **<@&1053411182935023657>:**\n> This role will notify you when there is new content.\n> **${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** members have the role.` :
                    `> **<@&1053391025906921472>:**\n> Este rol te notificará cuando haya un nuevo anuncio.\n> **${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053410859700994128>:**\n> Este rol te notificará cuando haya una nueva encuesta.\n> **${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053411182935023657>:**\n> Este rol te notificará cuando haya contenido nuevo.\n> **${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(((_h = (_g = int.guild) === null || _g === void 0 ? void 0 : _g.members.me) === null || _h === void 0 ? void 0 : _h.displayHexColor) || 'White');
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
                ]));
                int.reply({ ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu] });
            }
            if (option == 'colors') {
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
                ];
                const ColorsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Color roles' : 'Roles de colores'))
                    .setDescription((inEnglish ?
                    `These roles paint your name within the server, select one to change the color of your name.\n\n` :
                    `estos roles pintan tu nombre dentro del servidor, selecciona uno para cambiar el color de tu nombre.\n\n`) + rolesIds.map(m => `**<@&${m}>**`).join('\n'))
                    .setColor(((_k = (_j = int.guild) === null || _j === void 0 ? void 0 : _j.members.me) === null || _k === void 0 ? void 0 : _k.displayHexColor) || 'White');
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
                ]));
                int.reply({ ephemeral: true, embeds: [ColorsEb], components: [ColorsMenu] });
            }
            if (option == 'genders') {
                const members = (_l = int.guild) === null || _l === void 0 ? void 0 : _l.members.cache;
                const women = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1058546950414278756')).size;
                const mens = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1058546982014160947')).size;
                const oter = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1058547126252093542')).size;
                const NotificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('👥 ' + (inEnglish ? 'Gender roles' : 'Roles de género'))
                    .setDescription(inEnglish ?
                    `> **<@&1058546950414278756>:**\n> This role identifies you as a woman.\n> **${women === null || women === void 0 ? void 0 : women.toLocaleString()}** members have the role.\n\n> **<@&1058546982014160947>:**\n> This role identifies you as a man.\n> **${mens === null || mens === void 0 ? void 0 : mens.toLocaleString()}** members have the role.\n\n> **<@&1058547126252093542>:**\n> Choose this role if there is no role that identifies you.\n> **${oter === null || oter === void 0 ? void 0 : oter.toLocaleString()}** members have the role.` :
                    `> **<@&1058546950414278756>:**\n> Este rol te identifica como mujer.\n> **${women === null || women === void 0 ? void 0 : women.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1058546982014160947>:**\n> Este rol te identifica como hombre.\n> **${mens === null || mens === void 0 ? void 0 : mens.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1058547126252093542>:**\n> Elige este rol si no hay ningun rol que te identifique.\n> **${oter === null || oter === void 0 ? void 0 : oter.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(((_o = (_m = int.guild) === null || _m === void 0 ? void 0 : _m.members.me) === null || _o === void 0 ? void 0 : _o.displayHexColor) || 'White');
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
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
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
                }
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == 'colors-menu') {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
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
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == 'genders-menu') {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
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
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == 'info-menu') {
            const [value] = values;
            if (value == 'server') {
                const createdAt = Math.floor(((guild === null || guild === void 0 ? void 0 : guild.createdAt.valueOf()) || 0) / 1000);
                const ServerEb = new discord_js_1.EmbedBuilder()
                    .setTitle('<a:discord:1058552953755160627> ' + (inEnglish ? 'Server information' : 'Información del servidor'))
                    .setDescription(inEnglish ?
                    `Server focused on female sexual content, created on <t:${createdAt}> by ${client.user} a bot that is managed by <@853063286320922634>, here you will find various channels with content of this type, you can also contribute content on the corresponding channels.\n\n*Thank you for being here!*` :
                    `Servidor enfocado en el contenido sexual femenino, creado el <t:${createdAt}> por ${client.user} un bot que es administrado por <@853063286320922634>, aquí encontraras diversos canales con contenido de ese tipo además podrás aportar contenido en los canales correspondientes.\n\n*¡Gracias por estar aquí!*`)
                    .setColor(((_p = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _p === void 0 ? void 0 : _p.displayHexColor) || 'White');
                int.reply({ ephemeral: true, embeds: [ServerEb] });
            }
            if (value == 'channels') {
                const ChannelsEb1 = new discord_js_1.EmbedBuilder();
            }
            if (value == 'roles') { }
            if (value == 'about-me') {
                const AboutMeEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🤖 ' + (inEnglish ? `Hello i am ${(_q = client.user) === null || _q === void 0 ? void 0 : _q.username}` : `Hola soy ${(_r = client.user) === null || _r === void 0 ? void 0 : _r.username}`))
                    .setDescription(inEnglish ?
                    `The creator and owner of the server and I am a **bot** managed by my creator <@853063286320922634> who also manages the server.\n\n*I am not programmed to answer private messages, I just help automate some tasks within the server*` :
                    `El creador y dueño del servidor y soy un **bot** administrado por mi creador <@853063286320922634> quien también administra el servidor.\n\n*No estoy programado para contestar mensajes privados, solo ayudo a automatizar algunas tareas dentro del servidor*`)
                    .setColor('Green');
                int.reply({ ephemeral: true, embeds: [AboutMeEb] });
            }
        }
    }
});
exports.interactionCreateEvent = interactionCreateEvent;
