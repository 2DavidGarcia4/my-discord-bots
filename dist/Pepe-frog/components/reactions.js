"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reactions = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
function Reactions(msg) {
    var _a, _b, _c, _d;
    const { guildId, channel } = msg;
    if (((_a = msg.mentions.roles.first()) === null || _a === void 0 ? void 0 : _a.id) == db_1.FrogDb.roles.content)
        msg.react('1053444752340680817');
    if (msg.author.bot)
        return;
    if ((_b = msg.mentions.members) === null || _b === void 0 ? void 0 : _b.has(db_1.FrogDb.me.id))
        msg.react('1061737573959094422');
    if (guildId != db_1.FrogDb.serverId)
        return;
    //? Auto reactions to suggestions
    if (msg.channelId == '1053401642915082392' && !((_c = msg.member) === null || _c === void 0 ? void 0 : _c.permissions.has('Administrator')))
        msg.react('1059641676798377995'), msg.react('1059641726387626015');
    if (channel.type != discord_js_1.ChannelType.GuildText)
        return;
    //? Auto reactions for verified messages
    if (channel.parentId == '1053401639454773338' && channel.nsfw && ((_d = msg.member) === null || _d === void 0 ? void 0 : _d.roles.cache.has(db_1.FrogDb.roles.verified))) {
        if (msg.content.split(/ +/g).length >= 3 || msg.attachments.size) {
            if (channel.position > 1)
                msg.react('1061464848967401502'), msg.react('1061467211329458216'), msg.react('1061467145122369596');
        }
    }
}
exports.Reactions = Reactions;
