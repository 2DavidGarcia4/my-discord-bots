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
exports.updateUsersData = exports.getUsersData = exports.getGuildPrefix = exports.getEmbedColor = exports.updateGuildsData = exports.getGuildsData = exports.interactiveList = exports.getBotData = exports.fetchServerRules = exports.moderationSanction = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const functions_1 = require("../../shared/functions");
const { color } = db_1.botDB;
const moderationSanction = (msg, autoModMember) => {
    var _a, _b, _c, _d, _e;
    if (autoModMember.warnings >= 2) {
        const embAdvertenciaMD = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
            .setTitle(`🔗 Auto moderación de enlaces`)
            .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
            .setColor(color.negative);
        msg.author.send({ embeds: [embAdvertenciaMD] }).catch(() => '');
    }
    let timeoutText = `By auto moderation of links, the member has sent ${autoModMember.warnings} links in channels which is not allowed.`;
    if (autoModMember.warnings == 3) {
        (_a = msg.member) === null || _a === void 0 ? void 0 : _a.timeout(4 * 60 * 60000, timeoutText);
    }
    if (autoModMember.warnings == 4) {
        (_b = msg.member) === null || _b === void 0 ? void 0 : _b.timeout(8 * 60 * 60000, timeoutText);
    }
    if (autoModMember.warnings == 5) {
        (_c = msg.member) === null || _c === void 0 ? void 0 : _c.timeout(10 * 60 * 60000, timeoutText);
    }
    if (autoModMember.warnings == 6) {
        (_d = msg.member) === null || _d === void 0 ? void 0 : _d.kick(timeoutText);
    }
    if (autoModMember.warnings == 7) {
        (_e = msg.member) === null || _e === void 0 ? void 0 : _e.ban({ reason: timeoutText });
    }
};
exports.moderationSanction = moderationSanction;
const fetchServerRules = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const rulesChannel = client.channels.cache.get('1073819301661913219');
    if ((rulesChannel === null || rulesChannel === void 0 ? void 0 : rulesChannel.type) == discord_js_1.ChannelType.GuildText)
        return (yield rulesChannel.messages.fetch('1073819326420897922')).content;
});
exports.fetchServerRules = fetchServerRules;
const getBotData = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get('1075494668386705428');
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const message = (yield channelDb.messages.fetch('1075494740595847289')).content;
        const data = eval(message);
        return data;
    }
    return undefined;
});
exports.getBotData = getBotData;
const interactiveList = (int, list, title, description, color) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isEnglish = int.locale == 'en-US';
    yield int.deferReply();
    list = list.map((el, i) => `${i + 1}. ${el}`);
    let allPages = 0;
    if (list && String(list.length).slice(-1) == '0') {
        allPages = Math.floor(list.length / 10);
    }
    else {
        allPages = Math.floor(list.length / 10 + 1);
    }
    let start = 0, end = 10, page = 1;
    const ListEb = new discord_js_1.EmbedBuilder({ title })
        .setColor(color)
        .setTimestamp();
    if (((list === null || list === void 0 ? void 0 : list.length) || 0) <= 10) {
        ListEb
            .setDescription(description + list.join('\n'))
            .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: ((_a = int.guild) === null || _a === void 0 ? void 0 : _a.iconURL()) || undefined });
        (0, functions_1.sendMessageSlash)(int, { embeds: [ListEb] });
    }
    else {
        ListEb
            .setDescription(description + list.slice(start, end).join("\n"))
            .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: ((_b = int.guild) === null || _b === void 0 ? void 0 : _b.iconURL()) || undefined });
        const ListButtons = new discord_js_1.ActionRowBuilder()
            .addComponents([
            new discord_js_1.ButtonBuilder()
                .setCustomId('previous')
                .setLabel("Anterior")
                .setEmoji(db_1.botDB.emoji.leftArrow)
                .setStyle(discord_js_1.ButtonStyle.Secondary),
            new discord_js_1.ButtonBuilder()
                .setCustomId('next')
                .setLabel("Siguiente")
                .setEmoji(db_1.botDB.emoji.rightArrow)
                .setStyle(discord_js_1.ButtonStyle.Primary)
        ]).toJSON();
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const alliansesMessage = yield int.editReply({ embeds: [ListEb], components: [ListButtons] });
            const alliancesCollection = alliansesMessage.createMessageComponentCollector({ time: allPages * 60000 });
            alliancesCollection.on('collect', (btn) => __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                if (btn.customId == 'previous') {
                    if (end - 10 <= 10) {
                        ListButtons.components[0].style = discord_js_1.ButtonStyle.Secondary;
                        ListButtons.components[0].disabled = true;
                        ListButtons.components[1].disabled = false;
                        ListButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                    }
                    else {
                        ListButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                        ListButtons.components[0].disabled = false;
                        ListButtons.components[1].disabled = false;
                        ListButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                    }
                    start -= 10, end -= 10, page--;
                    ListEb
                        .setDescription(description + list.slice(start, end).join('\n'))
                        .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: ((_c = int.guild) === null || _c === void 0 ? void 0 : _c.iconURL()) || undefined });
                    yield btn.update({ embeds: [ListEb], components: [ListButtons] });
                }
                if (btn.customId == 'next') {
                    if (end + 10 >= list.length) {
                        ListButtons.components[0].disabled = false;
                        ListButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                        ListButtons.components[1].style = discord_js_1.ButtonStyle.Secondary;
                        ListButtons.components[1].disabled = true;
                    }
                    else {
                        ListButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                        ListButtons.components[0].disabled = false;
                        ListButtons.components[1].disabled = false;
                        ListButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                    }
                    start += 10, end += 10, page++;
                    ListEb
                        .setDescription(description + list.slice(start, end).join('\n'))
                        .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.iconURL()) || undefined });
                    yield btn.update({ embeds: [ListEb], components: [ListButtons] });
                }
            }));
            alliancesCollection.on("end", () => {
                int.editReply({ embeds: [ListEb], components: [] });
            });
        }), 600);
    }
});
exports.interactiveList = interactiveList;
//? Guilds data
const guildsChannelId = '1081285638923489362', guidlsMessageId = '1081289925074370602';
const getGuildsData = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get(guildsChannelId);
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const message = (yield channelDb.messages.fetch(guidlsMessageId)).content;
        const data = JSON.parse(message);
        return data;
    }
});
exports.getGuildsData = getGuildsData;
const updateGuildsData = (client, newData) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get(guildsChannelId);
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const newDataStr = JSON.stringify(newData);
        const message = yield channelDb.messages.fetch(guidlsMessageId);
        if (newDataStr != message.content)
            message.edit({ content: JSON.stringify(newData) });
    }
});
exports.updateGuildsData = updateGuildsData;
const getEmbedColor = (guild) => {
    var _a;
    const guildData = db_1.botDB.guilds.find(f => f.guildId == (guild === null || guild === void 0 ? void 0 : guild.id));
    return guildData ? (guildData.autoColor ? (((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White') : db_1.botDB.color.bot) : db_1.botDB.color.bot;
};
exports.getEmbedColor = getEmbedColor;
const getGuildPrefix = (guild) => {
    const guildData = db_1.botDB.guilds.find(f => f.guildId == (guild === null || guild === void 0 ? void 0 : guild.id));
    return (guildData === null || guildData === void 0 ? void 0 : guildData.prefix) || db_1.botDB.prefix;
};
exports.getGuildPrefix = getGuildPrefix;
//? Users data
const usersChanneId = '1081326241069670462', usersMessageId = '1081327317130940457';
const getUsersData = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get(usersChanneId);
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const message = (yield channelDb.messages.fetch(usersMessageId)).content;
        const data = JSON.parse(message);
        return data;
    }
});
exports.getUsersData = getUsersData;
const updateUsersData = (client, newData) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get(usersChanneId);
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const newDataStr = JSON.stringify(newData);
        const message = yield channelDb.messages.fetch(usersMessageId);
        if (newDataStr != message.content)
            message.edit({ content: JSON.stringify(newData) });
    }
});
exports.updateUsersData = updateUsersData;
