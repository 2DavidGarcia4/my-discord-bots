"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'emojiCreate';
function execute(emoji, client) {
    const { serverId, backupServerId } = client.data;
    if (emoji.guild.id != serverId)
        return;
    const backupServer = client.getGuildById(backupServerId);
    backupServer?.emojis.create({
        name: emoji.name || 'unknown',
        attachment: emoji.url
    });
}
exports.execute = execute;
