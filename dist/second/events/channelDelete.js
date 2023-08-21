"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const models_1 = require("../../models");
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
        const verifiedData = await models_1.VerifiedsModel.findOne({ channelId: channel.id });
        if (verifiedData)
            verifiedData.deleteOne();
    }
}
exports.default = ChannelDeleteEvent;
