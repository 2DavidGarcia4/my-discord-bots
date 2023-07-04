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
exports.interactionCreateEvent = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const db_1 = require("../db");
const functions_1 = require("../../shared/functions");
const functions_2 = require("../utils/functions");
const commands_1 = require("../commands");
const commands_2 = require("../commands");
function interactionCreateEvent(int) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __awaiter(this, void 0, void 0, function* () {
        if (int.isChatInputCommand()) {
            const { commandName } = int;
            const slashCommand = commands_1.SlashCommands.find(f => f.Command.name == commandName);
            if (slashCommand)
                slashCommand.run(int, __1.Frog);
            // if(commandName == 'move') moveSlashCommand(int, client)
        }
        if (int.isContextMenuCommand()) {
            const { commandType, commandName, user } = int;
            if (commandType == discord_js_1.ApplicationCommandType.Message) {
                const cmCommand = commands_2.ContextMenuCommands.find(f => f.Command.name == commandName);
                if (cmCommand)
                    cmCommand.run(int, __1.Frog);
                // if(commandName == 'Send') sendCM(int, client)
                // if(commandName == 'Delete reactions') deleteReactionsCM(int)
                // if(commandName == 'Delete') deleteCM(int)
            }
        }
        if (int.isButton()) {
            const { customId, guild, locale, user } = int, inEnglish = locale == 'en-US';
            const author = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(user.id);
            const translatedInformationMessageData = db_1.buttonInfoInteractions.find(f => f.id == customId);
            if (translatedInformationMessageData)
                yield translatedInformationMessageData.run(int, __1.Frog);
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
            if (customId == 'verifieds-btn') {
                const VerifiedsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('✅ ' + (inEnglish ? 'Verified women' : 'Mujeres verificadas'))
                    .setDescription(`${guild === null || guild === void 0 ? void 0 : guild.members.cache.filter(f => f.roles.cache.has('1057720387464593478')).map(({ id }) => `**<@${id}>**`).join('\n')}`)
                    .setColor('LuminousVividPink');
                int.reply({ ephemeral: true, embeds: [VerifiedsEb] });
            }
            const previwChannels = [
                {
                    id: 'vip-btn',
                    accessRoles: ['1054484428547686521', '1067223243183902730'],
                    previewRol: '1054109326014418964',
                    run: functions_2.handlePreviewChannels
                },
                {
                    id: 'packs-btn',
                    accessRoles: ['1054484428547686521', '1121140017058812084'],
                    previewRol: '1101370257802801234',
                    run: functions_2.handlePreviewChannels
                }
            ].find(f => f.id == customId);
            previwChannels === null || previwChannels === void 0 ? void 0 : previwChannels.run(int);
            if (customId == 'en-info-btn') {
                const InfoEb = new discord_js_1.EmbedBuilder()
                    .setTitle('<a:animate_info:1058179015938158592> Information')
                    .setDescription('Here you can get information about almost everything on the server, just select an option in the menu below and you will get information about that option.\n\n*In case you have read and still have doubts, you can consult <@853063286320922634> with any questions.*')
                    .setColor(((_d = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White');
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
                    const members = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.cache;
                    const announcements = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053391025906921472')).size;
                    const surveys = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053410859700994128')).size;
                    const contents = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053411182935023657')).size;
                    const verifieds = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1083060304054849676')).size;
                    const NotificationsEb = new discord_js_1.EmbedBuilder()
                        .setTitle('🔔 ' + (inEnglish ? 'Notification roles' : 'Roles de notificación'))
                        .setDescription(inEnglish ?
                        `> **<@&1053391025906921472>:**\n> This role will notify you when there is a new announcement.\n> **${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** members have the role.\n\n> **<@&1053410859700994128>:**\n> This role will notify you when there is a new survey.\n> **${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** members have the role.\n\n> **<@&1053411182935023657>:**\n> This role will notify you when there is new content.\n> **${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** members have the role.\n\n> **<@&1083060304054849676>:**\n> This role will notify you when a verified woman talks on your channel.\n> **${verifieds === null || verifieds === void 0 ? void 0 : verifieds.toLocaleString()}** members have the role.` :
                        `> **<@&1053391025906921472>:**\n> Este rol te notificará cuando haya un nuevo anuncio.\n> **${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053410859700994128>:**\n> Este rol te notificará cuando haya una nueva encuesta.\n> **${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053411182935023657>:**\n> Este rol te notificará cuando haya contenido nuevo.\n> **${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1083060304054849676>:**\n> Este rol te notificará cuando una mujer verificada hable en su canal.\n> **${verifieds === null || verifieds === void 0 ? void 0 : verifieds.toLocaleString()}** miembros tienen el rol.`)
                        .setColor(((_g = (_f = int.guild) === null || _f === void 0 ? void 0 : _f.members.me) === null || _g === void 0 ? void 0 : _g.displayHexColor) || 'White');
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
                    const witheColor = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get('1053418871547248671');
                    const colorRoles = guild === null || guild === void 0 ? void 0 : guild.roles.cache.filter(f => f.position <= ((witheColor === null || witheColor === void 0 ? void 0 : witheColor.position) || 0) && f.position > ((witheColor === null || witheColor === void 0 ? void 0 : witheColor.position) ? witheColor.position - 25 : 0));
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
                        .setColor(((_j = (_h = int.guild) === null || _h === void 0 ? void 0 : _h.members.me) === null || _j === void 0 ? void 0 : _j.displayHexColor) || 'White');
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
                            label: inEnglish ? 'Silver' : 'Plata',
                            emoji: '🥈',
                            value: 'silver'
                        },
                        {
                            label: inEnglish ? 'Beige' : 'Beige',
                            emoji: '🍞',
                            value: 'beige'
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
                            label: inEnglish ? 'Red' : 'Rojo',
                            emoji: '❤️',
                            value: 'red'
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
                            label: inEnglish ? 'Brown' : 'Marrón',
                            emoji: '🍩',
                            value: 'brown'
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
                    const members = (_k = int.guild) === null || _k === void 0 ? void 0 : _k.members.cache;
                    const women = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1058546950414278756')).size;
                    const mens = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1058546982014160947')).size;
                    const oter = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1058547126252093542')).size;
                    const NotificationsEb = new discord_js_1.EmbedBuilder()
                        .setTitle('👥 ' + (inEnglish ? 'Gender roles' : 'Roles de género'))
                        .setDescription(inEnglish ?
                        `> **<@&1058546950414278756>:**\n> This role identifies you as a woman.\n> **${women === null || women === void 0 ? void 0 : women.toLocaleString()}** members have the role.\n\n> **<@&1058546982014160947>:**\n> This role identifies you as a man.\n> **${mens === null || mens === void 0 ? void 0 : mens.toLocaleString()}** members have the role.\n\n> **<@&1058547126252093542>:**\n> Choose this role if there is no role that identifies you.\n> **${oter === null || oter === void 0 ? void 0 : oter.toLocaleString()}** members have the role.` :
                        `> **<@&1058546950414278756>:**\n> Este rol te identifica como mujer.\n> **${women === null || women === void 0 ? void 0 : women.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1058546982014160947>:**\n> Este rol te identifica como hombre.\n> **${mens === null || mens === void 0 ? void 0 : mens.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1058547126252093542>:**\n> Elige este rol si no hay ningun rol que te identifique.\n> **${oter === null || oter === void 0 ? void 0 : oter.toLocaleString()}** miembros tienen el rol.`)
                        .setColor(((_m = (_l = int.guild) === null || _l === void 0 ? void 0 : _l.members.me) === null || _m === void 0 ? void 0 : _m.displayHexColor) || 'White');
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
                    },
                    {
                        value: 'verified-speak',
                        rol: '1083060304054849676',
                        status: ''
                    }
                ];
                if (author)
                    (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
            }
            if (customId == 'colors-menu') {
                const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
                const dictionary = [
                    { value: 'white', rol: '1053418871547248671', status: '' },
                    { value: 'light grey', rol: '1101370592059457556', status: '' },
                    { value: 'silver', rol: '1101370938295066694', status: '' },
                    { value: 'beige', rol: '1101370930401386496', status: '' },
                    { value: 'pink', rol: '1053419401300430939', status: '' },
                    { value: 'violet', rol: '1053419392634994748', status: '' },
                    { value: 'magenta', rol: '1101370073526054972', status: '' },
                    { value: 'purple', rol: '1053419396179185685', status: '' },
                    { value: 'yellow', rol: '1053418924290621490', status: '' },
                    { value: 'gold', rol: '1101370934436311070', status: '' },
                    { value: 'orange', rol: '1053419365820801044', status: '' },
                    { value: 'bronze', rol: '1101370942220927017', status: '' },
                    { value: 'red', rol: '1053419388625231952', status: '' },
                    { value: 'green lime', rol: '1101370924307071049', status: '' },
                    { value: 'green', rol: '1053419357767745617', status: '' },
                    { value: 'olive green', rol: '1101370246859858031', status: '' },
                    { value: 'light blue', rol: '1101370919911440455', status: '' },
                    { value: 'turquoise', rol: '1101370605233786983', status: '' },
                    { value: 'cyan', rol: '1053419338029346817', status: '' },
                    { value: 'blue', rol: '1053419380026908801', status: '' },
                    { value: 'navy blue', rol: '1101370241528893470', status: '' },
                    { value: 'brown', rol: '1053419404924297277', status: '' },
                    { value: 'gray', rol: '1053418889649868800', status: '' },
                    { value: 'dark gray', rol: '1101370597520461894', status: '' },
                    { value: 'black', rol: '1053419409617735790', status: '' }
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
                        `Server focused on female sexual content, created on <t:${createdAt}> by ${__1.Frog.user} a bot that is managed by <@853063286320922634>, here you will find various channels with content of this type, you can also contribute content on the corresponding channels.\n\n*Thank you for being here!*` :
                        `Servidor enfocado en el contenido sexual femenino, creado el <t:${createdAt}> por ${__1.Frog.user} un bot que es administrado por <@853063286320922634>, aquí encontraras diversos canales con contenido de ese tipo además podrás aportar contenido en los canales correspondientes.\n\n*¡Gracias por estar aquí!*`)
                        .setColor(((_o = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _o === void 0 ? void 0 : _o.displayHexColor) || 'White');
                    int.reply({ ephemeral: true, embeds: [ServerEb] });
                }
                if (value == 'channels') {
                    const ChannelsEb1 = new discord_js_1.EmbedBuilder();
                }
                if (value == 'roles') { }
                if (value == 'about-me') {
                    const AboutMeEb = new discord_js_1.EmbedBuilder()
                        .setTitle('🤖 ' + (inEnglish ? `Hello i am ${(_p = __1.Frog.user) === null || _p === void 0 ? void 0 : _p.username}` : `Hola soy ${(_q = __1.Frog.user) === null || _q === void 0 ? void 0 : _q.username}`))
                        .setDescription(inEnglish ?
                        `The creator and owner of the server and I am a **bot** managed by my creator <@853063286320922634> who also manages the server.\n\n*I am not programmed to answer private messages, I just help automate some tasks within the server*` :
                        `El creador y dueño del servidor y soy un **bot** administrado por mi creador <@853063286320922634> quien también administra el servidor.\n\n*No estoy programado para contestar mensajes privados, solo ayudo a automatizar algunas tareas dentro del servidor*`)
                        .setColor('Green');
                    int.reply({ ephemeral: true, embeds: [AboutMeEb] });
                }
            }
        }
    });
}
exports.interactionCreateEvent = interactionCreateEvent;
