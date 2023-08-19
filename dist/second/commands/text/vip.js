"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const services_1 = require("../../lib/services");
const __1 = require("../../..");
class VipCommand extends __1.TextCommand {
    constructor() {
        super({ name: 'vip' });
    }
    async execute({ message: msg, client }) {
        const description = await (0, services_1.getInfoMessage)({
            client,
            channelId: '1139620277488189551',
            language: 'es'
        }) + '';
        (0, services_1.defaultInfoMessageBody)(msg, {
            title: `⭐ Acceso VIP`,
            description,
            name: 'vip',
            extraButtons: [
                new discord_js_1.ButtonBuilder()
                    .setCustomId('vip-btn')
                    .setLabel('Vista previa de canales')
                    .setEmoji('👁️')
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
            ]
        });
    }
}
exports.default = VipCommand;
