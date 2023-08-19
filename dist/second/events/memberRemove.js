"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'guildMemberRemove';
async function execute(member, client) {
    const { serverId } = client.data;
    if (member.guild.id != serverId)
        return;
    client.data.leaves++;
    if (client.modDb.some(s => s.id == member.id))
        client.modDb.splice(client.modDb.findIndex(f => f.id == member.id), 1);
}
exports.execute = execute;
