"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'shardError';
async function execute(error, shardId) {
    console.error('Error: ' + shardId, error.message);
    console.error(error);
}
exports.execute = execute;
