"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const functions_1 = require("../../../../shared/functions");
const db_1 = require("../../../db");
const utils_1 = require("../../../utils");
exports.name = "eval";
const evalCommand = (msg, client, args) => {
    if (!db_1.botDB.owners.some(s => s == msg.author.id))
        return;
    try {
        msg.channel.sendTyping();
        const text = args.join(' ');
        const code = eval(text), texto = (0, util_1.inspect)(code);
        const evalEb = new discord_js_1.EmbedBuilder()
            .setDescription(`\`\`\`js\n${texto.length > 2040 ? texto.substring(0, 2040).concat('...') : texto}\`\`\``)
            .setColor((0, utils_1.getEmbedColor)(msg.guild));
        (0, functions_1.sendMessageText)(msg, { embeds: [evalEb] });
    }
    catch (error) {
        (0, functions_1.setError)(msg, `${error}`);
    }
};
exports.evalCommand = evalCommand;
