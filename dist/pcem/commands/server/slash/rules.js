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
exports.reglasSlashCommand = exports.reglasScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.reglasScb = new discord_js_1.SlashCommandBuilder()
    .setName("reglas")
    .setDescription(`📜 Te muestra las reglas del servidor.`).toJSON();
const reglasSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const rules = yield (0, utils_1.fetchServerRules)(client);
    yield int.deferReply({ ephemeral: true });
    const embReglas = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: "📜 Reglas" })
        .setDescription(rules || '')
        .setColor(((_b = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
        .setFooter({ text: ((_c = int.guild) === null || _c === void 0 ? void 0 : _c.name) || 'undefined', iconURL: ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [embReglas] });
});
exports.reglasSlashCommand = reglasSlashCommand;
