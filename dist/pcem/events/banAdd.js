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
exports.banAddEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const utils_1 = require("../utils");
const banAddEvent = (gba, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (gba.guild.id != db_1.botDB.serverId)
        return;
    const dataBot = yield (0, utils_1.getBotData)(client), channelLog = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.ban) || '');
    const embBaneado = new discord_js_1.EmbedBuilder()
        .setThumbnail(gba.user.displayAvatarURL())
        .setTitle(`${db_1.botDB.emoji.negative} Usuario baneado`)
        .setDescription(`👤 ${gba.user.tag}\n\n🆔 ${gba.user.id}\n\n📝 Razon: ${(yield gba.guild.bans.fetch()).filter(fb => fb.user.id === gba.user.id).map(mb => mb.reason)}`)
        .setColor(db_1.botDB.color.negative)
        .setFooter({ text: gba.guild.name, iconURL: gba.guild.iconURL() || undefined })
        .setTimestamp();
    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embBaneado] });
});
exports.banAddEvent = banAddEvent;
