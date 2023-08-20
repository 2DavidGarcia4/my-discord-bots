"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../lib/services");
const __1 = require("../..");
class ChannelDeleteEvent extends __1.BotEvent {
    constructor() {
        super('channelDelete');
    }
    async execute(channel, client) {
        const { serverId, backupServerId } = client.data;
        if (channel.isDMBased() || channel.guildId != serverId)
            return;
        const principalServer = client.guilds.cache.get(backupServerId);
        principalServer?.channels.cache.find(f => f.name == channel.name)?.delete();
        const verifiedsData = await (0, services_1.getVerifiedsData)(client);
        if (verifiedsData && verifiedsData.some(s => s.channelId == channel.id)) {
            verifiedsData.splice(verifiedsData.findIndex(f => f.channelId == channel.id), 1);
            await (0, services_1.updateVerifiedsData)(client, verifiedsData);
        }
    }
}
exports.default = ChannelDeleteEvent;
