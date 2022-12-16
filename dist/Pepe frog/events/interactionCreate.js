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
const functions_1 = require("../../utils/functions");
const interactionCreateEvent = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (int.isButton()) {
        const { customId, guild } = int;
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
                .addComponents(new discord_js_1.SelectMenuBuilder()
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
            ]));
            int.reply({ ephemeral: true, embeds: [RolesEb], components: [RolesMenu] });
        }
        if (customId == 'en-girls') {
            const GirlsEb = new discord_js_1.EmbedBuilder()
                .setTitle(`<a:info_animate:1052698253394710599> Information`)
                .setDescription(`**Are you a woman and you sell your content?**, this is for you.\n\nYou can have a totally exclusive channel for you in this category, in the channel you can promote yourself, publish that you sell content and with it be able to use the mentions @everyone or @here the first mention notifies all members while the second only notifies members connected but these mentions can only be used once a week.\n\nTo obtain these benefits you have to be **18** years old or older and go through a verification, this consists of sending a photo of yourself with a piece of paper showing the name of the server *(you can write the name of the server wherever you want)*, once you pass the verification you will be given a unique role and the channel with the name of your choice.\n*Esta verificación es para comprobar que en realidad eres mujer y no un hombre haciéndose pasar por una.*\n\n*If you are satisfied with this and want to start with the verification or have questions, you can speak privately with one of the administrator who are <@853063286320922634>*`)
                .setColor(((_d = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White');
            int.reply({ ephemeral: true, embeds: [GirlsEb] });
        }
    }
    if (int.isSelectMenu()) {
        const { customId, locale, values, guild, user } = int, inEnglish = locale == 'en-US';
        if (customId == 'roles-menu') {
            const option = values[0];
            if (option == 'notifications') {
                const members = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.cache;
                const announcements = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053391025906921472')).size;
                const surveys = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053410859700994128')).size;
                const contents = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1053411182935023657')).size;
                const NotificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Notification roles' : 'Roles de notificación'))
                    .setDescription(inEnglish ?
                    `> **<@&1053391025906921472>:**\n> This role will notify you when there is a new announcement.\n> **${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** members have the role.\n\n> **<@&1053410859700994128>:**\n> This role will notify you when there is a new survey.\n> **${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** members have the role.\n\n> **<@&1053411182935023657>:**\n> This role will notify you when there is new content.\n> **${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** members have the role.` :
                    `> **<@&1053391025906921472>:**\n> Este rol te notificará cuando haya un nuevo anuncio.\n> **${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053410859700994128>:**\n> Este rol te notificará cuando haya una nueva encuesta.\n> **${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1053411182935023657>:**\n> Este rol te notificará cuando haya contenido nuevo.\n> **${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(((_g = (_f = int.guild) === null || _f === void 0 ? void 0 : _f.members.me) === null || _g === void 0 ? void 0 : _g.displayHexColor) || 'White');
                const NotificationsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
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
                    .setColor(((_j = (_h = int.guild) === null || _h === void 0 ? void 0 : _h.members.me) === null || _j === void 0 ? void 0 : _j.displayHexColor) || 'White');
                const ColorsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
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
    }
});
exports.interactionCreateEvent = interactionCreateEvent;
