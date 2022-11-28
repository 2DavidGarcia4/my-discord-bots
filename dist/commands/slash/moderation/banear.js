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
exports.banearSlashCommand = exports.banearScb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.banearScb = new discord_js_1.SlashCommandBuilder()
    .setName("banear")
    .setDescription(`⛔ Banea a un miembro o usuario externo del servidor.`)
    .addStringOption(razon => razon.setName("razón").setDescription(`📝 Proporciona la razón por la que banearas al miembro o usuario externo.`).setRequired(true))
    .addUserOption(miembro => miembro.setName("miembro").setDescription(`🧑 Proporciona el miembro a banear.`).setRequired(false))
    .addStringOption(id => id.setName(`id`).setDescription(`🆔 ID del miembro o usuario externo a banear.`).setRequired(false))
    .toJSON();
const banearSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { guild, options } = int, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(int.user.id), { color, emoji } = db_1.botDB;
    __1.estadisticas.comandos++;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), channelLog = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
    const razon = options.getString("razón", true), preMember = options.getUser("miembro"), preId = options.getString("id"), userId = (preMember === null || preMember === void 0 ? void 0 : preMember.id) || preId || '';
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(preId && !Number(preId)),
            `La ID proporcionada *(${preId})* no es valida ya que no es numérica.`
        ],
        [
            Boolean(!preMember && !preId),
            `No has proporcionado el miembro o usuario externo a banear.`
        ],
        [
            Boolean(preMember && preId),
            `No proporciones un miembro y una ID a la vez.`
        ],
        [
            Boolean(razon.length > 600),
            `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`
        ],
        [
            Boolean(userId == ((_b = client.user) === null || _b === void 0 ? void 0 : _b.id)),
            `El miembro que has proporcionado *(${guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userId)})* soy yo, yo no me puedo banear a mi mismo.`
        ],
        [
            Boolean(userId == int.user.id),
            `El miembro que has proporcionado *(${guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userId)})* esres tu, no te puedes banear a ti mismo.`
        ],
        [
            Boolean((_c = (yield (guild === null || guild === void 0 ? void 0 : guild.bans.fetch()))) === null || _c === void 0 ? void 0 : _c.some(s => s.user.id == userId)),
            `El usuario con la id *${userId}* ya se encuentra baneado.`
        ]
    ]))
        return;
    client.users.fetch(userId, { force: true }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userId), isBot = user.bot;
        const banearEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .setColor(color.negative)
            .setTimestamp();
        const banearMdEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail((guild === null || guild === void 0 ? void 0 : guild.iconURL({ size: 1024 })) || null)
            .setTitle("⛔ Has sido baneado")
            .setDescription(`**de:** ${guild === null || guild === void 0 ? void 0 : guild.name}\n\n📑 **Razón:** ${razon}`)
            .setFooter({ text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
            .setColor(color.negative)
            .setTimestamp();
        const logEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
            .setTitle("📝 Registro del comando /banear")
            .setColor(color.negative)
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();
        if (user.id != ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.ownerId)) {
            if ((0, functions_1.setSlashErrors)(int, [
                [
                    Boolean(user.id == (guild === null || guild === void 0 ? void 0 : guild.ownerId)),
                    `El miembro que has proporcionado *(${member})* es mi creador y el dueño del servidor, **¿Qué intentas hacer?**.`
                ],
                [
                    Boolean((member && author) && member.roles.highest.comparePositionTo(author.roles.highest) >= 0),
                    `El miembro que has proporcionado *(${member})* es mi creador y el dueño del servidor, **¿Qué intentas hacer?**.`
                ]
            ]))
                return;
        }
        yield int.deferReply();
        if (member) {
            banearEb
                .setTitle(`⛔ ${isBot ? 'Bot' : 'Miembro'} baneado`)
                .setDescription(`${isBot ? '🤖 **Ex bot:**' : '👤 **Ex miembro:**'} ${user}\n**ID:** ${user.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });
            if (!isBot)
                member.send({ embeds: [banearMdEb] });
            member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | ${isBot ? 'Bot' : 'Miembro'} baneado: ${user.tag}, ID: ${user.id} | Razón: ${razon}` }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendMessageSlash)(int, { embeds: [banearEb] });
            }));
            logEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `${isBot ? '🤖 **Ex bot' : '👤 **Ex miembro'} baneado:**`, value: `${user}\n**ID:** ${user.id}` }, { name: "📑 **Razón:**", value: `${razon}` });
        }
        else {
            banearEb
                .setTitle(`⛔ ${isBot ? 'Bot' : 'Miembro'} baneado`)
                .setDescription(`${isBot ? '🤖 **Bot externo:**' : '👤 **Usuario externo:**'} ${user}\n**ID:** ${user.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() });
            guild === null || guild === void 0 ? void 0 : guild.members.ban(user, { deleteMessageSeconds: 7 * 24 * 60 * 60, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | ${isBot ? 'Bot' : 'Usuario'} baneado: ${user.tag}, ID: ${user.id} | Razón: ${razon}` }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendMessageSlash)(int, { embeds: [banearEb] });
            }));
            logEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `${isBot ? '🤖 **Bot' : '👤 **Usuario'} externo baneado:**`, value: `${user}\n**ID:** ${user.id}` }, { name: "📑 **Razón:**", value: `${razon}` });
        }
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [logEb] });
    })).catch((er) => __awaiter(void 0, void 0, void 0, function* () {
        (0, functions_1.setSlashError)(int, `La ID que has proporcionado *(${preId})* no es una ID de ningún usuario de Discord.`);
        console.log('catch', er);
        // await int.deferReply()
    }));
}); //? lineas 285 
exports.banearSlashCommand = banearSlashCommand;
