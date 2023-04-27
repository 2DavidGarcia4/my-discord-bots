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
exports.memberRemoveEvent = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const db_1 = require("../db");
const utils_1 = require("../utils");
const memberRemoveEvent = (gmr, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { color, serverId } = db_1.botDB;
    if (gmr.guild.id != serverId)
        return;
    __1.svStatistics.leaves++;
    const dataBot = yield (0, utils_1.getBotData)(client);
    if (!dataBot)
        return;
    const leaveLog = client.channels.cache.get(dataBot.logs.exit);
    if ((leaveLog === null || leaveLog === void 0 ? void 0 : leaveLog.type) != discord_js_1.ChannelType.GuildText)
        return;
    const leaveLogEb = new discord_js_1.EmbedBuilder()
        .setTimestamp();
    if (gmr.user.bot) {
        leaveLogEb
            .setTitle("🤖 Se fue un bot")
            .setThumbnail(gmr.displayAvatarURL())
            .setDescription(`${gmr}\n${gmr.user.tag}\nSeunio: <t:${Math.round((((_a = gmr.joinedAt) === null || _a === void 0 ? void 0 : _a.valueOf()) || 0) / 1000)}:R>`)
            .setColor('Orange');
    }
    else {
        const mbanner = yield client.users.fetch(gmr.id, { force: true });
        leaveLogEb
            .setAuthor({ name: gmr.user.username, iconURL: gmr.user.displayAvatarURL({ size: 2048 }) })
            .setThumbnail(gmr.user.displayAvatarURL())
            .setImage(mbanner.bannerURL({ size: 2048 }) || null)
            .setTitle("📤 Se fue un miembro")
            .setDescription(`Se fue ${gmr}\n📥 **Se únio:**\n<t:${Math.round((((_b = gmr.joinedAt) === null || _b === void 0 ? void 0 : _b.valueOf()) || 0) / 1000)}:R>`)
            .setColor(color.negative)
            .setFooter({ text: gmr.guild.name, iconURL: gmr.guild.iconURL() || undefined });
        leaveLog.send({ embeds: [leaveLogEb] });
    }
});
exports.memberRemoveEvent = memberRemoveEvent;
