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
exports.commandsSlashComand = exports.commandsScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
exports.commandsScb = new discord_js_1.SlashCommandBuilder()
    .setName('commands')
    .setNameLocalization('es-ES', 'comandos')
    .setDescription('📄 My slash commands')
    .setDescriptionLocalization('es-ES', '📄 Mis comandos de barra').toJSON();
const commandsSlashComand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { user, guild, locale } = int, isEnglish = locale == 'en-US';
    const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const commands = yield ((_a = client.application) === null || _a === void 0 ? void 0 : _a.commands.fetch());
    yield int.deferReply();
    const CommandsEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${(author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username)}`, iconURL: author === null || author === void 0 ? void 0 : author.user.displayAvatarURL() })
        .setTitle(`📄 ${isEnglish ? 'Commands' : 'Comandos'}`)
        .setDescription((isEnglish ? 'A **command** is an order/instruction that you give to the Bot and to which the Bot responds in a certain way according to the order or name of the command.' : 'Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.') + `\n\n${commands === null || commands === void 0 ? void 0 : commands.map((c) => c.options.filter(f => f.type == 1).length ? c.options.map(a => `</${c.name} ${a.name}:${c.id}>`) : `</${c.name}:${c.id}>`).flat().join(', ')}`)
        .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
        .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [CommandsEb] });
});
exports.commandsSlashComand = commandsSlashComand;
