"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
class ChannelUpdateEvenet extends __1.BotEvent {
    constructor() {
        super('channelUpdate');
    }
    async execute(oldChannel, newChannel, client) {
        const { serverId, backupServerId } = client.data;
        if (oldChannel.isDMBased() || newChannel.isDMBased() || oldChannel.guildId != serverId)
            return;
        const principalServer = client.guilds.cache.get(backupServerId);
        const prinCategory = principalServer?.channels.cache.find(f => f.name == newChannel.parent?.name);
        const prinChannel = principalServer?.channels.cache.find(f => f.name == oldChannel.name);
        if (prinChannel) {
            prinChannel.edit({
                name: newChannel.name,
                position: newChannel.position,
                parent: prinCategory?.id,
            });
            if (newChannel.type == discord_js_1.ChannelType.GuildText) {
                prinChannel.edit({
                    nsfw: newChannel.nsfw,
                    topic: newChannel.topic,
                    rateLimitPerUser: newChannel.rateLimitPerUser
                });
            }
        }
    }
}
exports.default = ChannelUpdateEvenet;
