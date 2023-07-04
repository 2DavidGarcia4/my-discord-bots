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
const __1 = require("..");
const db_1 = require("../db");
const eval_1 = require("../commands/text/eval");
const roles_1 = require("../commands/text/roles");
const rules_1 = require("../commands/text/rules");
const girls_1 = require("../commands/text/girls");
const info_1 = require("../commands/text/info");
const vip_1 = require("../commands/text/vip");
const packs_1 = require("../commands/text/packs");
const functions_1 = require("../utils/functions");
const components_1 = require("../components");
function messageCreateEvent(msg) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const { channel, channelId, guildId } = msg;
        const { prefix, serverId, principalServerId, owners, verifiedsCooldown, roles: { verified, verifiedSpeech, } } = db_1.FrogDb;
        //* Components
        (0, components_1.Announcements)(msg, __1.Frog);
        (0, components_1.Moderation)(msg);
        (0, components_1.Reactions)(msg);
        if (msg.author.bot)
            return;
        if (guildId == principalServerId) {
            if (channel.type != discord_js_1.ChannelType.GuildText)
                return;
            const { parentId } = channel;
            if (['1028793497295261828', '1054489737097908364', '1061436780500496394', '1112154577811275776'].some(s => s == parentId)) {
                const server = __1.Frog.guilds.cache.get(serverId), channelName = channel.name, serverChannel = server === null || server === void 0 ? void 0 : server.channels.cache.find((f) => f.name == channelName);
                if ((serverChannel === null || serverChannel === void 0 ? void 0 : serverChannel.type) == discord_js_1.ChannelType.GuildText)
                    serverChannel.send({ content: msg.content || ' ', files: msg.attachments.map(m => m) });
            }
        }
        if (guildId == serverId) {
            if (!msg.channel.isTextBased())
                return;
            if (channel.type == discord_js_1.ChannelType.GuildText) {
                //! Backup files
                if (msg.attachments.size && msg.attachments.some(s => s.size < 25000000)) {
                    const principalServer = __1.Frog.guilds.cache.get(principalServerId), channelName = channel.name, backupChannel = principalServer === null || principalServer === void 0 ? void 0 : principalServer.channels.cache.find(f => f.name == channelName);
                    if ((backupChannel === null || backupChannel === void 0 ? void 0 : backupChannel.type) == discord_js_1.ChannelType.GuildText)
                        backupChannel.send({ content: `${msg.author} | \`\`${msg.author.id}\`\``, files: msg.attachments.filter(f => f.size < 25000000).map(m => m) });
                }
                if (channel.parentId == '1053401639454773338' && channel.nsfw) {
                    //? Verifieds system
                    if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has(verified)) {
                        const verifiedsData = yield (0, functions_1.getVerifiedsData)(__1.Frog);
                        const now = Date.now();
                        if (msg.mentions.everyone) {
                            const channelLog = __1.Frog.channels.cache.get('1100110861244301382');
                            channel.permissionOverwrites.edit(msg.author.id, { MentionEveryone: false });
                            const verifiedUser = verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.find(f => f.id == msg.author.id);
                            if (verifiedUser) {
                                verifiedUser.ping = false;
                                verifiedUser.pinedAt = now;
                                verifiedUser.lastActivityAt = now;
                                verifiedUser.lastMentionAt = now;
                                if (!verifiedUser.channelId)
                                    verifiedUser.channelId = channelId;
                                if (verifiedUser.contentHidden) {
                                    verifiedUser.contentHidden = false;
                                    channel.permissionOverwrites.edit(serverId, { ReadMessageHistory: true });
                                }
                                if (verifiedUser.channelHidden) {
                                    verifiedUser.channelHidden = false;
                                    channel.permissionOverwrites.edit(serverId, { ViewChannel: true });
                                }
                            }
                            else {
                                verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.push({
                                    id: msg.author.id,
                                    ping: false,
                                    pinedAt: now,
                                    channelId: channelId,
                                    verifiedAt: now,
                                    contentHidden: false,
                                    channelHidden: false,
                                    lastMentionAt: now,
                                    lastActivityAt: now
                                });
                            }
                            if (verifiedsData)
                                yield (0, functions_1.updateVerifiedsData)(__1.Frog, verifiedsData);
                            const VerifiedLog = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: `New ping for ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
                                .setDescription(`${msg.author} podrás utilizar nuevamente ping <t:${Math.floor((now + verifiedsCooldown) / 1000)}:R>`)
                                .setColor('Yellow');
                            if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
                                channelLog.send({ embeds: [VerifiedLog] });
                        }
                        else if (msg.content.length > 3 || msg.attachments.size) {
                            const verifiedUser = verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.find(v => v.id == msg.author.id);
                            if (verifiedUser) {
                                verifiedUser.lastActivityAt = now;
                                if (!verifiedUser.channelId)
                                    verifiedUser.channelId = channelId;
                                if (verifiedUser.contentHidden) {
                                    verifiedUser.contentHidden = false;
                                    channel.permissionOverwrites.edit(serverId, { ReadMessageHistory: true });
                                }
                                if (verifiedUser.channelHidden) {
                                    verifiedUser.channelHidden = false;
                                    channel.permissionOverwrites.edit(serverId, { ViewChannel: true });
                                }
                                if (!verifiedUser.ping && verifiedUser.pinedAt && verifiedUser.pinedAt < Math.floor(now - (60 * 60000)) && verifiedUser.lastMentionAt && verifiedUser.lastMentionAt < now - (8 * 60000)) {
                                    msg.reply({ allowedMentions: { repliedUser: false, roles: [verifiedSpeech] }, content: `**<@&${verifiedSpeech}>**` });
                                    verifiedUser.lastMentionAt = now;
                                }
                                if (verifiedsData)
                                    yield (0, functions_1.updateVerifiedsData)(__1.Frog, verifiedsData);
                            }
                            else {
                                msg.reply({ allowedMentions: { repliedUser: false, roles: [verifiedSpeech] }, content: `**<@&${verifiedSpeech}>**` });
                                if (!msg.member.permissions.has('Administrator')) {
                                    verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.push({
                                        id: msg.author.id,
                                        ping: false,
                                        channelId: channelId,
                                        verifiedAt: now,
                                        contentHidden: false,
                                        channelHidden: false,
                                        lastMentionAt: now,
                                        lastActivityAt: now
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
            return;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = (_b = args.shift()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (owners.some(s => s == msg.author.id)) {
            if (command == 'eval')
                (0, eval_1.evalCommand)(msg, __1.Frog, args.join(' '));
            if (command == 'rules')
                (0, rules_1.rulesCommand)(msg, __1.Frog);
            if (command == 'roles')
                (0, roles_1.rolesCommand)(msg);
            if (command == 'girls')
                (0, girls_1.girlsCommand)(msg, __1.Frog);
            if (command == 'info')
                (0, info_1.infoCommand)(msg);
            if (command == 'vip')
                (0, vip_1.vipCommand)(msg, __1.Frog);
            if (command == 'packs')
                (0, packs_1.packsCommand)(msg, __1.Frog);
        }
    });
}
exports.messageCreateEvent = messageCreateEvent;
