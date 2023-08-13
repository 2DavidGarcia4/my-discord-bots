"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reglasSlashCommand = exports.reglasScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.reglasScb = new discord_js_1.SlashCommandBuilder()
    .setName("reglas")
    .setDescription(`📜 Te muestra las reglas del servidor.`).toJSON();
const reglasSlashCommand = async (int, client) => {
    const rules = await (0, utils_1.fetchServerRules)(client);
    await int.deferReply({ ephemeral: true });
    const embReglas = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: "📜 Reglas" })
        .setDescription(rules || '')
        .setColor(int.guild?.members.me?.displayHexColor || 'White')
        .setFooter({ text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [embReglas] });
};
exports.reglasSlashCommand = reglasSlashCommand;
