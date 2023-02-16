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
exports.warnSlashCommand = exports.warnScb = void 0;
const discord_js_1 = require("discord.js");
exports.warnScb = new discord_js_1.SlashCommandBuilder()
    .setName('warn')
    .setNameLocalization('es-ES', 'advertir')
    .setDescription('⚠️ Warn a member from the server.')
    .setDescriptionLocalization('es-ES', '⚠️ Advertir a un miembro del servidor.')
    .addUserOption(member => member.setName('member')
    .setNameLocalization('es-ES', 'miembro')
    .setDescription(`🧑 Provide the member to be warn.`)
    .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro a advertir.`)
    .setRequired(true))
    .addStringOption(reazon => reazon.setName('reazon')
    .setNameLocalization('es-ES', 'razón')
    .setDescription(`📝 Provide the reason why you will warn the member.`)
    .setDescriptionLocalization('es-ES', `📝 Proporciona la razón por la que advertiras al miembro.`)
    .setRequired(true))
    .addAttachmentOption(image => image.setName('image')
    .setNameLocalization('es-ES', 'imagen')
    .setDescription('🖼️ Image of evidence')
    .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
    .setRequired(false))
    .toJSON();
const warnSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    int.reply({ ephemeral: true, content: 'Developing' });
});
exports.warnSlashCommand = warnSlashCommand;
