"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesBaseContextMenu = exports.rolesBaseCmcb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const __1 = require("../../..");
const functions_1 = require("../../../../shared/functions");
exports.rolesBaseCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Roles base')
    .setType(2);
const rolesBaseContextMenu = async (int) => {
    const { guild, user, targetId } = int, author = guild?.members.cache.get(user.id), { mainRoles } = db_1.botDB;
    __1.svStatistics.commands++;
    const member = guild?.members.cache.get(targetId);
    if (!member)
        return;
    await int.deferReply({ ephemeral: true });
    const rolesBaseEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL() })
        .setTitle('🔁 Roles base')
        .setColor(guild?.members.me?.displayHexColor || 'White')
        .setTimestamp();
    if (mainRoles.some(s => !member.roles.cache.has(s)) && !member.user.bot) {
        rolesBaseEb
            .setDescription(`Roles base agregados al miembro ${member}\n\n${mainRoles.filter(f => !member.roles.cache.has(f)).map(m => `<@&${m}>`).join(', ')}`);
        member.roles.add(mainRoles);
    }
    else {
        rolesBaseEb
            .setDescription(`Los roles base son los roles que se te otorgan al entrar al servidor, estos roles funcionan como separadores de otros roles y te identifican como miembro.\n\n${guild?.roles.cache.filter(f => mainRoles.some(s => s == f.id)).sort((a, b) => b.position - a.position).map(m => `**<@&${m.id}>**`).join('\n')}`);
    }
    (0, functions_1.sendMessageSlash)(int, { embeds: [rolesBaseEb] });
};
exports.rolesBaseContextMenu = rolesBaseContextMenu;
