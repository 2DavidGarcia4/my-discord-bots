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
exports.expulsarSlashCommand = exports.expulsarScb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.expulsarScb = new discord_js_1.SlashCommandBuilder()
    .setName('expulsar')
    .setDescription(`🚪 Expulsa a un miembro del servidor.`)
    .addStringOption(razon => razon.setName('razón').setDescription(`📝 Proporciona la razón por la que expulsaras al miembro.`).setRequired(true))
    .addUserOption(miembro => miembro.setName('miembro').setDescription(`🧑 Proporciona el miembro a expulsar.`).setRequired(false))
    .addStringOption(id => id.setName(`id`).setDescription(`🆔 ID del miembro a expulsar.`).setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers).toJSON();
const expulsarSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    __1.estadisticas.comandos++;
    const { guild, user } = int, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), canalRegistro = (_b = int.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
    const razon = int.options.getString("razón", true), preMember = int.options.getUser("miembro"), id = int.options.getString("id"), member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get((preMember === null || preMember === void 0 ? void 0 : preMember.id) || id || '');
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(id && isNaN(Number(id))),
            `La ID proporcionada *(${id})* no es valida ya que no es numérica.`
        ],
        [
            Boolean(!preMember && !id),
            `No has proporcionado el miembro a expulsar.`
        ],
        [
            Boolean(preMember && id),
            `No proporciones un miembro y una ID a la vez.`
        ],
        [
            Boolean(razon.length > 600),
            `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`
        ],
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == ((_c = client.user) === null || _c === void 0 ? void 0 : _c.id)),
            `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo expulsar a mi mismo.`
        ],
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == user.id),
            `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes expulsar a ti mismo.`
        ]
    ]))
        return;
    const expulsarEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
        .setThumbnail((member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 1024 })) || null)
        .setColor("#ff8001")
        .setTimestamp();
    const expulsarMdEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (member === null || member === void 0 ? void 0 : member.user.tag) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setThumbnail((guild === null || guild === void 0 ? void 0 : guild.iconURL({ size: 1024 })) || null)
        .setTitle("<:salir12:879519859694776360> Has sido expulsado")
        .setDescription(`**de:** ${guild === null || guild === void 0 ? void 0 : guild.name}\n\n📑 **Razón:** ${razon}`)
        .setFooter({ text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setColor("#ff8001")
        .setTimestamp();
    const embRegistro = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setTitle("📝 Registro del comando /expulsar")
        .setColor("#ff8001")
        .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.tag) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setTimestamp();
    if (int.user.id != (guild === null || guild === void 0 ? void 0 : guild.ownerId)) {
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean((member === null || member === void 0 ? void 0 : member.id) == (guild === null || guild === void 0 ? void 0 : guild.ownerId)),
                `El miembro que has proporcionado *(${member})* es el dueño del servidor, ¿como se te ocurre intentar tal cosa?.`
            ],
            [
                Boolean((member && author) && member.roles.highest.comparePositionTo(author.roles.highest) >= 0),
                `El rol mas alto del miembro que has proporcionado *(${member})* esta en una posición mayor o igual a la posición de tu rol mas alto, no puedes expulsar al miembro.`
            ]
        ]))
            return;
    }
    yield int.deferReply();
    if (member === null || member === void 0 ? void 0 : member.user.bot) {
        expulsarEb
            .setTitle(`${db_1.botDB.emoji.exit} Bot expulsado`)
            .setDescription(`🤖 **Ex bot:** ${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
            .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.tag) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() });
        embRegistro
            .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "🤖 **Bot expulsado:**", value: `${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}` }, { name: "📑 **Razón:**", value: `${razon}` });
        member.kick(`Moderador: ${int.user.tag} ID: ${int.user.id} | Bot expulsado: ${member === null || member === void 0 ? void 0 : member.user.tag}, ID: ${member === null || member === void 0 ? void 0 : member.id} | Razón: ${razon}`).then(() => {
            (0, functions_1.sendMessageSlash)(int, { embeds: [expulsarEb] });
            if ((canalRegistro === null || canalRegistro === void 0 ? void 0 : canalRegistro.type) == discord_js_1.ChannelType.GuildText)
                canalRegistro.send({ embeds: [embRegistro] });
        });
    }
    else {
        embRegistro
            .setTitle(`${db_1.botDB.emoji.exit} Miembro expulsado`)
            .setDescription(`👤 **Ex miembro:** ${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`);
        embRegistro
            .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "👤 **Miembro expulsado:**", value: `${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}` }, { name: "📑 **Razón:**", value: `${razon}` });
        member === null || member === void 0 ? void 0 : member.kick(`Moderador ID: ${int.user.id} | Miembro expulsado: ${member === null || member === void 0 ? void 0 : member.user.tag}, ID: ${member === null || member === void 0 ? void 0 : member.id} | Razón: ${razon}`).then(k => {
            if ((canalRegistro === null || canalRegistro === void 0 ? void 0 : canalRegistro.type) == discord_js_1.ChannelType.GuildText)
                canalRegistro.send({ embeds: [embRegistro] });
            member === null || member === void 0 ? void 0 : member.send({ embeds: [expulsarMdEb] }).then(() => {
                expulsarEb
                    .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.tag) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() });
            }).catch(() => {
                expulsarEb
                    .setFooter({ text: `No he podido enviar el mensaje al exmiembro ${member === null || member === void 0 ? void 0 : member.user.tag}`, iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() });
            }).finally(() => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [expulsarEb] });
            });
        });
    }
}); //*? linesas 196 a 132
exports.expulsarSlashCommand = expulsarSlashCommand;
