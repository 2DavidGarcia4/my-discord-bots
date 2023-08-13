"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = exports.statsCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const message_1 = require("../../../events/message");
const utils_1 = require("../../../utils");
exports.name = 'stats';
const statsCommand = (msg, client) => {
    const { member, author, guild, } = msg;
    let textCh = client.channels.cache.filter(ft => ft.type == discord_js_1.ChannelType.GuildText).size, voiseCH = client.channels.cache.filter(fv => fv.type == discord_js_1.ChannelType.GuildVoice).size, cateCh = client.channels.cache.filter(fc => fc.type == discord_js_1.ChannelType.GuildCategory).size;
    let ping = client.ws.ping <= 60 ? "<:30ms:917227036890791936>" : client.ws.ping > 60 && client.ws.ping < 120 ? "<:60ms:917227058399162429>" : client.ws.ping > 120 ? "<:150ms:917227075243503626>" : "*error*";
    msg.channel.sendTyping();
    const StatsEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: member?.nickname || author.username, iconURL: member?.displayAvatarURL() })
        .setTitle("<:grafica:958856872981585981> Estadísticas")
        .setFields({ name: "<:wer:920166217086537739> **Servidores:**", value: `${client.guilds.cache.size.toLocaleString()}`, inline: true }, { name: "📑 **Comandos:**", value: `${message_1.textCommands.size}`, inline: true }, { name: "<:cronometro:948693729588441149> **Uptime:**", value: `${(0, ms_1.default)(client.uptime || 0)}`, inline: true }, { name: `${ping} **Ping:**`, value: `${client.ws.ping} ms`, inline: true }, { name: "🔢 **Usos de comandos:**", value: `${db_1.botDB.usedCommands.toLocaleString()}`, inline: true }, { name: `😀 **Emojis:** ${client.emojis.cache.size.toLocaleString()}`, value: `${client.emojis.cache.filter(fn => !fn.animated).size.toLocaleString()} normales\n${client.emojis.cache.filter(fa => fa.animated).size.toLocaleString()} animados`, inline: true }, { name: `👥 **Usuarios: ${client.users.cache.size.toLocaleString()}**`, value: `👤 ${client.users.cache.filter(fu => !fu.bot).size.toLocaleString()} miembros\n🤖 ${client.users.cache.filter(fb => fb.bot).size.toLocaleString()} bots`, inline: true }, { name: ` **Canales: ${(textCh + voiseCH + cateCh).toLocaleString()}**`, value: `<:canaldetexto:904812801925738557> ${textCh.toLocaleString()} texto\n <:canaldevoz:904812835295596544> ${voiseCH.toLocaleString()} voz\n<:carpeta:920494540111093780> ${cateCh.toLocaleString()} categorías`, inline: true })
        .setColor((0, utils_1.getEmbedColor)(msg.guild))
        .setFooter({ text: guild?.name || '', iconURL: guild?.iconURL() || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageText)(msg, { embeds: [StatsEb] });
};
exports.statsCommand = statsCommand;
exports.alias = ['estadísticas', 'estadisticas'];
