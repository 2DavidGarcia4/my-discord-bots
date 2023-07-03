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
exports.handlePreviewChannels = exports.autoChangeNicknames = exports.defaultInfoMessageBody = exports.getInfoMessage = exports.inspectVerifieds = exports.updateVerifiedsData = exports.getVerifiedsData = exports.setGuildStatus = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const getCategoryChannels = (id, server) => {
    return server === null || server === void 0 ? void 0 : server.channels.cache.filter(f => f.parentId == id).size.toLocaleString();
};
const setGuildStatus = (client) => {
    const snackServer = client.guilds.cache.get(db_1.FrogDb.serverId);
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
    const server = client.guilds.cache.get(db_1.FrogDb.serverId);
    const channelLog = client.channels.cache.get('1100110861244301382');
    if (verifiedsData) {
        for (let v of verifiedsData) {
            const channel = client.channels.cache.get(v.channelId);
            const verified = server === null || server === void 0 ? void 0 : server.members.cache.get(v.id);
            const day = 24 * 60 * 60000;
            if (verified) {
                if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText) {
                    if ((!v.contentHidden) && v.lastActivityAt < Math.floor(Date.now() - (day * 30)))
                        yield channel.permissionOverwrites.edit(db_1.FrogDb.serverId, { ReadMessageHistory: false }).then(ed => {
                            v.contentHidden = true;
                            const VerifiedLog = new discord_js_1.EmbedBuilder()
                                .setDescription(`Los miembro ya no pueden ver el contenido de tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **30** días.`)
                                .setColor('Blue');
                            if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                                channelLog.send({ content: `<@${v.id}>`, embeds: [VerifiedLog] });
                        });
                    if ((!v.channelHidden) && v.lastActivityAt < Math.floor(Date.now() - (day * 40)))
                        yield channel.permissionOverwrites.edit(db_1.FrogDb.serverId, { ViewChannel: false }).then(ed => {
                            v.channelHidden = true;
                            const VerifiedLog = new discord_js_1.EmbedBuilder()
                                .setDescription(`Los miembro ya no pueden ver tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **40** días.`)
                                .setColor('Orange');
                            if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                                channelLog.send({ content: `<@${v.id}>`, embeds: [VerifiedLog] });
                        });
                    if (!v.ping) {
                        if (Math.floor(v.pinedAt + (db_1.FrogDb.verifiedsCooldown)) <= Date.now()) {
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
            else {
                if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText)
                    yield channel.permissionOverwrites.edit(db_1.FrogDb.serverId, { ViewChannel: false }).then(() => {
                        verifiedsData.splice(verifiedsData.findIndex(f => f.id == v.id), 1);
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`La verificada <@${v.id}> no se encuentra en el servidor, ha sido eliminada de la base de datos y su canal ha sido cerrado.`)
                            .setColor('Red');
                        if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                            channelLog.send({ content: `<@${v.id}>`, embeds: [VerifiedLog] });
                    });
            }
        }
        yield (0, exports.updateVerifiedsData)(client, verifiedsData);
    }
});
exports.inspectVerifieds = inspectVerifieds;
const messagesIndexByLanguages = {
    es: 1,
    en: 0
};
function getInfoMessage({ client, channelId, language }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const channel = client.channels.cache.get(channelId);
        if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText) {
            const infoMessages = (yield channel.messages.fetch({ limit: 6 })).map(m => m);
            let index = messagesIndexByLanguages[language];
            return (_a = infoMessages === null || infoMessages === void 0 ? void 0 : infoMessages.find((_, i) => i == index)) === null || _a === void 0 ? void 0 : _a.content;
        }
    });
}
exports.getInfoMessage = getInfoMessage;
function defaultInfoMessageBody(msg, { title, description, name, extraButtons }) {
    var _a, _b;
    const RulesEb = new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: "you don't speak Spanish?, Click blue button below" })
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    const RulesArb = new discord_js_1.ActionRowBuilder();
    if (extraButtons) {
        RulesArb.addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`en-${name}-btn`)
            .setEmoji('👅')
            .setLabel('English')
            .setStyle(discord_js_1.ButtonStyle.Primary), ...extraButtons);
    }
    else {
        RulesArb.addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`en-${name}-btn`)
            .setEmoji('👅')
            .setLabel('English')
            .setStyle(discord_js_1.ButtonStyle.Primary));
    }
    msg.channel.send({ embeds: [RulesEb], components: [RulesArb] });
}
exports.defaultInfoMessageBody = defaultInfoMessageBody;
function autoChangeNicknames(members, client) {
    const includes = ['!', '¡', '?', '¿'];
    let updatedMembers = 0;
    members.forEach(m => {
        if (m.nickname) {
            if (includes.some(s => { var _a; return (_a = m.nickname) === null || _a === void 0 ? void 0 : _a.startsWith(s); })) {
                m.edit({ nick: m.nickname.replace(/[!¡¿?]/, '').trim() }).then(mr => {
                    updatedMembers++;
                });
            }
        }
        else if (includes.some(s => m.user.username.startsWith(s))) {
            m.edit({ nick: m.user.username.replace(/[!¡¿?]/, '').trim() }).then(mr => {
                updatedMembers++;
            });
        }
    });
    if (updatedMembers) {
        const UpdatedMembersEb = new discord_js_1.EmbedBuilder()
            .setTitle('Update members nicknames')
            .setDescription(`**${updatedMembers}**`)
            .setColor('Blue');
        const channelLog = client.channels.cache.get('1053389522253127720');
        if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
            channelLog.send({ embeds: [UpdatedMembersEb] });
    }
}
exports.autoChangeNicknames = autoChangeNicknames;
function handlePreviewChannels(int) {
    var _a;
    const inEnglish = int.locale == 'en-US';
    const author = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(int.user.id);
    const VIPPreviewEb = new discord_js_1.EmbedBuilder()
        .setTitle('👁️ ' + (inEnglish ? 'Channels preview' : 'Vista previa de canales'));
    if (this.accessRoles.some(s => author === null || author === void 0 ? void 0 : author.roles.cache.has(s))) {
        VIPPreviewEb
            .setDescription(inEnglish ?
            `You already have access to all channels in this category, you have upgraded the server or you have paid for access.` :
            `Ya tienes acceso a todos los canales de esta categoría, has mejorado el servidor o has pagado por el acceso.`)
            .setColor('Blurple');
    }
    else if (author === null || author === void 0 ? void 0 : author.roles.cache.has(this.previewRol)) {
        VIPPreviewEb
            .setDescription(inEnglish ?
            `You already have channel preview enabled for this category.` :
            `Ya tienes habilitada la vista previa de canales de este acategoría.`)
            .setColor('Blurple');
    }
    else {
        author === null || author === void 0 ? void 0 : author.roles.add(this.previewRol).then(() => setTimeout(() => {
            author.roles.remove(this.previewRol);
        }, 10 * 60000));
        VIPPreviewEb
            .setDescription(inEnglish ?
            `You have been enabled to preview channels for this category, you can only see the channels, not the content.` :
            `Se the ha habilitado la vista previa de canales para esta categoría, solo puedes ver los canales no el contenido.`)
            .setFooter({ text: inEnglish ?
                'The channel preview is disabled in 10 minutes' :
                'La vista previa de canales se te deshabilita en 10 minutos'
        })
            .setColor('Yellow');
    }
    int.reply({ ephemeral: true, embeds: [VIPPreviewEb] });
}
exports.handlePreviewChannels = handlePreviewChannels;
