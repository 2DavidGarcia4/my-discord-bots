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
exports.banRemoveEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const utils_1 = require("../utils");
const banRemoveEvent = (gbr, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (gbr.guild.id != db_1.botDB.serverId)
        return;
    const dataBot = yield (0, utils_1.getBotData)(client), channelLog = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.unban) || '');
    const embDesbaneado = new discord_js_1.EmbedBuilder()
        .setThumbnail(gbr.user.displayAvatarURL())
        .setTitle(`${db_1.botDB.emoji.afirmative} Usuario desbaneado`)
        .setDescription(`👤 ${gbr.user.tag}\n\n🆔 ${gbr.user.id}\n📄 ${gbr.reason || 'no encontre la razón'}`)
        .setColor(db_1.botDB.color.afirmative)
        .setFooter({ text: gbr.guild.name, iconURL: gbr.guild.iconURL() || undefined })
        .setTimestamp();
    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embDesbaneado] });
});
exports.banRemoveEvent = banRemoveEvent;
