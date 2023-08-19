"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'roleUpdate';
async function execute(oldRole, newRole, client) {
    const { serverId, backupServerId } = client.data;
    if (oldRole.guild.id != serverId)
        return;
    const principalServer = client.guilds.cache.get(backupServerId);
    principalServer?.roles.cache.find(f => f.name == oldRole.name)?.edit({ name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable });
}
exports.execute = execute;
