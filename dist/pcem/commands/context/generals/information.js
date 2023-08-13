"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContextMenu = exports.userCmcb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
exports.userCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName("Information")
    .setNameLocalization('es-ES', 'Información')
    .setType(2);
const userContextMenu = async (int) => {
    const { guild, user } = int, author = guild?.members.cache.get(user.id);
    const member = guild?.members.cache.get(int.targetId);
    if (!member)
        return;
    await int.deferReply();
    const usuarioEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL() })
        .setTitle(`Información de ${member?.user.tag}`)
        .setThumbnail(member?.displayAvatarURL({ size: 2048 }) || null)
        .addFields({ name: "**📅 Creo la cuenta:**", value: `<t:${Math.round(member.user.createdAt.valueOf() / 1000)}:R>`, inline: true }, { name: "**📥 Se unió:**", value: `<t:${Math.round((member.joinedAt?.valueOf() || 0) / 1000)}:R>`, inline: true })
        .setColor(guild?.members.me?.displayHexColor || 'White')
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [usuarioEb] });
};
exports.userContextMenu = userContextMenu;
