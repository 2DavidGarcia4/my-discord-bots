"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'emojiUpdate';
async function execute(oldEmoji, newEmoji, client) {
    const { serverId, backupServerId } = client.data;
    if (oldEmoji.guild.id != serverId)
        return;
    const backupServer = client.getGuildById(backupServerId);
    const backupEmoji = backupServer?.emojis.cache.find(f => f.name == oldEmoji.name);
    if (backupEmoji) {
        backupEmoji.edit({
            name: newEmoji.name || 'unknown'
        });
    }
}
exports.execute = execute;
