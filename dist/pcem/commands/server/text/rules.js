"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rulesCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const utils_1 = require("../../../utils");
exports.name = "reglas";
const rulesCommand = async (msg, client) => {
    if (!msg.member?.permissions.has('Administrator'))
        return;
    const rules = await (0, utils_1.fetchServerRules)(client);
    const RulesEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: "📜 Reglas" })
        .setDescription(rules || '')
        .setColor(msg.guild?.members.me?.displayHexColor || 'White')
        .setFooter({ text: 'En caso de tener alguna duda abrir un ticket o mencionar a un miembro del equipo de soporte.', iconURL: msg.guild?.iconURL() || undefined })
        .setTimestamp();
    msg.channel.send({ embeds: [RulesEb] }).then(() => {
        __1.exemptMessagesIds.push(msg.id);
        setTimeout(() => msg.delete(), 2000);
    });
};
exports.rulesCommand = rulesCommand;
