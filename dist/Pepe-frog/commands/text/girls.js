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
    const { getMessage } = (0, functions_1.getInfoMessages)(client);
    const description = (yield getMessage('1053399734582263938', 'es')) + '';
    (0, functions_1.defaultInfoMessageBody)(msg, {
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
});
exports.girlsCommand = girlsCommand;
