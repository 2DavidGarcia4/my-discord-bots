"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class ShardErrorEvent extends __1.BotEvent {
    constructor() {
        super('shardError');
    }
    async execute(error, shardId) {
        console.error('Error: ' + shardId, error.message);
        console.error(error);
    }
}
exports.default = ShardErrorEvent;
