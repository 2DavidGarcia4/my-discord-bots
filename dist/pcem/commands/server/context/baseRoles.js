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
exports.rolesBaseContextMenu = exports.rolesBaseCmcb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const __1 = require("../../..");
const functions_1 = require("../../../../shared/functions");
exports.rolesBaseCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Roles base')
    .setType(2);
const rolesBaseContextMenu = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { guild, user, targetId } = int, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id), { mainRoles } = db_1.botDB;
    __1.svStatistics.commands++;
    const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(targetId);
    if (!member)
        return;
    yield int.deferReply({ ephemeral: true });
    const rolesBaseEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username) || 'undefined', iconURL: author === null || author === void 0 ? void 0 : author.displayAvatarURL() })
        .setTitle('🔁 Roles base')
        .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White')
        .setTimestamp();
    if (mainRoles.some(s => !member.roles.cache.has(s)) && !member.user.bot) {
        rolesBaseEb
            .setDescription(`Roles base agregados al miembro ${member}\n\n${mainRoles.filter(f => !member.roles.cache.has(f)).map(m => `<@&${m}>`).join(', ')}`);
        member.roles.add(mainRoles);
    }
    else {
        rolesBaseEb
            .setDescription(`Los roles base son los roles que se te otorgan al entrar al servidor, estos roles funcionan como separadores de otros roles y te identifican como miembro.\n\n${guild === null || guild === void 0 ? void 0 : guild.roles.cache.filter(f => mainRoles.some(s => s == f.id)).sort((a, b) => b.position - a.position).map(m => `**<@&${m.id}>**`).join('\n')}`);
    }
    (0, functions_1.sendMessageSlash)(int, { embeds: [rolesBaseEb] });
});
exports.rolesBaseContextMenu = rolesBaseContextMenu;
