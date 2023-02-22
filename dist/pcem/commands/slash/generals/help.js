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
exports.helpSlashCommand = exports.helpScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
exports.helpScb = new discord_js_1.SlashCommandBuilder()
    .setName("help")
    .setNameLocalization('es-ES', 'ayuda')
    .setDescription(`👋 Do you need help? I can help you.`)
    .setDescriptionLocalization('es-ES', '👋 ¿Necesitas ayuda?, te puedo ayudar')
    .toJSON();
const helpSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { guild, user, locale } = int, isEnglish = locale == 'en-US';
    const { color, emoji, serverInvite, botInvite } = db_1.botDB;
    const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    yield int.deferReply();
    const HelpEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `${isEnglish ? 'Hello' : 'Hola'} ${(author === null || author === void 0 ? void 0 : author.nickname) || (author === null || author === void 0 ? void 0 : author.user.username)}`, iconURL: int.user.displayAvatarURL() })
        .setTitle(isEnglish ? `I am multifunctional ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} Bot` : `Soy **${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username}** Bot multi funcional`)
        .setThumbnail(((_c = client.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL()) || null)
        .setColor(color.bot)
        .setTimestamp();
    const HelpButtons = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setLabel(isEnglish ? 'Invite me' : 'Invitame')
        .setEmoji('📨')
        .setStyle(discord_js_1.ButtonStyle.Link)
        .setURL(botInvite), new discord_js_1.ButtonBuilder()
        .setLabel(isEnglish ? 'Support server' : 'Servidor de soporte')
        .setEmoji('🔧')
        .setStyle(discord_js_1.ButtonStyle.Link)
        .setURL(serverInvite));
    if (int.guildId == db_1.botDB.serverId) {
        HelpEb
            .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
            .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." });
    }
    else {
        HelpEb
            .setDescription(isEnglish ?
            `To see my commands you can use my command </commands:1075587552133783612>\n\n*If you want to report a bug or you don't know how a command works you can join my support server*` :
            `Para ver mis comandos puede utilizar mi comando </commands:1075587552133783612>\n\n*Si quieres reportar un fallo o no sabes como funciona un comando puedes unirte a mi servidor de soporte*`);
    }
    (0, functions_1.sendMessageSlash)(int, { embeds: [HelpEb], components: [HelpButtons] });
});
exports.helpSlashCommand = helpSlashCommand;
