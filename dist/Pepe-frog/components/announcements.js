"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcements = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const notion_1 = require("../lib/notion");
async function Announcements(msg, client) {
    const { channel, channelId, guildId } = msg;
    if (msg.author.bot || guildId != db_1.FrogDb.backupServerId)
        return;
    const { channels, roles } = await (0, notion_1.getSnackData)();
    if (channelId != channels.announcements)
        return;
    if (channel.type == discord_js_1.ChannelType.GuildText) {
        const announcementChannel = client.guilds.cache.get(db_1.FrogDb.serverId)?.channels.cache.find(f => f.name == channel.name);
        if (announcementChannel?.isTextBased()) {
            announcementChannel.send({ content: msg.content + `\n<@&${roles.announcement}>`, files: msg.attachments.map(a => a) });
        }
    }
}
exports.Announcements = Announcements;
