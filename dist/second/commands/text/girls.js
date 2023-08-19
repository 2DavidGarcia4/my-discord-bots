"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const services_1 = require("../../lib/services");
const __1 = require("../../..");
class GirlsCommand extends __1.TextCommand {
    constructor() {
        super({
            name: 'girls'
        });
    }
    async execute({ message: msg, client }) {
        const description = await (0, services_1.getInfoMessage)({
            client,
            channelId: '1139620168998326362',
            language: 'es'
        }) + '';
        (0, services_1.defaultInfoMessageBody)(msg, {
            title: `<a:info_animate:1052698007562375219> Información`,
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
