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
exports.pingSlashCommand = exports.pingScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.pingScb = new discord_js_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription('🏓 My latency')
    .setDescriptionLocalization('es-ES', "🏓 Mi latencia").toJSON();
const pingSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const author = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(int.user.id), { ws: { ping } } = client, { emoji } = db_1.botDB;
    const latency = ping <= 60 ? emoji.ping30ms : ping <= 120 ? emoji.ping60ms : emoji.ping100ms;
    yield int.deferReply();
    const embPing = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username) || 'undefined', iconURL: author === null || author === void 0 ? void 0 : author.displayAvatarURL() })
        .setTitle("🏓 Pong")
        .setDescription(`${latency} ${client.ws.ping} ms`)
        .setColor((0, utils_1.getEmbedColor)(int.guild))
        .setFooter({ text: ((_b = int.guild) === null || _b === void 0 ? void 0 : _b.name) || 'undefined', iconURL: ((_c = int.guild) === null || _c === void 0 ? void 0 : _c.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [embPing] });
});
exports.pingSlashCommand = pingSlashCommand;
