"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class EmojiUpdateEvent extends __1.BotEvent {
    constructor() {
        super('emojiUpdate');
    }
    async execute(oldEmoji, newEmoji, client) {
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
}
exports.default = EmojiUpdateEvent;
