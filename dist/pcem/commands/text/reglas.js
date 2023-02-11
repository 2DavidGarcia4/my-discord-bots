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
const __1 = require("../..");
const utils_1 = require("../../utils");
const rulesCommand = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const rules = yield (0, utils_1.fetchServerRules)(client);
    const RulesEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: "📜 Reglas" })
        .setDescription(rules || '')
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
        .setFooter({ text: 'En caso de tener alguna duda abrir un ticket o mencionar a un miembro del equipo de soporte.', iconURL: ((_c = msg.guild) === null || _c === void 0 ? void 0 : _c.iconURL()) || undefined })
        .setTimestamp();
    msg.channel.send({ embeds: [RulesEb] }).then(() => {
        __1.exemptMessagesIds.push(msg.id);
        setTimeout(() => msg.delete(), 2000);
    });
});
exports.rulesCommand = rulesCommand;
