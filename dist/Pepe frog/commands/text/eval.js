"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalCommand = void 0;
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const __1 = require("../..");
const functions_1 = require("../../../utils/functions");
const db_1 = require("../../db");
const functions_2 = require("../../utils/functions");
// import { modDb } from "../../events/messageCreate"
const evalCommand = (msg, client, args) => {
    var _a, _b;
    try {
        const db = db_1.frogDb, setStatus = functions_2.setGuildStatus, modDB = __1.modDb;
        msg.channel.sendTyping();
        const code = eval(args), texto = (0, util_1.inspect)(code);
        const evalEb = new discord_js_1.EmbedBuilder()
            .setDescription(`\`\`\`js\n${texto.length > 2040 ? texto.substring(0, 2040).concat('...') : texto}\`\`\``)
            .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
        (0, functions_1.sendMessageText)(msg, { embeds: [evalEb] });
    }
    catch (error) {
        (0, functions_1.setError)(msg, `${error}`);
    }
};
exports.evalCommand = evalCommand;
