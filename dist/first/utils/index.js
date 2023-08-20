"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsersData = exports.getUsersData = exports.getGuildPrefix = exports.getEmbedColor = exports.updateGuildsData = exports.getGuildsData = exports.interactiveList = exports.getBotData = exports.fetchServerRules = exports.moderationSanction = void 0;
const discord_js_1 = require("discord.js");
const data_1 = require("../data");
const functions_1 = require("../../shared/functions");
const { color } = data_1.botDB;
const moderationSanction = (msg, autoModMember) => {
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
        msg.member?.timeout(4 * 60 * 60000, timeoutText);
    }
    if (autoModMember.warnings == 4) {
        msg.member?.timeout(8 * 60 * 60000, timeoutText);
    }
    if (autoModMember.warnings == 5) {
        msg.member?.timeout(10 * 60 * 60000, timeoutText);
    }
    if (autoModMember.warnings == 6) {
        msg.member?.kick(timeoutText);
    }
    if (autoModMember.warnings == 7) {
        msg.member?.ban({ reason: timeoutText });
    }
};
exports.moderationSanction = moderationSanction;
const fetchServerRules = async (client) => {
    const rulesChannel = client.channels.cache.get('1073819301661913219');
    if (rulesChannel?.type == discord_js_1.ChannelType.GuildText)
        return (await rulesChannel.messages.fetch('1073819326420897922')).content;
};
exports.fetchServerRules = fetchServerRules;
const getBotData = async (client) => {
    const channelDb = client.channels.cache.get('1075494668386705428');
    if (channelDb?.isTextBased()) {
        const message = (await channelDb.messages.fetch('1075494740595847289')).content;
        const data = eval(message);
        return data;
    }
    return undefined;
};
exports.getBotData = getBotData;
const interactiveList = async (int, list, title, description, color) => {
    const isEnglish = int.locale == 'en-US';
    await int.deferReply();
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
    if ((list?.length || 0) <= 10) {
        ListEb
            .setDescription(description + list.join('\n'))
            .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
        (0, functions_1.sendMessageSlash)(int, { embeds: [ListEb] });
    }
    else {
        ListEb
            .setDescription(description + list.slice(start, end).join("\n"))
            .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
        const ListButtons = new discord_js_1.ActionRowBuilder()
            .addComponents([
            new discord_js_1.ButtonBuilder()
                .setCustomId('previous')
                .setLabel("Anterior")
                .setEmoji(data_1.botDB.emoji.leftArrow)
                .setStyle(discord_js_1.ButtonStyle.Secondary),
            new discord_js_1.ButtonBuilder()
                .setCustomId('next')
                .setLabel("Siguiente")
                .setEmoji(data_1.botDB.emoji.rightArrow)
                .setStyle(discord_js_1.ButtonStyle.Primary)
        ]).toJSON();
        setTimeout(async () => {
            const alliansesMessage = await int.editReply({ embeds: [ListEb], components: [ListButtons] });
            const alliancesCollection = alliansesMessage.createMessageComponentCollector({ time: allPages * 60000 });
            alliancesCollection.on('collect', async (btn) => {
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
                        .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
                    await btn.update({ embeds: [ListEb], components: [ListButtons] });
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
                        .setFooter({ text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
                    await btn.update({ embeds: [ListEb], components: [ListButtons] });
                }
            });
            alliancesCollection.on("end", () => {
                int.editReply({ embeds: [ListEb], components: [] });
            });
        }, 600);
    }
};
exports.interactiveList = interactiveList;
//? Guilds data
const guildsChannelId = '1081285638923489362', guidlsMessageId = '1081289925074370602';
const getGuildsData = async (client) => {
    const channelDb = client.channels.cache.get(guildsChannelId);
    if (channelDb?.isTextBased()) {
        const message = (await channelDb.messages.fetch(guidlsMessageId)).content;
        const data = JSON.parse(message);
        return data;
    }
};
exports.getGuildsData = getGuildsData;
const updateGuildsData = async (client, newData) => {
    const channelDb = client.channels.cache.get(guildsChannelId);
    if (channelDb?.isTextBased()) {
        const newDataStr = JSON.stringify(newData);
        const message = await channelDb.messages.fetch(guidlsMessageId);
        if (newDataStr != message.content)
            message.edit({ content: JSON.stringify(newData) });
    }
};
exports.updateGuildsData = updateGuildsData;
const getEmbedColor = (guild) => {
    const guildData = data_1.botDB.guilds.find(f => f.guildId == guild?.id);
    return guildData ? (guildData.autoColor ? (guild?.members.me?.displayHexColor || 'White') : data_1.botDB.color.bot) : data_1.botDB.color.bot;
};
exports.getEmbedColor = getEmbedColor;
const getGuildPrefix = (guild) => {
    const guildData = data_1.botDB.guilds.find(f => f.guildId == guild?.id);
    return guildData?.prefix || data_1.botDB.prefix;
};
exports.getGuildPrefix = getGuildPrefix;
//? Users data
const usersChanneId = '1081326241069670462', usersMessageId = '1081327317130940457';
const getUsersData = async (client) => {
    const channelDb = client.channels.cache.get(usersChanneId);
    if (channelDb?.isTextBased()) {
        const message = (await channelDb.messages.fetch(usersMessageId)).content;
        const data = JSON.parse(message);
        return data;
    }
};
exports.getUsersData = getUsersData;
const updateUsersData = async (client, newData) => {
    const channelDb = client.channels.cache.get(usersChanneId);
    if (channelDb?.isTextBased()) {
        const newDataStr = JSON.stringify(newData);
        const message = await channelDb.messages.fetch(usersMessageId);
        if (newDataStr != message.content)
            message.edit({ content: JSON.stringify(newData) });
    }
};
exports.updateUsersData = updateUsersData;
