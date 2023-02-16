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
exports.examenSlashCommand = exports.examenScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
exports.examenScb = new discord_js_1.SlashCommandBuilder()
    .setName("examen")
    .setDescription(`📋 Examen para ser ayudante.`).toJSON();
const examenSlashCommand = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { emoji, color } = db_1.botDB, author = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(int.user.id);
    yield int.deferReply();
    const examenEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username) || 'undefined', iconURL: int.user.displayAvatarURL() })
        .setTitle(`${emoji.staff} Examen para ser **Ayudante**`)
        .setDescription(`\`\`1.\`\` ¿Cuál es tu edad?\n\`\`2.\`\` ¿Por que quieres ser ayudante?\n\`\`3.\`\` ¿Cuánto tiempo le dedicarías al servidor?\n\`\`4.\`\` ¿Serias activo en el chat?\n\`\`5.\`\` ¿Que harías si miras a un Mod/Admi abusando de su rango?\n\`\`6.\`\` ¿Sabes bien la información de los roles/canales del servidor?\n\`\`7.\`\` Al estar en una situación difícil de controlar. ¿Qué harías?\n\`\`8.\`\` ¿Tienes paciencia?\n\`\`9.\`\` ¿Estas comprometido/a en que una ves siendo staff todo lo que mires se quedara solo en el grupo del staff?\n\`\`10.\`\` ¿Cómo ayudarías/Guiarías a un usuario?\n\`\`11.\`\` ¿Tienes experiencia siendo helper/ayudante?\n\`\`12.\`\` ¿Cómo conociste este server?\n\`\`13.\`\` ¿Cuál es tu pasado en Discord?\n\`\`14.\`\` ¿Alguna vez formaste parte de una squad o raideaste?\n\`\`15.\`\` Para ti, ¿De que se encarga un helper/ayudante?\n\n<:Pikachu_Feliz:925799716585881640> **Recuerda lo que aquí más importa es tu sinceridad, honestidad y conocimiento.** <:Pikachu_Feliz:925799716585881640>`)
        .setColor(((_c = (_b = int.guild) === null || _b === void 0 ? void 0 : _b.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White')
        .setFooter({ text: ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.name) || 'undefined', iconURL: ((_e = int.guild) === null || _e === void 0 ? void 0 : _e.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [examenEb] });
});
exports.examenSlashCommand = examenSlashCommand;
