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
exports.marcarSlashCommadn = exports.marcarScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const __1 = require("../../..");
const functions_1 = require("../../../utils/functions");
exports.marcarScb = new discord_js_1.SlashCommandBuilder()
    .setName("marcar")
    .setDescription(`🚥 Marca el estado de una sugerencia (implementada, en progreso, no sucederá).`)
    .addStringOption(suggestionId => suggestionId.setName(`id`)
    .setDescription(`🆔 Proporciona la ID del mensaje de la sugerencia que quieres marcar.`)
    .setRequired(true)).toJSON();
const marcarSlashCommadn = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { guild, user, options } = int, { serverId } = db_1.botDB;
    __1.estadisticas.comandos++;
    const dataSug = yield models_1.suggestionsModel.findById(serverId), arrayMsgSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes, messageId = options.getString("id"), suggestionsChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get('828300239488024587');
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(!(arrayMsgSug === null || arrayMsgSug === void 0 ? void 0 : arrayMsgSug.some(s => s.id == messageId))),
            `La **ID** que has proporcionado *(${messageId})* no pertenece a la de ninguna sugerencia que este en la base de datos.`
        ],
        [
            Boolean(!((suggestionsChannel === null || suggestionsChannel === void 0 ? void 0 : suggestionsChannel.type) == discord_js_1.ChannelType.GuildText ? suggestionsChannel.messages.cache.get(messageId || '') : false)),
            `No se encontró ninguna sugerencia con la id *${messageId}* que has proporcionado.`
        ]
    ]))
        return;
    yield int.deferReply({ ephemeral: true });
    const MarcarEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
        .setTitle("🚥 Marca la sugerencia con un estado")
        .setDescription(`Elije un estado para marcar la sugerencia.\n\n🟢 **Implementada:** Esto significara que la sugerencia ha sido implementada al servidor.\n🟡 **en progreso:** Esto significara que la sugerencias esta en progreso de implementación.\n🔴 **no sucedera:** Esto significa que la sugerencia tubo varios votos negativos y por lo tanto nunca se implementara.\n🔵 **normal:** Este estado pone la sugerencia como predeterminado.`)
        .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White')
        .setTimestamp();
    const MarcarBtns = new discord_js_1.ActionRowBuilder()
        .addComponents([
        new discord_js_1.ButtonBuilder()
            .setCustomId("implementada")
            .setEmoji("🟢")
            .setLabel("Implementada")
            .setStyle(discord_js_1.ButtonStyle.Success),
        new discord_js_1.ButtonBuilder()
            .setCustomId("en progreso")
            .setEmoji("🟡")
            .setLabel("En progreso")
            .setStyle(discord_js_1.ButtonStyle.Secondary),
        new discord_js_1.ButtonBuilder()
            .setCustomId("no sucedera")
            .setEmoji("🔴")
            .setLabel("No sucederá")
            .setStyle(discord_js_1.ButtonStyle.Danger),
        new discord_js_1.ButtonBuilder()
            .setCustomId("normal")
            .setEmoji("🔵")
            .setLabel("Normal")
            .setStyle(discord_js_1.ButtonStyle.Primary)
    ]);
    (0, functions_1.sendMessageSlash)(int, { embeds: [MarcarEb], components: [MarcarBtns] });
    (0, __1.addDataMarcar)({ autorID: user.id, sugID: messageId || '' });
});
exports.marcarSlashCommadn = marcarSlashCommadn;
