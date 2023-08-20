"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class RoleCreateEvent extends __1.BotEvent {
    constructor() {
        super('roleCreate');
    }
    async execute(role, client) {
        const { serverId, backupServerId } = client.data;
        if (role.guild.id != serverId)
            return;
        const principalServer = client.guilds.cache.get(backupServerId);
        principalServer?.roles.create({ name: role.name, permissions: role.permissions });
    }
}
exports.default = RoleCreateEvent;
