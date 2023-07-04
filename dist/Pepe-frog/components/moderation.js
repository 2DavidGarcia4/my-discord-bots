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
exports.Moderation = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const __1 = require("..");
function Moderation(msg) {
    var _a, _b, _c, _d, _e;
    const { guildId } = msg;
    if (msg.author.bot)
        return;
    if (guildId != db_1.FrogDb.serverId)
        return;
    const verifiedsCahnnels = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.filter(f => f.parentId == '1053401639454773338');
    const handleModerateAction = (Embed, timeoutReason) => {
        var _a;
        Embed.setColor('Red');
        msg.channel.send({ content: `${msg.author}`, embeds: [Embed] }).then(re => {
            msg.delete();
            setTimeout(() => re.delete(), 10000);
        });
        const member = __1.modDb.find(f => f.id == msg.author.id);
        if (member) {
            member.warns++;
            if (member.warns >= 3) {
                (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.add(db_1.FrogDb.roles.spamer);
            }
            db_1.SANCTIONS.forEach(sanction => {
                var _a;
                if (sanction.warns == member.warns) {
                    (_a = msg.member) === null || _a === void 0 ? void 0 : _a.timeout(sanction.time, timeoutReason.replace('{warns}', sanction.warns + ''));
                }
            });
        }
        else {
            __1.modDb.push({ id: msg.author.id, warns: 1, message: '', messages: [] });
        }
    };
    //? Auto moderation links
    const enlaceActivators = ['http://', 'https://'];
    if (!(verifiedsCahnnels === null || verifiedsCahnnels === void 0 ? void 0 : verifiedsCahnnels.some(s => s.id == msg.channelId)) && !((_b = msg.member) === null || _b === void 0 ? void 0 : _b.permissions.has('Administrator')) && enlaceActivators.some(s => msg.content.includes(s))) {
        const texts = msg.content.split(/ +/g).map(m => m.includes('\n') ? m.split('\n') : m).flat();
        const filter = texts.filter(f => enlaceActivators.some(s => f.includes(s)));
        if (filter.some(f => !db_1.FILE_EXTENSIONS.some(s => f.endsWith('.' + s)))) {
            const AutoModEb = new discord_js_1.EmbedBuilder()
                .setTitle('Auto moderation')
                .setDescription('Only links to images, videos and gifs are allowed.');
            handleModerateAction(AutoModEb, `Auto moderation of links, {warns} warns`);
        }
        return;
    }
    //? Auto moderation discord invites
    const discordInvites = ['discord.gg/', 'discord.com/invite/'];
    if (!(verifiedsCahnnels === null || verifiedsCahnnels === void 0 ? void 0 : verifiedsCahnnels.some(s => s.id == msg.channelId)) && !((_c = msg.member) === null || _c === void 0 ? void 0 : _c.permissions.has('Administrator')) && discordInvites.some(s => msg.content.includes(s))) {
        const AutoModEb = new discord_js_1.EmbedBuilder()
            .setTitle('Auto moderation')
            .setDescription('Discord server invites are not allowed.');
        handleModerateAction(AutoModEb, `Auto moderation of discord invites, {warns} warns`);
        return;
    }
    //? Automoderation spam
    if (msg.content.length) {
        const member = __1.modDb.find(f => f.id == msg.author.id);
        if (member) {
            const duplicatedMessages = member.messages.filter(f => f.content == msg.content && f.channelId != msg.channelId).length;
            // console.log(member.messages.length)
            member.messages.push({ id: msg.id, content: msg.content, channelId: msg.channelId });
            setTimeout(() => {
                member.messages.splice(member.messages.findIndex(f => f.id == msg.id), 1);
            }, 4 * 60000);
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
                    setTimeout(() => member.message = '', 4 * 60000);
                }
                member.messages.filter(f => f.content == msg.content && f.id != msg.id).forEach((message) => __awaiter(this, void 0, void 0, function* () {
                    var _f;
                    const channel = (_f = msg.guild) === null || _f === void 0 ? void 0 : _f.channels.cache.get(message.channelId);
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
                (_d = msg.member) === null || _d === void 0 ? void 0 : _d.timeout(4 * 60 * 60000, 'Spam auto moderation');
            }
            if (member.warns == 3) {
                (_e = msg.member) === null || _e === void 0 ? void 0 : _e.roles.add(db_1.FrogDb.roles.spamer);
            }
        }
        else {
            __1.modDb.push({ id: msg.author.id, message: '', warns: 0, messages: [{ id: msg.id, content: msg.content, channelId: msg.channelId }] });
            setTimeout(() => {
                const user = __1.modDb.find(f => f.id == msg.author.id);
                user === null || user === void 0 ? void 0 : user.messages.splice(user.messages.findIndex(f => f.id == msg.id), 1);
            }, 20 * 60000);
        }
    }
}
exports.Moderation = Moderation;
