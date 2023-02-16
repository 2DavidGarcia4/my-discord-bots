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
exports.messageDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const models_1 = require("../models");
const __1 = require("..");
const utils_1 = require("../utils");
const messageDeleteEvent = (msgd, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { serverId, emoji } = db_1.botDB;
    if (msgd.guildId != serverId)
        return;
    if (__1.exemptMessagesIds.some(s => s == msgd.id)) {
        __1.exemptMessagesIds.splice(__1.exemptMessagesIds.findIndex(f => f == msgd.id), 1);
        return;
    }
    let dataSor = yield models_1.rafflesModel.findById(serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.raffles;
    if (arraySo === null || arraySo === void 0 ? void 0 : arraySo.some(s => s.id == msgd.id)) {
        arraySo.splice(arraySo.findIndex(f => f.id == msgd.id), 1);
        yield models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
    }
    let dataEnc = yield models_1.surveysModel.findById(serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.surveys;
    if (arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.some(s => s.id == msgd.id)) {
        arrayEn.splice(arrayEn.findIndex(f => f.id == msgd.id), 1);
        yield models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
    }
    if (msgd.content) {
        const dataBot = yield (0, utils_1.getBotData)(client);
        if (!dataBot)
            return;
        const channelLog = client.channels.cache.get(dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.deleteMessages);
        const logs = yield ((_a = msgd.guild) === null || _a === void 0 ? void 0 : _a.fetchAuditLogs());
        const executor = (_b = logs === null || logs === void 0 ? void 0 : logs.entries.filter(f => f.actionType == 'Delete' && f.targetType == 'Message').first()) === null || _b === void 0 ? void 0 : _b.executor;
        const DeleteMessageEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: ((_c = msgd.member) === null || _c === void 0 ? void 0 : _c.nickname) || ((_d = msgd.author) === null || _d === void 0 ? void 0 : _d.username) || 'undefined', iconURL: (_e = msgd.author) === null || _e === void 0 ? void 0 : _e.displayAvatarURL() })
            .setTitle('🗑️ Mensaje eliminado')
            .setDescription(`**📄 Mensaje:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000) + '...' : msgd.content}`)
            .setFields({ name: '🧑 **Autor:**', value: `${msgd.author} ||*(\`\`${(_f = msgd.author) === null || _f === void 0 ? void 0 : _f.id}\`\`)*||`, inline: true }, { name: `${emoji.textChannel} **Canal:**`, value: `${msgd.channel}`, inline: true }, { name: '👮 **Ejecutor:**', value: `${executor} ||*(\`\`${executor === null || executor === void 0 ? void 0 : executor.id}\`\`)*||`, inline: true })
            .setColor('Red')
            .setTimestamp();
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            return channelLog.send({ embeds: [DeleteMessageEb] });
    }
});
exports.messageDeleteEvent = messageDeleteEvent;
