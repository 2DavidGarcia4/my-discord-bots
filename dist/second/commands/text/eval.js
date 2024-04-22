"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const __1 = require("../../..");
const functions_1 = require("../../../shared/functions");
const data_1 = require("../../data");
const services_1 = require("../../lib/services");
const models_1 = require("../../../models");
class EvalCommand extends __1.TextCommand {
    constructor() {
        super({
            name: 'eval'
        });
    }
    async execute({ message: msg, args, client }) {
        try {
            const db = data_1.FrogDb, setStatus = services_1.setGuildStatus, modDB = client.modDb, FileModel = models_1.SnackFilesModel;
            msg.channel.sendTyping();
            const code = await eval(args.join(' '));
            const texto = (0, util_1.inspect)(code);
            const evalEb = new discord_js_1.EmbedBuilder()
                .setDescription(`\`\`\`js\n${texto.length > 2040 ? texto.substring(0, 2040).concat('...') : texto}\`\`\``)
                .setColor(msg.guild?.members.me?.displayHexColor || 'White');
            (0, functions_1.sendMessageText)(msg, { embeds: [evalEb] });
        }
        catch (error) {
            (0, functions_1.setError)(msg, `${error}`);
        }
    }
}
exports.default = EvalCommand;
