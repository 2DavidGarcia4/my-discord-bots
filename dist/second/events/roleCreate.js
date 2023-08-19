"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'roleCreate';
async function execute(role, client) {
    const { serverId, backupServerId } = client.data;
    if (role.guild.id != serverId)
        return;
    const principalServer = client.guilds.cache.get(backupServerId);
    principalServer?.roles.create({ name: role.name, permissions: role.permissions });
}
exports.execute = execute;
