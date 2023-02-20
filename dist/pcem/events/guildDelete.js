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
exports.guildDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const guildDeleteEvent = (guild, client) => __awaiter(void 0, void 0, void 0, function* () {
    const botData = yield (0, utils_1.getBotData)(client);
    const owner = guild.members.cache.get(guild.ownerId), channelLog = client.channels.cache.get((botData === null || botData === void 0 ? void 0 : botData.logs.guildDelete) || '');
    const guildRoles = guild.roles.cache.filter(f => !f.managed && f.id != guild.id).map(m => ({ posicion: m.position, nombre: m.name })).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ");
    const GuildDeleteEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (owner === null || owner === void 0 ? void 0 : owner.user.tag) || '', iconURL: owner === null || owner === void 0 ? void 0 : owner.user.displayAvatarURL() })
        .setThumbnail(guild.iconURL({ size: 2048 }))
        .setImage(guild.bannerURL({ size: 2048 }))
        .setTitle("➖ Kicked from a server")
        .setDescription(`${guild.name}\n${guild.description || '*No description*'}`)
        .setFields({ name: `<:wer:920166217086537739> **Guild:**`, value: `🆔 ID: ${guild.id}\n📅 Created at <t:${Math.floor(guild.createdAt.valueOf() / 1000)}:F> *(<t:${Math.floor(guild.createdAt.valueOf() / 1000)}:R>)*`, inline: true }, { name: `👥 **Members:** ${guild.members.cache.size.toLocaleString()}`, value: `👤 Users: ${guild.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true }, { name: `🌈 **Roles:** ${guild.roles.cache.size}`, value: `${guildRoles}`, inline: true }, { name: `👑 **Owner:**`, value: `${owner === null || owner === void 0 ? void 0 : owner.user.tag}\n🆔 ${owner === null || owner === void 0 ? void 0 : owner.id}` })
        .setColor('Red')
        .setTimestamp();
    if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
        channelLog.send({ embeds: [GuildDeleteEb] });
});
exports.guildDeleteEvent = guildDeleteEvent;
