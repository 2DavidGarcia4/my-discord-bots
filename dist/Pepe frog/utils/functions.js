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
exports.getVerifiedsInfo = exports.getRules = exports.inspectVerifieds = exports.updateVerifiedsData = exports.getVerifiedsData = exports.setGuildStatus = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const getCategoryChannels = (id, server) => {
    return server === null || server === void 0 ? void 0 : server.channels.cache.filter(f => f.parentId == id).size.toLocaleString();
};
const setGuildStatus = (client) => {
    const snackServer = client.guilds.cache.get(db_1.frogDb.serverId);
    const online = snackServer === null || snackServer === void 0 ? void 0 : snackServer.members.cache.filter(f => { var _a, _b, _c, _d; return ((_a = f.presence) === null || _a === void 0 ? void 0 : _a.status) == 'dnd' || ((_b = f.presence) === null || _b === void 0 ? void 0 : _b.status) == 'idle' || ((_c = f.presence) === null || _c === void 0 ? void 0 : _c.status) == 'online' || ((_d = f.presence) === null || _d === void 0 ? void 0 : _d.status) == 'invisible'; }).size;
    const allMembers = snackServer === null || snackServer === void 0 ? void 0 : snackServer.memberCount, nsfwChannels = getCategoryChannels('1053401638494289931', snackServer);
    const vipChannels = getCategoryChannels('1054485238413266965', snackServer);
    const packChannels = getCategoryChannels('1061436779707773070', snackServer);
    const onlineName = `🟢│en linea: ${online === null || online === void 0 ? void 0 : online.toLocaleString()}`, membersName = `👥│todos: ${allMembers === null || allMembers === void 0 ? void 0 : allMembers.toLocaleString()}`, nsfwName = `🔞│NSFW canales: ${nsfwChannels}`, vipName = `🌟│VIP canales: ${vipChannels}`, packName = `📂│Packs canales: ${packChannels}`;
    const onlineChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426402361352269');
    const membersChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426454538493993');
    const nsfwChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426479607849112');
    const vipCahnnel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1072305855447441428');
    const packChannel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1072325996314902660');
    if ((onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.name) != onlineName)
        onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.edit({ name: onlineName });
    if ((membersChanel === null || membersChanel === void 0 ? void 0 : membersChanel.name) != membersName)
        membersChanel === null || membersChanel === void 0 ? void 0 : membersChanel.edit({ name: membersName });
    if ((nsfwChanel === null || nsfwChanel === void 0 ? void 0 : nsfwChanel.name) != nsfwName)
        nsfwChanel === null || nsfwChanel === void 0 ? void 0 : nsfwChanel.edit({ name: nsfwName });
    if ((vipCahnnel === null || vipCahnnel === void 0 ? void 0 : vipCahnnel.name) != nsfwName)
        vipCahnnel === null || vipCahnnel === void 0 ? void 0 : vipCahnnel.edit({ name: vipName });
    if ((packChannel === null || packChannel === void 0 ? void 0 : packChannel.name) != nsfwName)
        packChannel === null || packChannel === void 0 ? void 0 : packChannel.edit({ name: packName });
};
exports.setGuildStatus = setGuildStatus;
//? Verifieds data
const verifiedsChanneId = '1083064332260212768', verifiedsMessageId = '1083069070896812154';
const getVerifiedsData = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get(verifiedsChanneId);
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const message = (yield channelDb.messages.fetch(verifiedsMessageId)).content;
        const data = JSON.parse(message);
        return data;
    }
});
exports.getVerifiedsData = getVerifiedsData;
const updateVerifiedsData = (client, newData) => __awaiter(void 0, void 0, void 0, function* () {
    const channelDb = client.channels.cache.get(verifiedsChanneId);
    if (channelDb === null || channelDb === void 0 ? void 0 : channelDb.isTextBased()) {
        const newDataStr = JSON.stringify(newData);
        const message = yield channelDb.messages.fetch(verifiedsMessageId);
        if (newDataStr != message.content)
            message.edit({ content: JSON.stringify(newData) });
    }
});
exports.updateVerifiedsData = updateVerifiedsData;
const inspectVerifieds = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedsData = yield (0, exports.getVerifiedsData)(client);
    const channelLog = client.channels.cache.get('1100110861244301382');
    if (verifiedsData) {
        for (let v of verifiedsData) {
            const channel = client.channels.cache.get(v.channelId);
            if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText) {
                if ((!v.contentHidden) && v.lastActivityAt < Math.floor(Date.now() - (30 * 24 * 60 * 60000)))
                    yield channel.permissionOverwrites.edit(db_1.frogDb.serverId, { ReadMessageHistory: false }).then(ed => {
                        v.contentHidden = true;
                        console.log('assad');
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`Los miembro ya no pueden ver el contenido de tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **30** días.`)
                            .setColor('Blue');
                        if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                            channelLog.send({ content: `<@${v.id}>`, embeds: [VerifiedLog] });
                    });
                if ((!v.channelHidden) && v.lastActivityAt < Math.floor(Date.now() - (40 * 24 * 60 * 60000)))
                    yield channel.permissionOverwrites.edit(db_1.frogDb.serverId, { ViewChannel: false }).then(ed => {
                        v.channelHidden = true;
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`Los miembro ya no pueden ver tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **40** días.`)
                            .setColor('Orange');
                        if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                            channelLog.send({ content: `<@${v.id}>`, embeds: [VerifiedLog] });
                    });
                if (!v.ping) {
                    if (Math.floor(v.pinedAt + (db_1.frogDb.verifiedsCooldown)) <= Date.now()) {
                        if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText)
                            channel.permissionOverwrites.edit(v.id, { MentionEveryone: true });
                        v.ping = true;
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`Ya puedes utilizar ping en tu canal <#${v.channelId}>`)
                            .setColor('Green');
                        if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                            channelLog.send({ content: `<@${v.id}>`, embeds: [VerifiedLog] });
                    }
                }
            }
        }
        yield (0, exports.updateVerifiedsData)(client, verifiedsData);
    }
});
exports.inspectVerifieds = inspectVerifieds;
const rulesChannelId = '1090736733047492638';
const getRules = (client, language) => __awaiter(void 0, void 0, void 0, function* () {
    const rulesChannel = client.channels.cache.get(rulesChannelId);
    if (rulesChannel === null || rulesChannel === void 0 ? void 0 : rulesChannel.isTextBased()) {
        const rules = (yield rulesChannel.messages.fetch(language == 'en' ? '1090751484754415726' : '1090737102045597788')).content;
        return rules;
    }
});
exports.getRules = getRules;
const varifiedChannelId = '1053399734582263938';
const getVerifiedsInfo = (client, language) => __awaiter(void 0, void 0, void 0, function* () {
    const rulesChannel = client.channels.cache.get(varifiedChannelId);
    if (rulesChannel === null || rulesChannel === void 0 ? void 0 : rulesChannel.isTextBased()) {
        const rules = (yield rulesChannel.messages.fetch(language == 'en' ? '1101591835576639549' : '1101591652440735894')).content;
        return rules;
    }
});
exports.getVerifiedsInfo = getVerifiedsInfo;
