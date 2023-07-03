"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcements = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
function Announcements(msg, client) {
    var _a;
    const { channel, channelId, guildId } = msg;
    if (msg.author.bot || guildId != db_1.FrogDb.principalServerId)
        return;
    if (channelId != '1053404146839081150')
        return;
    if (channel.type == discord_js_1.ChannelType.GuildText) {
        const announcementChannel = (_a = client.guilds.cache.get(db_1.FrogDb.serverId)) === null || _a === void 0 ? void 0 : _a.channels.cache.find(f => f.name == channel.name);
        if (announcementChannel === null || announcementChannel === void 0 ? void 0 : announcementChannel.isTextBased()) {
            announcementChannel.send({ content: msg.content + "\n<@&1053391025906921472>", files: msg.attachments.map(a => a) });
        }
    }
}
exports.Announcements = Announcements;
