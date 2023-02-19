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
exports.saySlashCommand = exports.sayScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const db_1 = require("../../../db");
exports.sayScb = new discord_js_1.SlashCommandBuilder()
    .setName('say')
    .setNameLocalization('es-ES', 'decir')
    .setDescription('🗣️ I can say what you want.')
    .setDescriptionLocalization('es-ES', '🗣️ Puedo decir lo que quieras.')
    .addStringOption(text => text.setName('text')
    .setNameLocalization('es-ES', 'texto')
    .setDescription('📄 The text to say.')
    .setDescriptionLocalization('es-ES', '📄 El texto para decir.')
    .setMaxLength(600)
    .setRequired(true)).toJSON();
const saySlashCommand = (int) => {
    const { user, guild, options, locale } = int, isEnglish = locale == 'en-US', author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    let text = options.getString('text', true);
    if (!(author === null || author === void 0 ? void 0 : author.permissions.has('Administrator')))
        text = text.replace(/@/g, '');
    const isAdmin = author === null || author === void 0 ? void 0 : author.permissions.has('Administrator');
    const links = text.split(/ +/g).find(f => ["discord.gg/", "discord.com/invite/", 'http'].some(s => f.includes(s)));
    if ((!isAdmin) && (links === null || links === void 0 ? void 0 : links.length))
        return (0, functions_1.setSlashError)(int, (isEnglish ?
            `The text you provided contains links or invites to servers, I can't say something that contains links or invites.` :
            `El texto que has proporcionada contiene enlaces o invitaciones a servidores, no puedo decir algo que contenga enlaces o invitaciones.`));
    const SayEb = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.loop} ` + (isEnglish ? 'Sending message...' : 'Enviando mensaje..'))
        .setColor('Blurple');
    int.reply({ ephemeral: true, embeds: [SayEb] }).then(() => {
        var _a;
        (_a = int.channel) === null || _a === void 0 ? void 0 : _a.sendTyping();
        setTimeout(() => {
            var _a;
            (_a = int.channel) === null || _a === void 0 ? void 0 : _a.send({ content: text }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                SayEb.setTitle(`${db_1.botDB.emoji.afirmative} ` + (isEnglish ? 'Message sent' : 'Mensaje enviado'))
                    .setColor('Green');
                yield int.editReply({ embeds: [SayEb] });
            })).catch(() => {
                SayEb.setTitle(`${db_1.botDB.emoji.negative} ` + (isEnglish ? 'An error has occurred' : 'Ha ocurrido un error'))
                    .setColor('Red');
            });
        }, 4000);
    });
};
exports.saySlashCommand = saySlashCommand;
