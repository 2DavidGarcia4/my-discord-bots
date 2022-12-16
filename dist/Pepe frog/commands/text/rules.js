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
exports.rulesCommand = void 0;
const discord_js_1 = require("discord.js");
const rulesCommand = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const RulesEb = new discord_js_1.EmbedBuilder()
        .setTitle('📖 Reglas')
        .setDescription(`> **1.** Respeto mutuo, trata a los demás con respeto. No se tolerará ningún tipo de acoso, caza de brujas, sexismo, racismo o discurso de odio.\n\n> **2.** No incite a otros a hacer practicas maliciosas como el raideo, scam entre otras.\n\n> 3. No se permite el spam ni la autopromoción (invitaciones al servidor, anuncios, etc.) sin permiso de un miembro del personal. Esto también incluye mandar MD a otros miembros.\n\n> **4.** No fotopollas, por favor no enviar fotos de su pene esta prohibido por el momento ya que este servidor es un servidor enfocado en el contenido sexual femenino.\n\n> **5.** No esta permitido el contenido sexual de menores, en caso de publicar contenido de ese tipo se le baneara del servidor.\n\n> **6.** Si ves algo que va en contra de las normas o que no te haga sentir seguro, informa al personal. ¡Queremos que este servidor sea un lugar acogedor!`)
        .setFooter({ text: "you don't speak Spanish?, Click blue button below" })
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    const RulesArb = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('en-rules-btn')
        .setEmoji('👅')
        .setLabel('English')
        .setStyle(discord_js_1.ButtonStyle.Primary));
    msg.channel.send({ embeds: [RulesEb], components: [RulesArb] });
});
exports.rulesCommand = rulesCommand;
