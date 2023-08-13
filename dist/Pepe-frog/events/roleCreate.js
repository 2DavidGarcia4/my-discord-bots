"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const db_1 = require("../db");
exports.name = 'roleCreate';
async function execute(role, client) {
    const { serverId, backupServerId } = db_1.FrogDb;
    if (role.guild.id != serverId)
        return;
    const principalServer = client.guilds.cache.get(backupServerId);
    principalServer?.roles.create({ name: role.name, permissions: role.permissions });
}
exports.execute = execute;
