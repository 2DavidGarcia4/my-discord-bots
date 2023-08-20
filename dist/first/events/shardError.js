"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
const utils_1 = require("../utils");
const config_1 = require("../../config");
class ShardErrorEvent extends __1.BotEvent {
    constructor() {
        super('shardError');
    }
    async execute(error, shardId, client) {
        const { emoji, color } = client.data;
        const dataBot = await (0, utils_1.getBotData)(client), channelLog = client.getChannelById(dataBot?.logs.errors || '');
        console.log(error);
        const embErr = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.negative} Ocurrió un error`)
            .setDescription(`\`\`\`js\n${error.name}\n\n${error.message}\n\n${error.stack}\`\`\``)
            .setColor(color.negative)
            .setTimestamp();
        if ((!config_1.inDevelopment) && channelLog?.type == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [embErr] });
    }
}
exports.default = ShardErrorEvent;
