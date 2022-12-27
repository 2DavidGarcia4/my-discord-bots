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
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../utils/functions");
exports.desbanearScb = new discord_js_1.SlashCommandBuilder()
    .setName("desbanear")
    .setDescription(`✅ Des banea a un usuario del servidor.`)
    .addStringOption(id => id.setName("id").setDescription(`🆔 ID del usuario a desbanear.`).setRequired(true))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .toJSON();
const desbanearSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { guild, options } = int, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(int.user.id), { emoji, color } = db_1.botDB;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), channelLog = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
    const id = options.getString('id', true);
    __1.estadisticas.comandos++;
    if (!Number(id))
        return (0, functions_1.setSlashError)(int, `La ID proporcionada *(${id})* no es valida ya que no es numérica.`);
    if (!((_b = (yield (guild === null || guild === void 0 ? void 0 : guild.bans.fetch()))) === null || _b === void 0 ? void 0 : _b.some(s => s.user.id == id)))
        return (0, functions_1.setSlashError)(int, `El usuario *(${id})* no esta baneado.`);
    client.users.fetch(id, { force: true }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const desbanearEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
            .setColor(color.afirmative)
            .setTimestamp();
        const logEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
            .setTitle("📝 Registro del comando /desbanear")
            .setColor(color.afirmative)
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();
        yield int.deferReply();
        if (user.bot) {
            desbanearEb
                .setTitle(`${emoji.afirmative} Bot desbaneado`)
                .setDescription(`🤖 **Bot:** ${user}\n**ID:** ${user.id}\n\n👮 **Moderador:** ${int.user}`);
            guild === null || guild === void 0 ? void 0 : guild.members.unban(user.id, `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot desbaneado: ${user.tag}, ID: ${user.id}`).then(k => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [desbanearEb] });
            });
            logEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "🤖 **Bot desbaneado:**", value: `${user}\n**ID:** ${user.id}` });
        }
        else {
            desbanearEb
                .setTitle(`${emoji.afirmative} Usuario desbaneado`)
                .setDescription(`👤 **Usuario:** ${user}\n**ID:** ${user.id}\n\n👮 **Moderador:** ${int.user}`);
            guild === null || guild === void 0 ? void 0 : guild.members.unban(user.id, `Moderador: ${int.user.tag} ID: ${int.user.id} | Usuario desbaneado: ${user.tag}, ID: ${user.id}`).then(k => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [desbanearEb] });
            });
            logEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "👤 **Usuario desbaneado:**", value: `${user}\n**ID:** ${user.id}` });
        }
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [logEb] });
    })).catch(c => {
        (0, functions_1.setSlashError)(int, `La ID que has proporcionado *(${id})* no es una ID de ningún usuario de Discord.`);
    });
});
exports.desbanearSlashCommand = desbanearSlashCommand;
