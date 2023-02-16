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
exports.getBotData = exports.fetchServerRules = exports.moderationSanction = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
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
