"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const __1 = require("..");
const db_1 = require("../db");
exports.name = 'guildMemberRemove';
async function execute(member) {
    const { serverId } = db_1.FrogDb;
    if (member.guild.id != serverId)
        return;
    db_1.FrogDb.leaves++;
    if (__1.modDb.some(s => s.id == member.id))
        __1.modDb.splice(__1.modDb.findIndex(f => f.id == member.id), 1);
}
exports.execute = execute;
