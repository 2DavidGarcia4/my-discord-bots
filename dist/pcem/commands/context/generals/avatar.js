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
exports.avatarContextMenu = exports.avatarCmcb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
exports.avatarCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('avatar')
    .setType(2);
const avatarContextMenu = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { targetId, guild, locale } = int, isEnglish = locale == 'en-US', author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(targetId);
    const url = (author === null || author === void 0 ? void 0 : author.displayAvatarURL({ size: 2048, extension: ((_a = author === null || author === void 0 ? void 0 : author.avatar) === null || _a === void 0 ? void 0 : _a.includes('a_')) ? 'gif' : 'png' })) || '';
    const authorName = (author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username);
    yield int.deferReply();
    const AvatarEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (isEnglish ? `${authorName} avatar` : `Avatar de ${authorName}`) })
        .setTitle('🔗 Url')
        .setURL(url)
        .setImage(url)
        .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [AvatarEb] });
});
exports.avatarContextMenu = avatarContextMenu;
