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
exports.girlsCommand = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../utils/functions");
const girlsCommand = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const verifiedInfo = yield (0, functions_1.getVerifiedsInfo)(client, 'es');
    const GirlsEb = new discord_js_1.EmbedBuilder()
        .setTitle(`<a:animate_info:1058179015938158592> Información`)
        .setDescription(`${verifiedInfo}`)
        .setFooter({ text: "speak English?, Click blue button below" })
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    const GirlsBtns = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('en-girls-btn')
        .setLabel('English')
        .setEmoji('👅')
        .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
        .setCustomId('verifieds-btn')
        .setLabel('Verificadas')
        .setEmoji('✅')
        .setStyle(discord_js_1.ButtonStyle.Success));
    msg.channel.send({ embeds: [GirlsEb], components: [GirlsBtns] });
});
exports.girlsCommand = girlsCommand;
