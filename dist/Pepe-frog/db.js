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
exports.buttonInfoInteractions = exports.FILE_EXTENSIONS = exports.SANCTIONS = exports.FrogDb = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const functions_1 = require("./utils/functions");
exports.FrogDb = {
    me: {
        id: '942860991698436156'
    },
    prefix: config_1.isDevelopment ? 'f!' : 's!',
    serverId: '1053382837857943662',
    principalServerId: '1028793496674500659',
    joins: 0,
    verifiedsCooldown: 10 * 24 * 60 * 60000,
    leaves: 0,
    roles: {
        verified: '1057720387464593478',
        verifiedSpeech: '1083060304054849676',
        spamer: '1053430826823594106',
        content: '1053411182935023657'
    },
    owners: ['853063286320922634', '551146834941313026', '717420870267830382', '853000435098320907']
};
exports.SANCTIONS = [
    {
        time: 2 * 60 * 60 * 1000,
        warns: 2
    },
    {
        time: 4 * 60 * 60 * 1000,
        warns: 3
    },
    {
        time: 8 * 60 * 60 * 1000,
        warns: 4
    },
];
exports.FILE_EXTENSIONS = ['png', 'jpg', 'gif', 'jpeg', 'mov', 'mp4', 'mp3'];
function run(int, client) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const description = (yield (0, functions_1.getInfoMessage)({
            client,
            channelId: this.channelId,
            language: 'en'
        })) + '';
        const RulesEb = new discord_js_1.EmbedBuilder({ title: this.title, description })
            .setColor(((_a = int.message.member) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White');
        let buttons;
        if (this.buttons) {
            buttons = new discord_js_1.ActionRowBuilder()
                .addComponents(...this.buttons);
        }
        int.reply({ ephemeral: true, embeds: [RulesEb], components: buttons ? [buttons] : [] });
    });
}
exports.buttonInfoInteractions = [
    {
        id: 'en-rules-btn',
        channelId: '1090736733047492638',
        title: '📖 Rules',
        run
    },
    {
        id: 'en-verifieds-btn',
        channelId: '1053399734582263938',
        title: `<a:animate_info:1058179015938158592> Information`,
        run,
        buttons: [
            new discord_js_1.ButtonBuilder()
                .setCustomId('verifieds-btn')
                .setLabel('Verifieds')
                .setEmoji('✅')
                .setStyle(discord_js_1.ButtonStyle.Success)
        ]
    },
    {
        id: 'en-vip-btn',
        channelId: '1114225130395140136',
        title: `⭐ VIP access`,
        run,
        buttons: [
            new discord_js_1.ButtonBuilder()
                .setCustomId('vip-btn')
                .setLabel('Channels preview')
                .setEmoji('👁️')
                .setStyle(discord_js_1.ButtonStyle.Secondary)
        ]
    },
    {
        id: 'en-packs-btn',
        channelId: '1120917353862017134',
        title: `📁 Packs access`,
        run,
        buttons: [
            new discord_js_1.ButtonBuilder()
                .setCustomId('packs-btn')
                .setLabel('Channels preview')
                .setEmoji('👁️')
                .setStyle(discord_js_1.ButtonStyle.Secondary)
        ]
    },
];
