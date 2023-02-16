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
exports.desbanearSlashCommand = exports.desbanearScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.desbanearScb = new discord_js_1.SlashCommandBuilder()
    .setName("unban")
    .setNameLocalization('es-ES', "desbanear")
    .setDescription(`❎ Unban a user from the server.`)
    .setDescriptionLocalization('es-ES', `❎ Des banea a un usuario del servidor.`)
    .addStringOption(id => id.setName("id")
    .setDescription(`🆔 ID of the user to unban.`)
    .setDescriptionLocalization('es-ES', `🆔 ID del usuario a desbanear.`)
    .setRequired(true))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .toJSON();
const desbanearSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { guild, options, locale } = int, isEnglish = locale == 'en-US', author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(int.user.id), { emoji, color } = db_1.botDB;
    const dataBot = yield (0, utils_1.getBotData)(client), channelLog = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
    const id = options.getString('id', true);
    if (!Number(id))
        return (0, functions_1.setSlashError)(int, (isEnglish ? `The provided ID *(${id})* cannot be valid as it is not numeric.` : `La ID proporcionada *(${id})* no puede ser valida ya que no es numérica.`));
    if (!((_a = (yield (guild === null || guild === void 0 ? void 0 : guild.bans.fetch()))) === null || _a === void 0 ? void 0 : _a.some(s => s.user.id == id)))
        return (0, functions_1.setSlashError)(int, (isEnglish ? `The user *(<@${id}>)* is not banned.` : `El usuario *(<@${id}>)* no esta baneado.`));
    const moderatorTxt = isEnglish ? 'Moderator' : 'Moderador';
    client.users.fetch(id, { force: true }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const UnbanEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
            .setThumbnail(user.displayAvatarURL({ size: 1024, extension: 'png' }))
            .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || '', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
            .setColor(color.afirmative)
            .setTimestamp();
        const UnbanLogEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
            .setTitle("📝 Registro del comando /desbanear")
            .setColor(color.afirmative)
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();
        yield int.deferReply();
        if (user.bot) {
            UnbanEb
                .setTitle(`${emoji.afirmative} ${isEnglish ? 'Unbanned bot' : 'Bot desbaneado'}`)
                .setDescription(`🤖 **Bot:** ${user}\n**ID:** ${user.id}\n\n👮 **${moderatorTxt}:** ${int.user}`);
            guild === null || guild === void 0 ? void 0 : guild.members.unban(user.id, `${moderatorTxt}: ${int.user.tag} ID: ${int.user.id} | ${isEnglish ? 'Unbanned bot' : 'Bot desbaneado'}: ${user.tag}, ID: ${user.id}`).then(k => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [UnbanEb] });
            });
            UnbanLogEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "🤖 **Bot desbaneado:**", value: `${user}\n**ID:** ${user.id}` });
        }
        else {
            UnbanEb
                .setTitle(`${emoji.afirmative} ${isEnglish ? 'Unbanned user' : 'Usuario desbaneado'}`)
                .setDescription(`👤 **Usuario:** ${user}\n**ID:** ${user.id}\n\n👮 **Moderador:** ${int.user}`);
            guild === null || guild === void 0 ? void 0 : guild.members.unban(user.id, `${moderatorTxt}: ${int.user.tag} ID: ${int.user.id} | ${isEnglish ? 'Unbanned user' : 'Usuario desbaneado'}: ${user.tag}, ID: ${user.id}`).then(k => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [UnbanEb] });
            });
            UnbanLogEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "👤 **Usuario desbaneado:**", value: `${user}\n**ID:** ${user.id}` });
        }
        // if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [UnbanLogEb]})
    })).catch(c => {
        (0, functions_1.setSlashError)(int, `${isEnglish ? `The ID you provided *(${id})* is not an ID of any Discord user` : `La ID que has proporcionado *(${id})* no es una ID de ningún usuario de Discord`}.`);
    });
});
exports.desbanearSlashCommand = desbanearSlashCommand;
