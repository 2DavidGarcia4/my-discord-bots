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
const interactionCreateEvent = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (int.isButton()) {
        const { customId } = int;
        if (customId == 'en-rules-btn') {
            const RulesEb = new discord_js_1.EmbedBuilder()
                .setTitle('📖 Rules')
                .setDescription(`> **1.** Mutual respect, treat others with respect. Harassment, witch hunts, sexism, racism, or hate speech will not be tolerated.\n\n> **2.** Do not encourage others to do malicious practices such as raiding, scam among others.\n\n> 3. No spamming or self-promotion (server invites, advertisements, etc.) without permission from a staff member. This also includes DMing other members.\n\n> **4.** No fotopollas, please do not send photos of your penis is prohibited at the moment since this server is a server focused on female sexual content.\n\n> **5.** If you see something that is against the rules or that doesn't make you feel safe, please let the staff know. We want this server to be a welcoming place!`)
                .setColor(((_a = int.message.member) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White');
            int.reply({ ephemeral: true, embeds: [RulesEb] });
        }
        if (customId == 'en-roles-btn') {
            const RolesEb = new discord_js_1.EmbedBuilder()
                .setTitle('🌈 Roles')
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
    }
    if (int.isSelectMenu()) {
        const { customId, locale, values } = int, inEnglish = locale == 'en-US';
        console.log(locale);
        if (customId == 'roles-menu') {
            console.log('roles');
            const option = values[0];
            if (option == 'notifications') {
                const members = (_d = int.guild) === null || _d === void 0 ? void 0 : _d.members.cache;
                const announcements = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1038137927080882318')).size;
                const surveys = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1038138022341906433')).size;
                const contents = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1038138996351578154')).size;
                const NotificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Notification roles' : 'Roles de notificación'))
                    .setDescription(inEnglish ?
                    `> **<@&1038137927080882318>:**\nThis role will notify you when there is a new announcement.\n**${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** members have the role.\n\n> **<@&1038138022341906433>:**\nThis role will notify you when there is a new survey.\n**${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** members have the role.\n\n> **<@&1038138996351578154>:**\nThis role will notify you when there is new content.\n**${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** members have the role.` :
                    `> **<@&1038137927080882318>:**\nEste rol te notificará cuando haya un nuevo anuncio.\n**${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138022341906433>:**\nEste rol te notificará cuando haya una nueva encuesta.\n**${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138996351578154>:**\nEste rol te notificará cuando haya contenido nuevo.\n**${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(((_f = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.me) === null || _f === void 0 ? void 0 : _f.displayHexColor) || 'White');
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
                        value: 'contents'
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [NotificationsEb], components: [NotificationsMenu] });
            }
            if (option == 'colors') {
                const members = (_g = int.guild) === null || _g === void 0 ? void 0 : _g.members.cache;
                const announcements = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1038137927080882318')).size;
                const surveys = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1038138022341906433')).size;
                const contents = members === null || members === void 0 ? void 0 : members.filter(f => f.roles.cache.has('1038138996351578154')).size;
                const ColorsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('🔔 ' + (inEnglish ? 'Color roles' : 'Roles de colores'))
                    .setDescription(inEnglish ?
                    `> **<@&1038137927080882318>:**\nThis role will notify you when there is a new announcement.\n**${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** members have the role.\n\n> **<@&1038138022341906433>:**\nThis role will notify you when there is a new survey.\n**${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** members have the role.\n\n> **<@&1038138996351578154>:**\nThis role will notify you when there is new content.\n**${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** members have the role.` :
                    `> **<@&1038137927080882318>:**\nEste rol te notificará cuando haya un nuevo anuncio.\n**${announcements === null || announcements === void 0 ? void 0 : announcements.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138022341906433>:**\nEste rol te notificará cuando haya una nueva encuesta.\n**${surveys === null || surveys === void 0 ? void 0 : surveys.toLocaleString()}** miembros tienen el rol.\n\n> **<@&1038138996351578154>:**\nEste rol te notificará cuando haya contenido nuevo.\n**${contents === null || contents === void 0 ? void 0 : contents.toLocaleString()}** miembros tienen el rol.`)
                    .setColor(((_j = (_h = int.guild) === null || _h === void 0 ? void 0 : _h.members.me) === null || _j === void 0 ? void 0 : _j.displayHexColor) || 'White');
                const ColorsMenu = new discord_js_1.ActionRowBuilder()
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
                        value: 'contents'
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [ColorsEb], components: [ColorsMenu] });
            }
        }
    }
});
exports.interactionCreateEvent = interactionCreateEvent;
