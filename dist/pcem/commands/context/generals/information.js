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
exports.userContextMenu = exports.userCmcb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
exports.userCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName("Information")
    .setNameLocalization('es-ES', 'Información')
    .setType(2);
const userContextMenu = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { guild, user } = int, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(int.targetId);
    if (!member)
        return;
    yield int.deferReply();
    const usuarioEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username) || 'undefined', iconURL: author === null || author === void 0 ? void 0 : author.displayAvatarURL() })
        .setTitle(`Información de ${member === null || member === void 0 ? void 0 : member.user.tag}`)
        .setThumbnail((member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 2048 })) || null)
        .addFields({ name: "**📅 Creo la cuenta:**", value: `<t:${Math.round(member.user.createdAt.valueOf() / 1000)}:R>`, inline: true }, { name: "**📥 Se unió:**", value: `<t:${Math.round((((_a = member.joinedAt) === null || _a === void 0 ? void 0 : _a.valueOf()) || 0) / 1000)}:R>`, inline: true })
        .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [usuarioEb] });
});
exports.userContextMenu = userContextMenu;
