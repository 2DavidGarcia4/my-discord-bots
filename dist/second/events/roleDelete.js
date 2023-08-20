"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class DoleDeleteEvent extends __1.BotEvent {
    constructor() {
        super('roleDelete');
    }
    async execute(role, client) {
        const { serverId, backupServerId } = client.data;
        if (role.guild.id != serverId)
            return;
        const principalServer = client.guilds.cache.get(backupServerId);
        principalServer?.roles.cache.find(f => f.name == role.name)?.delete();
    }
}
exports.default = DoleDeleteEvent;
