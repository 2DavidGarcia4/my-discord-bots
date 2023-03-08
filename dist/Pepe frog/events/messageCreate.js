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
exports.messageCreateEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const index_1 = require("../index");
const eval_1 = require("../commands/text/eval");
const roles_1 = require("../commands/text/roles");
const rules_1 = require("../commands/text/rules");
const girls_1 = require("../commands/text/girls");
const info_1 = require("../commands/text/info");
const functions_1 = require("../utils/functions");
const sanctions = [
    {
        time: 4 * 60 * 60 * 1000,
        warns: 3
    },
    {
        time: 8 * 60 * 60 * 1000,
        warns: 4
    },
    {
        time: 16 * 60 * 60 * 1000,
        warns: 5
    },
    {
        time: 24 * 60 * 60 * 1000,
        warns: 6
    },
    {
        time: 48 * 60 * 60 * 1000,
        warns: 7
    },
];
const messageCreateEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const { prefix, serverId, principalServerId, owners } = db_1.frogDb;
    if (((_a = msg.mentions.roles.first()) === null || _a === void 0 ? void 0 : _a.id) == '1053411182935023657')
        msg.react('1053444752340680817');
    if (msg.author.bot)
        return;
    if ((_b = msg.mentions.members) === null || _b === void 0 ? void 0 : _b.has('942860991698436156'))
        msg.react('1061737573959094422');
    if (msg.guildId == principalServerId) {
        if (msg.channel.type != discord_js_1.ChannelType.GuildText)
            return;
        const { parentId } = msg.channel;
        if (['1028793497295261828', '1054489737097908364', '1061436780500496394'].some(s => s == parentId)) {
            const server = client.guilds.cache.get(serverId), channelName = msg.channel.name, serverChannel = server === null || server === void 0 ? void 0 : server.channels.cache.find((f) => f.name == channelName);
            if ((serverChannel === null || serverChannel === void 0 ? void 0 : serverChannel.type) == discord_js_1.ChannelType.GuildText)
                serverChannel.send({ content: msg.content || ' ', files: msg.attachments.map(m => m) });
        }
    }
    if (msg.guildId == serverId) {
        if (!msg.channel.isTextBased())
            return;
        const verifiedsCahnnels = (_c = msg.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.filter(f => f.parentId == '1053401639454773338');
        //? Auto moderation links
        const enlaceActivators = ['http://', 'https://'];
        const filesLinks = ['png', 'jpg', 'gif', 'jpeg', 'mov', 'mp4', 'mp3'];
        if (!(verifiedsCahnnels === null || verifiedsCahnnels === void 0 ? void 0 : verifiedsCahnnels.some(s => s.id == msg.channelId)) && !((_d = msg.member) === null || _d === void 0 ? void 0 : _d.permissions.has('Administrator')) && enlaceActivators.some(s => msg.content.includes(s))) {
            const texts = msg.content.split(/ +/g).map(m => m.includes('\n') ? m.split('\n') : m).flat();
            const filter = texts.filter(f => enlaceActivators.some(s => f.includes(s)));
            if (filter.some(f => !filesLinks.some(s => f.endsWith('.' + s)))) {
                const AutoModEb = new discord_js_1.EmbedBuilder()
                    .setTitle('Auto moderation')
                    .setDescription('Only links to images, videos and gifs are allowed.')
                    .setColor('Red');
                msg.channel.send({ content: `${msg.author}`, embeds: [AutoModEb] }).then(re => {
                    msg.delete();
                    setTimeout(() => re.delete(), 10000);
                });
                const member = index_1.modDb.find(f => f.id == msg.author.id);
                if (member) {
                    member.warns++;
                    if (member.warns >= 7) {
                        (_e = msg.member) === null || _e === void 0 ? void 0 : _e.roles.add('1053430826823594106');
                    }
                    sanctions.forEach(sanction => {
                        var _a;
                        if (sanction.warns == member.warns) {
                            (_a = msg.member) === null || _a === void 0 ? void 0 : _a.timeout(sanction.time, `Auto moderation of links, ${sanction.warns} warns`);
                        }
                    });
                }
                else {
                    index_1.modDb.push({ id: msg.author.id, warns: 1, message: '', messages: [] });
                }
            }
            return;
        }
        //? Auto moderation discord invites
        const discordInvites = ['discord.gg/', 'discord.com/invite/'];
        if (!(verifiedsCahnnels === null || verifiedsCahnnels === void 0 ? void 0 : verifiedsCahnnels.some(s => s.id == msg.channelId)) && !((_f = msg.member) === null || _f === void 0 ? void 0 : _f.permissions.has('Administrator')) && discordInvites.some(s => msg.content.includes(s))) {
            const AutoModEb = new discord_js_1.EmbedBuilder()
                .setTitle('Auto moderation')
                .setDescription('Discord server invites are not allowed.')
                .setColor('Red');
            msg.channel.send({ content: `${msg.author}`, embeds: [AutoModEb] }).then(re => {
                msg.delete();
                setTimeout(() => re.delete(), 10000);
            });
            const member = index_1.modDb.find(f => f.id == msg.author.id);
            if (member) {
                member.warns++;
                if (member.warns >= 7) {
                    (_g = msg.member) === null || _g === void 0 ? void 0 : _g.roles.add('1053430826823594106');
                }
                sanctions.forEach(sanction => {
                    var _a;
                    if (sanction.warns == member.warns) {
                        (_a = msg.member) === null || _a === void 0 ? void 0 : _a.timeout(sanction.time, `Auto moderation of discord invites, ${sanction.warns} warns`);
                    }
                });
            }
            else {
                index_1.modDb.push({ id: msg.author.id, warns: 1, message: '', messages: [] });
            }
            return;
        }
        //? Auto reactions to suggestions
        if (msg.channelId == '1053401642915082392' && !((_h = msg.member) === null || _h === void 0 ? void 0 : _h.permissions.has('Administrator')))
            msg.react('1059641676798377995'), msg.react('1059641726387626015');
        if (msg.channel.type == discord_js_1.ChannelType.GuildText && msg.attachments.size && msg.channel.parentId != '1054485238413266965' && msg.attachments.some(s => s.size < 8000000)) {
            const principalServer = client.guilds.cache.get(principalServerId), channelName = msg.channel.name, serverChannel = principalServer === null || principalServer === void 0 ? void 0 : principalServer.channels.cache.find(f => f.name == channelName);
            if ((serverChannel === null || serverChannel === void 0 ? void 0 : serverChannel.type) == discord_js_1.ChannelType.GuildText)
                serverChannel.send({ content: `${msg.author} | \`\`${msg.author.id}\`\``, files: msg.attachments.filter(f => f.size < 8000000).map(m => m) });
        }
        if (msg.content.split(/ +/g).length >= 3) {
            //? Automoderation spam
            const member = index_1.modDb.find(f => f.id == msg.author.id);
            if (member) {
                const duplicatedMessages = member.messages.filter(f => f.content == msg.content && f.channelId != msg.channelId).length;
                // console.log(member.messages.length)
                member.messages.push({ id: msg.id, content: msg.content, channelId: msg.channelId });
                setTimeout(() => {
                    member.messages.splice(member.messages.findIndex(f => f.id == msg.id), 1);
                }, 60000);
                const ar = [];
                const channels = member.messages.filter((f) => {
                    ar.push(f.channelId);
                    const channelIds = ar.filter(ci => ci == f.channelId).length;
                    return f.content == msg.content && channelIds <= 1;
                }).map(m => `<#${m.channelId}>`);
                const AutoModEb = new discord_js_1.EmbedBuilder()
                    .setTitle('Auto moderation')
                    .setDescription(`Don't send the same message on different channels\n\nYou have sent the message in the following channels ${channels.join(', ')}`)
                    .setColor('Red');
                if (duplicatedMessages >= 2 || member.message == msg.content) {
                    member.warns++;
                    if (!member.message) {
                        member.message = msg.content;
                        setTimeout(() => member.message = '', 60000);
                    }
                    member.messages.filter(f => f.content == msg.content && f.id != msg.id).forEach((message) => __awaiter(void 0, void 0, void 0, function* () {
                        var _o;
                        const channel = (_o = msg.guild) === null || _o === void 0 ? void 0 : _o.channels.cache.get(message.channelId);
                        if (channel === null || channel === void 0 ? void 0 : channel.isTextBased())
                            (yield channel.messages.fetch(message.id)).delete().then(dem => {
                                member.messages.splice(member.messages.findIndex(f => f.id == dem.id), 1);
                            }).catch();
                    }));
                    msg.reply({ embeds: [AutoModEb] }).then(tmsg => {
                        setTimeout(() => {
                            msg.delete().catch();
                            tmsg.delete();
                        }, 10000);
                    });
                }
                if (member.warns == 2) {
                    (_j = msg.member) === null || _j === void 0 ? void 0 : _j.timeout(4 * 60 * 60000, 'Spam auto moderation');
                }
                if (member.warns == 3) {
                    (_k = msg.member) === null || _k === void 0 ? void 0 : _k.roles.add('1053430826823594106');
                }
            }
            else {
                index_1.modDb.push({ id: msg.author.id, message: '', warns: 0, messages: [{ id: msg.id, content: msg.content, channelId: msg.channelId }] });
                setTimeout(() => {
                    const user = index_1.modDb.find(f => f.id == msg.author.id);
                    user === null || user === void 0 ? void 0 : user.messages.splice(user.messages.findIndex(f => f.id == msg.id), 1);
                }, 60000);
            }
            if (msg.channel.type == discord_js_1.ChannelType.GuildText) {
                //? Auto reactions for verified messages
                if (msg.channel.parentId == '1053401639454773338' && msg.channel.position > 1)
                    msg.react('1061464848967401502'), msg.react('1061467211329458216'), msg.react('1061467145122369596');
                if (msg.mentions.everyone && msg.channel.parentId == '1053401639454773338' && ((_l = msg.member) === null || _l === void 0 ? void 0 : _l.roles.cache.has('1057720387464593478'))) {
                    const verifiedsData = yield (0, functions_1.getVerifiedsData)(client);
                    const channelLog = client.channels.cache.get('1083075799634157669');
                    msg.channel.permissionOverwrites.edit(msg.author.id, { MentionEveryone: false });
                    const verifiedUser = verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.find(f => f.id == msg.author.id);
                    if (verifiedUser) {
                        verifiedUser.ping = false;
                        verifiedUser.pinedAt = Date.now();
                    }
                    else {
                        verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.push({
                            id: msg.author.id,
                            ping: false,
                            pinedAt: Date.now(),
                            channelId: msg.channelId
                        });
                    }
                    if (verifiedsData)
                        yield (0, functions_1.updateVerifiedsData)(client, verifiedsData);
                    const VerifiedLog = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: `New ping for ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
                        .setDescription(`${msg.author} podrás utilizar nuevamente ping <t:${Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)}:R>`)
                        .setColor('Yellow');
                    if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                        channelLog.send({ embeds: [VerifiedLog] });
                }
            }
        }
    }
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = (_m = args.shift()) === null || _m === void 0 ? void 0 : _m.toLowerCase();
    if (owners.some(s => s == msg.author.id)) {
        if (command == 'eval')
            (0, eval_1.evalCommand)(msg, client, args.join(' '));
        if (command == 'rules')
            (0, rules_1.rulesCommand)(msg);
        if (command == 'roles')
            (0, roles_1.rolesCommand)(msg);
        if (command == 'girls')
            (0, girls_1.girlsCommand)(msg);
        if (command == 'info')
            (0, info_1.infoCommand)(msg);
    }
});
exports.messageCreateEvent = messageCreateEvent;
