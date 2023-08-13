"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banAddEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const utils_1 = require("../utils");
const banAddEvent = async (gba, client) => {
    if (gba.guild.id != db_1.botDB.serverId)
        return;
    const dataBot = await (0, utils_1.getBotData)(client), channelLog = client.channels.cache.get(dataBot?.logs.ban || '');
    const embBaneado = new discord_js_1.EmbedBuilder()
        .setThumbnail(gba.user.displayAvatarURL())
        .setTitle(`${db_1.botDB.emoji.negative} Usuario baneado`)
        .setDescription(`👤 ${gba.user.tag}\n\n🆔 ${gba.user.id}\n\n📝 Razon: ${(await gba.guild.bans.fetch()).filter(fb => fb.user.id === gba.user.id).map(mb => mb.reason)}`)
        .setColor(db_1.botDB.color.negative)
        .setFooter({ text: gba.guild.name, iconURL: gba.guild.iconURL() || undefined })
        .setTimestamp();
    if (channelLog?.type == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embBaneado] });
};
exports.banAddEvent = banAddEvent;
