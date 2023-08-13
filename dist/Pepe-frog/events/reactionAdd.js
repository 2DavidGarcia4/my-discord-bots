"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
const db_1 = require("../db");
const notion_1 = require("../lib/notion");
exports.name = 'messageReactionAdd';
async function execute(reaction, user) {
    const { serverId, emojisIds } = db_1.FrogDb;
    if (user.bot)
        return;
    if (reaction.message.guildId != serverId)
        return;
    const { channels } = await (0, notion_1.getSnackData)();
    if (reaction.message.channelId == channels.suggestions && [emojisIds.like, emojisIds.dislike].some(s => s == reaction.emoji.id)) {
        if (reaction.message.author?.id == user.id) {
            reaction.users.remove(user.id);
            return;
        }
        const counterReaction = reaction.emoji.id == emojisIds.like ? emojisIds.dislike : emojisIds.like;
        if (reaction.message.reactions.cache.has(counterReaction)) {
            reaction.message.reactions.cache.get(counterReaction)?.users.remove(user.id);
        }
    }
}
exports.execute = execute;
