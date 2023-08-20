"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const notion_1 = require("../lib/notion");
const __1 = require("../..");
class ReactionAddEvent extends __1.BotEvent {
    constructor() {
        super('messageReactionAdd');
    }
    async execute(reaction, user) {
        const { serverId, emojisIds } = data_1.FrogDb;
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
}
exports.default = ReactionAddEvent;
