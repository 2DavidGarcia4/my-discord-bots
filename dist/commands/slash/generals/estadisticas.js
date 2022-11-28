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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estadisticasSlashCommand = exports.estadisticasScb = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.estadisticasScb = new discord_js_1.SlashCommandBuilder()
    .setName("estadísticas")
    .setDescription(`📊 Muestra estadísticas del servidor.`).toJSON();
const estadisticasSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const dataAli = yield models_1.alliancesModel.findById(db_1.botDB.serverId);
    const dataSug = yield models_1.suggestionsModel.findById(db_1.botDB.serverId);
    yield int.deferReply();
    __1.estadisticas.comandos++;
    if (!dataAli || !dataSug)
        return;
    let alianzas = 0;
    for (let i = 0; i < dataAli.miembros.length; i++) {
        alianzas += dataAli.miembros[i].cantidad;
    }
    const estadisticasEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
        .setTitle("📊 Estadísticas")
        .setDescription(`Estadísticas por información recolectada hace ${(0, ms_1.default)(client.uptime || 0)}.`)
        .addFields({ name: `👤 **Miembros:**`, value: `${(_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.size.toLocaleString()}`, inline: true }, { name: `📑 **Canales:**`, value: `${(_b = int.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.size.toLocaleString()}`, inline: true }, { name: `📌 **Roles:**`, value: `${(_c = int.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.size.toLocaleString()}`, inline: true }, { name: `🤝 **Alianzas:**`, value: `Creadas: ${alianzas.toLocaleString()}`, inline: true }, { name: `🗳️ **Sugerencias: ${dataSug.sugerencias.cantidad}**`, value: `aceptadas: **${dataSug.sugerencias.aceptadas}**\ndenegadas: **${dataSug.sugerencias.denegadas}**\nimplementadas: **${dataSug.sugerencias.implementadas}**\nen progreso: **${dataSug.sugerencias.en_progreso}**\nno sucederán: **${dataSug.sugerencias.no_sucedera}**`, inline: true }, { name: `\u200B`, value: `Estadísticas por información recolectada hace ${(0, ms_1.default)(client.uptime || 0)}.`, inline: false }, { name: `🪄 **Comandos usados:**`, value: `${__1.estadisticas.comandos.toLocaleString()}`, inline: true }, { name: `📨 **Mensajes:**`, value: `${__1.estadisticas.mensajes.toLocaleString()}`, inline: true }, { name: `📥 **Entradas:**`, value: `${__1.estadisticas.entradas.toLocaleString()}`, inline: true }, { name: `📤 **Salidas:**`, value: `${__1.estadisticas.salidas.toLocaleString()}`, inline: true }, { name: `📝 **Postulaciones:**`, value: `Cerradas`, inline: true })
        .setColor(((_e = (_d = int.guild) === null || _d === void 0 ? void 0 : _d.members.me) === null || _e === void 0 ? void 0 : _e.displayHexColor) || 'White')
        .setFooter({ text: ((_f = int.guild) === null || _f === void 0 ? void 0 : _f.name) || 'undefined', iconURL: ((_g = int.guild) === null || _g === void 0 ? void 0 : _g.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [estadisticasEb] });
});
exports.estadisticasSlashCommand = estadisticasSlashCommand;
