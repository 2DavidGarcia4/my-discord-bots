"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data_1 = require("../../data");
const functions_1 = require("../../../shared/functions");
const utils_1 = require("../../utils");
const __1 = require("../../..");
const PingScb = new discord_js_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription('🏓 My latency')
    .setDescriptionLocalization('es-ES', "🏓 Mi latencia")
    .toJSON();
class PingSlashCommand extends __1.SlashCommand {
    constructor() {
        super({
            struct: PingScb
        });
    }
    async execute(int, client) {
        const author = int.guild?.members.cache.get(int.user.id), { ws: { ping } } = client, { emoji } = data_1.botDB;
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
    }
}
exports.default = PingSlashCommand;
