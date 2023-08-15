"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const models_1 = require("../../models");
const __1 = require("..");
const utils_1 = require("../utils");
const messageDeleteEvent = async (msgd, client) => {
    const { serverId, emoji } = db_1.botDB;
    if (msgd.guildId != serverId)
        return;
    if (__1.exemptMessagesIds.some(s => s == msgd.id)) {
        __1.exemptMessagesIds.splice(__1.exemptMessagesIds.findIndex(f => f == msgd.id), 1);
        return;
    }
    let dataSor = await models_1.rafflesModel.findById(serverId), arraySo = dataSor?.raffles;
    if (arraySo?.some(s => s.id == msgd.id)) {
        arraySo.splice(arraySo.findIndex(f => f.id == msgd.id), 1);
        await models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
    }
    let dataEnc = await models_1.surveysModel.findById(serverId), arrayEn = dataEnc?.surveys;
    if (arrayEn?.some(s => s.id == msgd.id)) {
        arrayEn.splice(arrayEn.findIndex(f => f.id == msgd.id), 1);
        await models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
    }
    if (msgd.content) {
        const dataBot = await (0, utils_1.getBotData)(client);
        if (!dataBot)
            return;
        const channelLog = client.channels.cache.get(dataBot?.logs.deleteMessages);
        const logs = await msgd.guild?.fetchAuditLogs();
        const executor = logs?.entries.filter(f => f.actionType == 'Delete' && f.targetType == 'Message').first()?.executor;
        const DeleteMessageEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: msgd.member?.nickname || msgd.author?.username || 'undefined', iconURL: msgd.author?.displayAvatarURL() })
            .setTitle('🗑️ Mensaje eliminado')
            .setDescription(`**📄 Mensaje:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000) + '...' : msgd.content}`)
            .setFields({ name: '🧑 **Autor:**', value: `${msgd.author} ||*(\`\`${msgd.author?.id}\`\`)*||`, inline: true }, { name: `${emoji.textChannel} **Canal:**`, value: `${msgd.channel}`, inline: true }, { name: '👮 **Ejecutor:**', value: `${executor} ||*(\`\`${executor?.id}\`\`)*||`, inline: true })
            .setColor('Red')
            .setTimestamp();
        if (channelLog?.type == discord_js_1.ChannelType.GuildText)
            return channelLog.send({ embeds: [DeleteMessageEb] });
    }
};
exports.messageDeleteEvent = messageDeleteEvent;
