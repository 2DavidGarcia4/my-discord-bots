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
exports.ayudaSlashCommand = exports.ayudaScb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const db_1 = require("../../../db");
const functions_1 = require("../../../../utils/functions");
exports.ayudaScb = new discord_js_1.SlashCommandBuilder()
    .setName("ayuda")
    .setDescription(`✋ ¿Necesitas ayuda o estas perdido/a?, te muestra información que te puede ayudar.`).toJSON();
const ayudaSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const author = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(int.user.id);
    __1.estadisticas.comandos++;
    yield int.deferReply();
    const embAyuda = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${(author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username)}`, iconURL: int.user.displayAvatarURL() })
        .setThumbnail(((_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL()) || null)
        .setTitle(`Soy ${(_c = client.user) === null || _c === void 0 ? void 0 : _c.username}`)
        .setDescription(`**El bot de ${(_d = int.guild) === null || _d === void 0 ? void 0 : _d.name}**, ¿necesitas información o ayuda?`)
        .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." })
        .setColor(((_f = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.me) === null || _f === void 0 ? void 0 : _f.displayHexColor) || 'White')
        .setFooter({ text: ((_g = int.guild) === null || _g === void 0 ? void 0 : _g.name) || 'undefined', iconURL: ((_h = int.guild) === null || _h === void 0 ? void 0 : _h.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [embAyuda] });
});
exports.ayudaSlashCommand = ayudaSlashCommand;
