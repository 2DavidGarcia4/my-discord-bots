"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
class MessageDeleteEvent extends __1.BotEvent {
    constructor() {
        super('messageDelete');
    }
    async execute(msgd, client) {
        const { serverId, prefix, owners } = client.data;
        if (msgd.guildId != serverId || msgd.author?.bot)
            return;
        if (client.exemptMessagesIds.some(s => s == msgd.id)) {
            client.exemptMessagesIds.splice(client.exemptMessagesIds.findIndex(f => f == msgd.id), 1);
            return;
        }
        const { channels } = client.data;
        if (msgd.channelId == channels.logs)
            return;
        if (msgd.content && !(msgd.content.startsWith(prefix) && owners.some(s => s == msgd.author?.id))) {
            const channelLog = client.channels.cache.get(channels.logs);
            const DeleteMessageEb = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: msgd.member?.nickname || msgd.author?.username || 'undefined', iconURL: msgd.author?.displayAvatarURL() })
                .setTitle('🗑️ Deleted message')
                .setDescription(`**📄 Message:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000) + '...' : msgd.content}`)
                .setFields({ name: '🧑 **Author:**', value: `${msgd.author}\n\`\`\`${msgd.author?.id}\`\`\``, inline: true }, { name: `<:canaldetexto:1077274759164866681> **Channel:**`, value: `${msgd.channel}`, inline: true })
                .setColor('DarkOrange')
                .setTimestamp();
            if (channelLog?.type == discord_js_1.ChannelType.GuildText)
                channelLog.send({ embeds: [DeleteMessageEb] });
        }
    }
}
exports.default = MessageDeleteEvent;
