"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const channelDeleteEvent = async (cd, client) => {
    if (cd.type == discord_js_1.ChannelType.DM)
        return;
    if (cd.guildId != db_1.botDB.serverId)
        return;
};
exports.channelDeleteEvent = channelDeleteEvent;
