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
exports.guildCreateEvent = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const guildCreateEvent = (guild, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const botData = yield (0, utils_1.getBotData)(client), channelLog = client.channels.cache.get((botData === null || botData === void 0 ? void 0 : botData.logs.guildCreate) || '');
    const owner = guild.members.cache.get(guild.ownerId);
    const guildRoles = guild.roles.cache.filter(f => !f.managed && f.id != guild.id).map(m => Object({ posicion: m.position, nombre: m.name })).slice(0, 10).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ");
    const invited = (yield guild.fetchAuditLogs({ limit: 1, type: discord_js_1.AuditLogEvent.BotAdd })).entries.first();
    const InvitedEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
        .setTitle(`👋 Hello ${(_a = invited === null || invited === void 0 ? void 0 : invited.executor) === null || _a === void 0 ? void 0 : _a.username}`)
        .setDescription('Thank you for inviting me to your server. I hope it will be useful to you.\nYou can use the </help:1075471229139550279> command to get more information about me and my commands.')
        .setColor('Yellow');
    (_c = client.users.cache.get(((_b = invited === null || invited === void 0 ? void 0 : invited.executor) === null || _b === void 0 ? void 0 : _b.id) || '')) === null || _c === void 0 ? void 0 : _c.send({ embeds: [InvitedEb] });
    const GuildCreateEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (owner === null || owner === void 0 ? void 0 : owner.user.tag) || '', iconURL: owner === null || owner === void 0 ? void 0 : owner.user.displayAvatarURL() })
        .setThumbnail(guild.iconURL({ size: 2048 }))
        .setImage(guild.bannerURL({ size: 2048 }))
        .setTitle("➕ Added on a new server")
        .setDescription(`${guild.name}\n${guild.description || '*No description*'}`)
        .setFields({ name: `<:wer:920166217086537739> **Guild:**`, value: `🆔 ID: ${guild.id}\n📅 Created at <t:${Math.floor(guild.createdAt.valueOf() / 1000)}:F> *(<t:${Math.floor(guild.createdAt.valueOf() / 1000)}:R>)*`, inline: true }, { name: `👥 **Members:** ${guild.members.cache.size.toLocaleString()}`, value: `👤 Users: ${guild.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true }, { name: `🌈 **Roles:** ${guild.roles.cache.size}`, value: `${guildRoles}`, inline: true }, { name: `📑 **Channels:** ${guild.channels.cache.size.toLocaleString()}`, value: `<:canaldetexto:904812801925738557> texto ${guild.channels.cache.filter(f => f.type == discord_js_1.ChannelType.GuildText).size}\n<:canaldevoz:904812835295596544> voz ${guild.channels.cache.filter(f => f.type == discord_js_1.ChannelType.GuildVoice).size}\n<:carpeta:920494540111093780> categorías ${guild.channels.cache.filter(f => f.type == discord_js_1.ChannelType.GuildCategory).size}`, inline: true }, { name: `👑 **Owner:**`, value: `${owner === null || owner === void 0 ? void 0 : owner.user.tag}\n🆔 ${owner === null || owner === void 0 ? void 0 : owner.id}`, inline: true }, { name: `🧑 **Invited by:**`, value: `${(_d = invited === null || invited === void 0 ? void 0 : invited.executor) === null || _d === void 0 ? void 0 : _d.tag}\n🆔 ${(_e = invited === null || invited === void 0 ? void 0 : invited.executor) === null || _e === void 0 ? void 0 : _e.id}`, inline: true }, { name: `🗒️ **Permissions:** ${(_f = guild.members.me) === null || _f === void 0 ? void 0 : _f.permissions.toArray().length}`, value: `${(_g = guild.members.me) === null || _g === void 0 ? void 0 : _g.permissions.toArray().map(m => m).join(", ")}`, inline: true })
        .setColor('Green')
        .setTimestamp();
    let invite;
    if ((_h = guild.members.me) === null || _h === void 0 ? void 0 : _h.permissions.has('ManageGuild')) {
        invite = (yield guild.invites.fetch()).filter(f => f.maxAge == 0).map(m => m.url).slice(0, 2).join("\n");
        if (invite.length <= 0) {
            invite = (yield guild.invites.fetch()).map(i => i.url).slice(0, 2).join("\n");
            if (invite.length <= 0) {
                invite = "There are no invites on the guild";
            }
        }
        if (GuildCreateEb.data.fields)
            GuildCreateEb.data.fields.splice(6, 0, {
                name: `📨 **Invitations:**`,
                value: `${(yield guild.invites.fetch()).size.toLocaleString()}`
            });
    }
    if (channelLog === null || channelLog === void 0 ? void 0 : channelLog.isTextBased())
        channelLog.send({ embeds: [GuildCreateEb], content: `${invite || `*I couldn't get any guild invite.*`}` });
});
exports.guildCreateEvent = guildCreateEvent;
