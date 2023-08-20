"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class EmojiDeleteEvent extends __1.BotEvent {
    constructor() {
        super('emojiDelete');
    }
    async execute(emoji, client) {
        const { serverId, backupServerId } = client.data;
        if (emoji.guild.id != serverId)
            return;
        const backupServer = client.getGuildById(backupServerId);
        const backupEmoji = backupServer?.emojis.cache.find(f => f.name == emoji.name);
        if (backupEmoji)
            backupEmoji.delete();
    }
}
exports.default = EmojiDeleteEvent;
