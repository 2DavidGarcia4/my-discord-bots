"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingSlashCommand = exports.pingScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.pingScb = new discord_js_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription('🏓 My latency')
    .setDescriptionLocalization('es-ES', "🏓 Mi latencia").toJSON();
const pingSlashCommand = async (int, client) => {
    const author = int.guild?.members.cache.get(int.user.id), { ws: { ping } } = client, { emoji } = db_1.botDB;
    const latency = ping <= 60 ? emoji.ping30ms : ping <= 120 ? emoji.ping60ms : emoji.ping100ms;
    await int.deferReply();
    const embPing = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL() })
        .setTitle("🏓 Pong")
        .setDescription(`${latency} ${client.ws.ping} ms`)
        .setColor((0, utils_1.getEmbedColor)(int.guild))
        .setFooter({ text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [embPing] });
};
exports.pingSlashCommand = pingSlashCommand;
