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
exports.messageDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const __1 = require("..");
const messageDeleteEvent = (msgd, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { serverId, prefix, owners } = db_1.frogDb;
    if (msgd.guildId != serverId || ((_a = msgd.author) === null || _a === void 0 ? void 0 : _a.bot))
        return;
    if (__1.exemptMessagesIds.some(s => s == msgd.id)) {
        __1.exemptMessagesIds.splice(__1.exemptMessagesIds.findIndex(f => f == msgd.id), 1);
        console.log(__1.exemptMessagesIds);
        return;
    }
    if (msgd.content && !(msgd.content.startsWith(prefix) && owners.some(s => { var _a; return s == ((_a = msgd.author) === null || _a === void 0 ? void 0 : _a.id); }))) {
        const channelLog = client.channels.cache.get('1053389522253127720');
        const DeleteMessageEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: ((_b = msgd.member) === null || _b === void 0 ? void 0 : _b.nickname) || ((_c = msgd.author) === null || _c === void 0 ? void 0 : _c.username) || 'undefined', iconURL: (_d = msgd.author) === null || _d === void 0 ? void 0 : _d.displayAvatarURL() })
            .setTitle('🗑️ Deleted message')
            .setDescription(`**📄 Message:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000) + '...' : msgd.content}`)
            .setFields({ name: '🧑 **Author:**', value: `${msgd.author} ||*(\`\`${(_e = msgd.author) === null || _e === void 0 ? void 0 : _e.id}\`\`)*||`, inline: true }, { name: `<:canaldetexto:904812801925738557> **Channel:**`, value: `${msgd.channel}`, inline: true })
            .setColor('DarkOrange')
            .setTimestamp();
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            return channelLog.send({ embeds: [DeleteMessageEb] });
    }
});
exports.messageDeleteEvent = messageDeleteEvent;
