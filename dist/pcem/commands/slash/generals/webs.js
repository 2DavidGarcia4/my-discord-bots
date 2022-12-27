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
exports.websSlashCommand = exports.websScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../utils/functions");
exports.websScb = new discord_js_1.SlashCommandBuilder()
    .setName(`webs`)
    .setDescription(`🔗 Paginas webs en las que se encuentra publicado el servidor.`).toJSON();
const websSlashCommand = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield int.deferReply();
    const webEb = new discord_js_1.EmbedBuilder()
        .setTitle(`Webs en las que se encuentra publicado el servidor`)
        .setDescription(`Si quieres apoyarnos a seguir creciendo lo puedes hacer entrando en alguna de estas paginas botar positivamente por el servidor, hacer un comentario positivo o bumpear el servidor.`)
        .addFields({ name: `📑 **Paginas:**`, value: `<:Disboard:977371613551022080> [Disboard](https://disboard.org/es/server/773249398431809586)\n<:discordio:977378649286250516> [Discord.io](https://discord.io/PCEM+)\n<:DS:977373209513037824> [Discord Servers](https://discordservers.com/server/773249398431809586)\n<:topgg:977371924483145728> [Top.gg](https://top.gg/servers/773249398431809586)\n<:Discords:977376832296984616> [Discords](https://discords.com/servers/773249398431809586)\n<:discordts:977376924080947251> [Discord.ts](https://discord.st/server/promociones-cem/)` })
        .setColor(((_b = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    (0, functions_1.sendMessageSlash)(int, { embeds: [webEb] });
});
exports.websSlashCommand = websSlashCommand;
