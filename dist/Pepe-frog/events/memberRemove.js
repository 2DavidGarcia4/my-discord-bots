"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const __1 = require("..");
const data_1 = require("../data");
exports.name = 'guildMemberRemove';
async function execute(member) {
    const { serverId } = data_1.FrogDb;
    if (member.guild.id != serverId)
        return;
    data_1.FrogDb.leaves++;
    if (__1.modDb.some(s => s.id == member.id))
        __1.modDb.splice(__1.modDb.findIndex(f => f.id == member.id), 1);
}
exports.execute = execute;
