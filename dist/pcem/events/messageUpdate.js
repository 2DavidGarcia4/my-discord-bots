"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageUpdateEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const utils_1 = require("../utils");
const messageUpdateEvent = async (oldMsg, newMsg, client) => {
    const { serverId, emoji } = db_1.botDB;
    if (oldMsg.guildId != serverId)
        return;
    if (oldMsg.content && oldMsg.content != newMsg.content) {
        const dataBot = await (0, utils_1.getBotData)(client);
        if (!dataBot)
            return;
        const channelLog = client.channels.cache.get(dataBot.logs.editedMessages);
        const MessageUpdateEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: oldMsg.member?.nickname || oldMsg.author?.username || 'undefined', iconURL: oldMsg.author?.displayAvatarURL() })
            .setTitle('🪄 Mensaje editado')
            .addFields({ name: `📄 **Mensaje antiguo:**`, value: `${oldMsg.content.length > 1024 ? oldMsg.content.slice(0, 1020) + '...' : oldMsg.content}`, inline: true }, { name: `📝 **Mensaje actual:**`, value: `${(newMsg.content?.length || 0) > 1024 ? newMsg.content?.slice(0, 1020) + '...' : newMsg.content}`, inline: true }, { name: `\u200B`, value: `\u200B`, inline: true }, { name: '🧑 **Autor:**', value: `${oldMsg.author} ||*(\`\`${oldMsg.author?.id}\`\`)*||`, inline: true }, { name: `${emoji.textChannel} **Canal:**`, value: `${oldMsg.channel}`, inline: true })
            .setColor('Blue')
            .setTimestamp();
        if (channelLog?.type == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [MessageUpdateEb] });
    }
};
exports.messageUpdateEvent = messageUpdateEvent;
