"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class MemberUpdateEvent extends __1.BotEvent {
    constructor() {
        super('guildMemberUpdate');
    }
    async execute(oldMember, newMember, client) {
        if (oldMember.guild.id != client.data.serverId)
            return;
        if (oldMember.permissions.has('ManageGuild'))
            return;
        const { roles } = client.data;
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;
        if (newRoles.has(roles.verified) && !oldRoles.has(roles.verified)) {
            console.log('Rol agregado');
            // createVerified(client, {id: oldMember.id})
        }
        else if (oldRoles.has(roles.verified) && !newRoles.has(roles.verified)) {
            console.log('Rol eliminado');
        }
    }
}
exports.default = MemberUpdateEvent;
