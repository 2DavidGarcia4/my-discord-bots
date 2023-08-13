"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'emojiDelete';
function execute(emoji, client) {
    const { serverId, backupServerId } = client.data;
    if (emoji.guild.id != serverId)
        return;
    const backupServer = client.getGuildById(backupServerId);
    const backupEmoji = backupServer?.emojis.cache.find(f => f.name == emoji.name);
    if (backupEmoji)
        backupEmoji.delete();
}
exports.execute = execute;
