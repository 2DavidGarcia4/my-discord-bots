"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const services_1 = require("../../lib/services");
const __1 = require("../..");
class PacksCommand extends __1.TextCommand {
    constructor() {
        super({ name: 'packs' });
    }
    async execute({ message: msg, client }) {
        const description = await (0, services_1.getInfoMessage)({
            client,
            channelId: '1120917353862017134',
            language: 'es'
        }) + '';
        (0, services_1.defaultInfoMessageBody)(msg, {
            title: `📁 Acceso packs`,
            description,
            name: 'packs',
            extraButtons: [
                new discord_js_1.ButtonBuilder()
                    .setCustomId('packs-btn')
                    .setLabel('Vista previa de canales')
                    .setEmoji('👁️')
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
            ]
        });
    }
}
exports.default = PacksCommand;
