"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionAddEvent = void 0;
const db_1 = require("../db");
const reactionAddEvent = (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { serverId } = db_1.frogDb;
    const likeId = '1059641676798377995', dislikeId = '1059641726387626015';
    if (reaction.message.guildId != serverId || user.bot)
        return;
    if (reaction.message.channelId == '1053401642915082392' && [likeId, dislikeId].some(s => s == reaction.emoji.id)) {
        if (((_a = reaction.message.author) === null || _a === void 0 ? void 0 : _a.id) == user.id)
            return reaction.users.remove(user.id);
        const counterReaction = reaction.emoji.id == likeId ? dislikeId : likeId;
        if (reaction.message.reactions.cache.has(counterReaction)) {
            (_b = reaction.message.reactions.cache.get(counterReaction)) === null || _b === void 0 ? void 0 : _b.users.remove(user.id);
        }
    }
});
exports.reactionAddEvent = reactionAddEvent;
