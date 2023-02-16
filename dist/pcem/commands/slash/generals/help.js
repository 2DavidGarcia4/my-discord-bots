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
exports.helpSlashCommand = exports.helpScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
exports.helpScb = new discord_js_1.SlashCommandBuilder()
    .setName("help")
    .setNameLocalization('es-ES', 'ayuda')
    .setDescription(`👋 Do you need help? I can help you.`)
    .setDescriptionLocalization('es-ES', '👋 ¿Necesitas ayuda?, te puedo ayudar')
    .toJSON();
const helpSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const author = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(int.user.id);
    yield int.deferReply();
    const HelpEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${(author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username)}`, iconURL: int.user.displayAvatarURL() })
        .setTitle(`Soy **${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username}** Bot multi funcional`)
        .setThumbnail(((_c = client.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL()) || null)
        .setTimestamp();
    if (int.guildId == db_1.botDB.serverId) {
        HelpEb
            .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
            .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." });
    }
    else {
        HelpEb
            .setDescription(`[📨 **Invítame a tu servidor**](${'invitacion'})\n[🔧 **Servidor de soporte**](${db_1.botDB.serverInvite})`);
    }
    (0, functions_1.sendMessageSlash)(int, { embeds: [HelpEb] });
});
exports.helpSlashCommand = helpSlashCommand;
