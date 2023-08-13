"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const services_1 = require("../../lib/services");
const __1 = require("../..");
class GirlsCommand extends __1.TextCommand {
    constructor() {
        super({
            name: 'girls'
        });
    }
    async execute({ message: msg, client }) {
        const description = await (0, services_1.getInfoMessage)({
            client,
            channelId: '1053399734582263938',
            language: 'es'
        }) + '';
        (0, services_1.defaultInfoMessageBody)(msg, {
            title: `<a:animate_info:1058179015938158592> Información`,
            description,
            name: 'verifieds',
            extraButtons: [
                new discord_js_1.ButtonBuilder()
                    .setCustomId('verifieds-btn')
                    .setLabel('Verificadas')
                    .setEmoji('✅')
                    .setStyle(discord_js_1.ButtonStyle.Success)
            ]
        });
    }
}
exports.default = GirlsCommand;
