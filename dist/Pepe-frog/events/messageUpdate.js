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
exports.messageUpdateEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const messageUpdateEvent = (oldMsg, newMsg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { serverId } = db_1.FrogDb;
    if (oldMsg.guildId != serverId || ((_a = oldMsg.author) === null || _a === void 0 ? void 0 : _a.bot))
        return;
    if (oldMsg.content && oldMsg.content != newMsg.content) {
        const channelLog = client.channels.cache.get('1053389522253127720');
        const MessageUpdateEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: ((_b = oldMsg.member) === null || _b === void 0 ? void 0 : _b.nickname) || ((_c = oldMsg.author) === null || _c === void 0 ? void 0 : _c.username) || 'undefined', iconURL: (_d = oldMsg.author) === null || _d === void 0 ? void 0 : _d.displayAvatarURL() })
            .setTitle('🪄 Edited message')
            .addFields({ name: `📄 **Old message:**`, value: `${oldMsg.content.length > 1024 ? oldMsg.content.slice(0, 1020) + '...' : oldMsg.content}`, inline: true }, { name: `📝 **New message:**`, value: `${(((_e = newMsg.content) === null || _e === void 0 ? void 0 : _e.length) || 0) > 1024 ? ((_f = newMsg.content) === null || _f === void 0 ? void 0 : _f.slice(0, 1020)) + '...' : newMsg.content}`, inline: true }, { name: `\u200B`, value: `\u200B`, inline: true }, { name: '🧑 **Author:**', value: `${oldMsg.author} ||*(\`\`${(_g = oldMsg.author) === null || _g === void 0 ? void 0 : _g.id}\`\`)*||`, inline: true }, { name: `<:canaldetexto:904812801925738557> **Channel:**`, value: `${oldMsg.channel}`, inline: true }, { name: '📄 **Message:**', value: `[Go to message](${newMsg.url})`, inline: true })
            .setColor('Blurple')
            .setTimestamp();
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [MessageUpdateEb] });
    }
});
exports.messageUpdateEvent = messageUpdateEvent;
