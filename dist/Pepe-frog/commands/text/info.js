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
exports.infoCommand = void 0;
const discord_js_1 = require("discord.js");
const infoCommand = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const InfoEb = new discord_js_1.EmbedBuilder()
        .setTitle('<a:animate_info:1058179015938158592> Información')
        .setDescription('Aquí podrás obtener información de casi todo lo que hay en el servidor solo selecciona una opción en el menú de abajo y obtendrás información de esa opción.\n\n*En caso de haber leído y aun tener dudas puedes consultar con <@853063286320922634> cualquier duda.*')
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    const InfoMenu = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('info-menu')
        .setPlaceholder('👉 Selecciona una opción.')
        .setOptions([
        {
            emoji: '🥟',
            label: 'Servidor',
            value: 'server'
        },
        {
            emoji: '1058198792282841220',
            label: 'Canales',
            value: 'channels'
        },
        {
            emoji: '🎭',
            label: 'Roles',
            value: 'roles'
        },
        {
            emoji: '🤖',
            label: 'Sobre mí',
            value: 'about-me'
        },
    ]));
    const InfoBtn = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('en-info-btn')
        .setEmoji('👅')
        .setLabel('English')
        .setStyle(discord_js_1.ButtonStyle.Primary));
    msg.channel.send({ embeds: [InfoEb], components: [InfoMenu, InfoBtn] });
});
exports.infoCommand = infoCommand;
