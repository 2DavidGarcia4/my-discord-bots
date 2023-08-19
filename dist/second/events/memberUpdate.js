"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const services_1 = require("../lib/services");
const notion_1 = require("../lib/notion");
exports.name = 'guildMemberUpdate';
async function execute(oldMember, newMember, client) {
    if (oldMember.guild.id != client.data.serverId)
        return;
    if (oldMember.permissions.has('ManageGuild'))
        return;
    const SnackData = await (0, notion_1.getSnackData)();
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    if (newRoles.has(SnackData.roles.verified) && !oldRoles.has(SnackData.roles.verified)) {
        console.log('Rol agregado');
        (0, services_1.createVerified)(client, { id: oldMember.id });
    }
    else if (oldRoles.has(SnackData.roles.verified) && !newRoles.has(SnackData.roles.verified)) {
        console.log('Rol eliminado');
    }
}
exports.execute = execute;
