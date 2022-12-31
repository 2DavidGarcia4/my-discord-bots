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
const girlsCommand = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const GirlsEb = new discord_js_1.EmbedBuilder()
        .setTitle(`<a:info_animate:1052698253394710599> Información`)
        .setDescription(`**¿Eres mujer y vendes tu contenido?**, esto es para ti.\n\nPuedes tener un canal totalmente exclusivo para ti en esta categoría, en el canal podrás promocionarte publicar que vendes contenido y con ello poder utilizar las menciones @everyone o @here la primera mención notifica a todos los miembros mientras que la segunda solo notifica a los miembros conectados pero estas menciones solo las podrás utilizar una vez a la semana.\n\nPara obtener estos beneficios tienes que tener **18** años o mas y pasar por una verificación haciendo [zing](https://www.neostuff.net/que-es-un-zing/), una vez pases la verificación se te otorgara un rol único y el canal con el nombre que desees.\n*Esta verificación es para comprobar que en realidad eres mujer y no un hombre haciéndose pasar por una.*\n\n*Si estas conforme con esto y quieres empezar con la verificación o tienes dudas puedes hablar al privado con el administrador <@853063286320922634>.*`)
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
