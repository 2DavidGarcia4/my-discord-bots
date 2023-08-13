"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reactions = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const notion_1 = require("../lib/notion");
async function Reactions(msg) {
    const { guildId, channel } = msg;
    const { serverId, emojisIds } = db_1.FrogDb;
    const { roles, categories, channels } = await (0, notion_1.getSnackData)();
    if (msg.mentions.roles.first()?.id == roles.content)
        msg.react(emojisIds.more);
    if (msg.author.bot)
        return;
    // if(msg.mentions.members?.has(FrogDb.id)) msg.react('')
    if (guildId != serverId)
        return;
    //? Auto reactions to suggestions
    if (msg.channelId == channels.suggestions && !msg.member?.permissions.has('Administrator'))
        msg.react(emojisIds.like), msg.react(emojisIds.dislike);
    if (channel.type != discord_js_1.ChannelType.GuildText)
        return;
    //? Auto reactions for verified messages
    if (channel.parentId == categories.verifieds && channel.nsfw && msg.member?.roles.cache.has(roles.verified)) {
        if (msg.content.split(/ +/g).length >= 3 || msg.attachments.size) {
            if (channel.position > 1)
                msg.react(emojisIds.beatingHeart), msg.react(emojisIds.hearts), msg.react(emojisIds.veryHot);
        }
    }
}
exports.Reactions = Reactions;
