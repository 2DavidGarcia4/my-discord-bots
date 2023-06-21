"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vipCommand = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../utils/functions");
const vipCommand = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    const description = (yield (0, functions_1.getInfoMessage)({
        client,
        channelId: '1114225130395140136',
        language: 'es'
    })) + '';
    (0, functions_1.defaultInfoMessageBody)(msg, {
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
});
exports.vipCommand = vipCommand;
