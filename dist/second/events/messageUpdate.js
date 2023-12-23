"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
class MessageUpdateEvent extends __1.BotEvent {
    constructor() {
        super('messageUpdate');
    }
    async execute(oldMsg, newMsg, client) {
        const { serverId } = client.data;
        if (oldMsg.guildId != serverId || oldMsg.author?.bot)
            return;
        const { channels } = client.data;
        if (oldMsg.channelId == channels.logs)
            return;
        if (oldMsg.content && oldMsg.content != newMsg.content) {
            const channelLog = client.channels.cache.get(channels.logs);
            const MessageUpdateEb = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: oldMsg.member?.nickname || oldMsg.author?.username || 'undefined', iconURL: oldMsg.author?.displayAvatarURL() })
                .setTitle('🪄 Edited message')
                .addFields({ name: `📄 **Old message:**`, value: `${oldMsg.content.length > 1024 ? oldMsg.content.slice(0, 1020) + '...' : oldMsg.content}`, inline: true }, { name: `📝 **New message:**`, value: `${(newMsg.content?.length || 0) > 1024 ? newMsg.content?.slice(0, 1020) + '...' : newMsg.content}`, inline: true }, { name: `\u200B`, value: `\u200B`, inline: true }, { name: '🧑 **Author:**', value: `${oldMsg.author} ||*(\`\`${oldMsg.author?.id}\`\`)*||`, inline: true }, { name: `<:canaldetexto:1077274759164866681> **Channel:**`, value: `${oldMsg.channel}`, inline: true }, { name: '📄 **Message:**', value: `[Go to message](${newMsg.url})`, inline: true })
                .setColor('Blurple')
                .setTimestamp();
            if (channelLog?.type == discord_js_1.ChannelType.GuildText)
                channelLog.send({ embeds: [MessageUpdateEb] });
        }
    }
}
exports.default = MessageUpdateEvent;
