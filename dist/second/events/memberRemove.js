"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class MemberRemoveEvent extends __1.BotEvent {
    constructor() {
        super('guildMemberRemove');
    }
    async execute(member, client) {
        const { serverId } = client.data;
        if (member.guild.id != serverId)
            return;
        client.data.leaves++;
        if (client.modDb.some(s => s.id == member.id))
            client.modDb.splice(client.modDb.findIndex(f => f.id == member.id), 1);
    }
}
exports.default = MemberRemoveEvent;
