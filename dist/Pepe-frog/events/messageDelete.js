"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const notion_1 = require("../lib/notion");
exports.name = 'messageDelete';
async function execute(msgd, client) {
    const { serverId, prefix, owners } = client.data;
    if (msgd.guildId != serverId || msgd.author?.bot)
        return;
    if (__1.exemptMessagesIds.some(s => s == msgd.id)) {
        __1.exemptMessagesIds.splice(__1.exemptMessagesIds.findIndex(f => f == msgd.id), 1);
        return;
    }
    const SnackData = await (0, notion_1.getSnackData)();
    if (msgd.channelId == SnackData.channels.logs)
        return;
    if (msgd.content && !(msgd.content.startsWith(prefix) && owners.some(s => s == msgd.author?.id))) {
        const channelLog = client.channels.cache.get(SnackData.channels.logs);
        const DeleteMessageEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: msgd.member?.nickname || msgd.author?.username || 'undefined', iconURL: msgd.author?.displayAvatarURL() })
            .setTitle('🗑️ Deleted message')
            .setDescription(`**📄 Message:**\n${msgd.content.length > 2000 ? msgd.content.slice(0, 2000) + '...' : msgd.content}`)
            .setFields({ name: '🧑 **Author:**', value: `${msgd.author} ||*(\`\`${msgd.author?.id}\`\`)*||`, inline: true }, { name: `<:canaldetexto:904812801925738557> **Channel:**`, value: `${msgd.channel}`, inline: true })
            .setColor('DarkOrange')
            .setTimestamp();
        if (channelLog?.type == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [DeleteMessageEb] });
    }
}
exports.execute = execute;
