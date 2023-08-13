"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRemoveEvent = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const db_1 = require("../db");
const utils_1 = require("../utils");
const memberRemoveEvent = async (gmr, client) => {
    const { color, serverId } = db_1.botDB;
    if (gmr.guild.id != serverId)
        return;
    __1.svStatistics.leaves++;
    const dataBot = await (0, utils_1.getBotData)(client);
    if (!dataBot)
        return;
    const leaveLog = client.channels.cache.get(dataBot.logs.exit);
    if (leaveLog?.type != discord_js_1.ChannelType.GuildText)
        return;
    const leaveLogEb = new discord_js_1.EmbedBuilder()
        .setTimestamp();
    if (gmr.user.bot) {
        leaveLogEb
            .setTitle("🤖 Se fue un bot")
            .setThumbnail(gmr.displayAvatarURL())
            .setDescription(`${gmr}\n${gmr.user.tag}\nSeunio: <t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`)
            .setColor('Orange');
    }
    else {
        const mbanner = await client.users.fetch(gmr.id, { force: true });
        leaveLogEb
            .setAuthor({ name: gmr.user.username, iconURL: gmr.user.displayAvatarURL({ size: 2048 }) })
            .setThumbnail(gmr.user.displayAvatarURL())
            .setImage(mbanner.bannerURL({ size: 2048 }) || null)
            .setTitle("📤 Se fue un miembro")
            .setDescription(`Se fue ${gmr}\n📥 **Se únio:**\n<t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`)
            .setColor(color.negative)
            .setFooter({ text: gmr.guild.name, iconURL: gmr.guild.iconURL() || undefined });
        leaveLog.send({ embeds: [leaveLogEb] });
    }
};
exports.memberRemoveEvent = memberRemoveEvent;
