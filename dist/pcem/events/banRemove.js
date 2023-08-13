"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banRemoveEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const utils_1 = require("../utils");
const banRemoveEvent = async (gbr, client) => {
    if (gbr.guild.id != db_1.botDB.serverId)
        return;
    const dataBot = await (0, utils_1.getBotData)(client), channelLog = client.channels.cache.get(dataBot?.logs.unban || '');
    const embDesbaneado = new discord_js_1.EmbedBuilder()
        .setThumbnail(gbr.user.displayAvatarURL())
        .setTitle(`${db_1.botDB.emoji.afirmative} Usuario desbaneado`)
        .setDescription(`👤 ${gbr.user.tag}\n\n🆔 ${gbr.user.id}\n📄 ${gbr.reason || 'no encontre la razón'}`)
        .setColor(db_1.botDB.color.afirmative)
        .setFooter({ text: gbr.guild.name, iconURL: gbr.guild.iconURL() || undefined })
        .setTimestamp();
    if (channelLog?.type == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embDesbaneado] });
};
exports.banRemoveEvent = banRemoveEvent;
