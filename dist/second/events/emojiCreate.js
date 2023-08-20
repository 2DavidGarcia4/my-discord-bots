"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class EmojiCreateEvent extends __1.BotEvent {
    constructor() {
        super('emojiCreate');
    }
    async execute(emoji, client) {
        const { serverId, backupServerId } = client.data;
        if (emoji.guild.id != serverId)
            return;
        const backupServer = client.getGuildById(backupServerId);
        backupServer?.emojis.create({
            name: emoji.name || 'unknown',
            attachment: emoji.url
        });
    }
}
exports.default = EmojiCreateEvent;
