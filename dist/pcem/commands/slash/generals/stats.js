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
exports.statsSlashCommand = exports.statsScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const interaction_1 = require("../../../events/interaction");
const utils_1 = require("../../../utils");
exports.statsScb = new discord_js_1.SlashCommandBuilder()
    .setName("stats")
    .setNameLocalization('es-ES', 'estadísticas')
    .setDescription('📊 Show bot statistics')
    .setDescriptionLocalization('es-ES', `📊 Muestra estadísticas del bot.`).toJSON();
const statsSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild, user, locale } = int, isEnglish = locale == 'en-US';
    const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    yield int.deferReply();
    const { emoji } = db_1.botDB, { ws: { ping }, uptime } = client;
    const latency = ping <= 60 ? emoji.ping30ms : ping <= 120 ? emoji.ping60ms : emoji.ping100ms;
    const textCh = client.channels.cache.filter(ft => ft.type == discord_js_1.ChannelType.GuildText).size, voiseCH = client.channels.cache.filter(fv => fv.type == discord_js_1.ChannelType.GuildVoice).size, cateCh = client.channels.cache.filter(fc => fc.type == discord_js_1.ChannelType.GuildCategory).size;
    const StatsEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: author === null || author === void 0 ? void 0 : author.displayAvatarURL() })
        .setTitle(`<:grafica:958856872981585981> ${isEnglish ? 'Stats' : 'Estadísticas'}`)
        .setFields({ name: `<:wer:920166217086537739> **${isEnglish ? 'Servers' : 'Servidores'}:**`, value: `${client.guilds.cache.size.toLocaleString()}`, inline: true }, { name: `📑 **${isEnglish ? 'Commands' : 'Comandos'}:**`, value: `${interaction_1.interactionCommands.size}`, inline: true }, { name: "<:cronometro:948693729588441149> **Uptime:**", value: `<t:${Math.floor(Math.floor(Date.now() - (uptime || 1000)) / 1000)}:R>`, inline: true }, { name: `${latency} **Ping:**`, value: `${ping} ms`, inline: true }, { name: `🔢 **${isEnglish ? 'Commands uses' : 'Usos de comandos'}:**`, value: `${db_1.botDB.usedCommands.toLocaleString()}`, inline: true }, { name: `😀 **Emojis:** ${client.emojis.cache.size.toLocaleString()}`, value: `${client.emojis.cache.filter(fn => !fn.animated).size.toLocaleString()} ${isEnglish ? 'normals' : 'normales'}\n${client.emojis.cache.filter(fa => fa.animated).size.toLocaleString()} ${isEnglish ? 'animated' : 'animados'}`, inline: true }, { name: `👥 **${isEnglish ? 'Users' : 'Usuarios'}: ${client.users.cache.size.toLocaleString()}**`, value: `👤 ${client.users.cache.filter(fu => !fu.bot).size.toLocaleString()} ${isEnglish ? 'members' : 'miembros'}\n🤖 ${client.users.cache.filter(fb => fb.bot).size.toLocaleString()} bots`, inline: true }, { name: ` **${isEnglish ? 'Channels' : 'Canales'}: ${(textCh + voiseCH + cateCh).toLocaleString()}**`, value: `<:canaldetexto:904812801925738557> ${textCh.toLocaleString()} ${isEnglish ? 'text' : 'texto'}\n <:canaldevoz:904812835295596544> ${voiseCH.toLocaleString()} ${isEnglish ? 'voice' : 'voz'}\n<:carpeta:920494540111093780> ${cateCh.toLocaleString()} ${isEnglish ? 'categories' : 'categorías'}`, inline: true })
        .setColor((0, utils_1.getEmbedColor)(guild))
        .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || '', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [StatsEb] });
});
exports.statsSlashCommand = statsSlashCommand;
