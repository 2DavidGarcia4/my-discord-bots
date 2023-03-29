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
exports.rulesCommand = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../utils/functions");
const rulesCommand = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const rules = yield (0, functions_1.getRules)(client, 'es');
    const RulesEb = new discord_js_1.EmbedBuilder()
        .setTitle('📖 Reglas')
        .setDescription(rules || '')
        .setFooter({ text: "you don't speak Spanish?, Click blue button below" })
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    const RulesArb = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('en-rules-btn')
        .setEmoji('👅')
        .setLabel('English')
        .setStyle(discord_js_1.ButtonStyle.Primary));
    msg.channel.send({ embeds: [RulesEb], components: [RulesArb] });
});
exports.rulesCommand = rulesCommand;
