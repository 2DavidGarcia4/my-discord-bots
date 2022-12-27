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
exports.sugerirSlashCommand = exports.sugerirScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../utils/functions");
const __1 = require("../../..");
exports.sugerirScb = new discord_js_1.SlashCommandBuilder()
    .setName("sugerir")
    .setDescription(`✉️ Has una sugerencia para el servidor.`)
    .addStringOption(suggestion => suggestion.setName("sugerencia")
    .setDescription(`📝 Escribe tu sugerencia.`)
    .setRequired(true)).toJSON();
const sugerirSlashCommand = (int) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, options } = int, { emoji, serverId } = db_1.botDB;
    __1.estadisticas.comandos++;
    if (__1.coolSugerencias.some(s => s == int.user.id))
        (0, functions_1.setSlashError)(int, `Espera **10** minutos para volver a usar el comando.`);
    const dataSug = yield models_1.suggestionsModel.findById(serverId), arrayMsgsSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes, suggestion = options.getString('sugerencia', true);
    arrayMsgsSug === null || arrayMsgsSug === void 0 ? void 0 : arrayMsgsSug.push({ id: "", origenID: "", autorID: user.id, sugerencia: suggestion, estado: "normal", positivas: 0, negativas: 0 });
    const SuggestionEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
        .setTitle(`${emoji.negative} ¿Estas seguro de enviar esa sugerencia?`)
        .addFields({ name: `📃 **Tu sugerencia:**`, value: `${suggestion}` })
        .setColor('Yellow');
    yield int.deferReply({ ephemeral: true });
    const SuggestionBtns = new discord_js_1.ActionRowBuilder()
        .addComponents([
        new discord_js_1.ButtonBuilder()
            .setCustomId("confirmar")
            .setEmoji(emoji.afirmative)
            .setLabel("Confirmar")
            .setStyle(discord_js_1.ButtonStyle.Success),
        new discord_js_1.ButtonBuilder()
            .setCustomId("cancelar")
            .setEmoji(emoji.negative)
            .setLabel("Cancelar")
            .setStyle(discord_js_1.ButtonStyle.Danger)
    ]);
    (0, functions_1.sendMessageSlash)(int, { embeds: [SuggestionEb], components: [SuggestionBtns] });
    yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: arrayMsgsSug });
    (0, __1.addUserIdCoolSug)(user.id);
    setTimeout(() => {
        for (let i = 0; i < __1.coolSugerencias.length; i++) {
            if (__1.coolSugerencias[i] == int.user.id) {
                __1.coolSugerencias.splice(i, 1);
            }
        }
    }, 10 * 60000);
});
exports.sugerirSlashCommand = sugerirSlashCommand;
