"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encarcelarSlashCommand = exports.encarcelarScb = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.encarcelarScb = new discord_js_1.SlashCommandBuilder()
    .setName("encarcelar")
    .setDescription(`⛓️ Envía a un miembro a la cárcel.`)
    .addStringOption(tiempo => tiempo.setName("tiempo")
    .setDescription(`⏱️ Proporciona el tiempo en el que el miembro permanecerá en la cárcel.`)
    .setRequired(true))
    .addStringOption(razon => razon.setName("razón")
    .setDescription(`📝 Proporciona la razón por la que el miembro ira a la cárcel.`)
    .setRequired(true))
    .addUserOption(miembro => miembro.setName("miembro")
    .setDescription(`🧑 Proporciona al miembro que enviaras a la cárcel.`)
    .setRequired(false))
    .addStringOption(id => id.setName(`id`)
    .setDescription(`🆔 ID del miembro a enviar a la cárcel`)
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers)
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers)
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers).toJSON();
const encarcelarSlashCommand = async (int, client) => {
    const { options, guild, user } = int, { serverId, } = db_1.botDB, author = guild?.members.cache.get(user.id);
    const dataBot = await (0, utils_1.getBotData)(client), channelLogs = int.guild?.channels.cache.get(dataBot?.logs.moderation || '');
    const dataCrc = await models_1.carcelModel.findById(serverId), pricioners = dataCrc?.prisoners;
    const tiempo = int.options.getString("tiempo", true), razon = int.options.getString("razón", true), preMember = options.getUser("miembro"), id = int.options.getString("id"), member = preMember ? guild?.members.cache.get(preMember.id || '') : guild?.members.cache.get(id || '');
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(id && isNaN(Number(id))),
            `La ID proporcionada *(${id})* no es valida ya que no es numérica.`
        ],
        [
            !Boolean(member),
            `No has proporcionado el miembro que enviaras a la cárcel, si has proporcionado una ID no es valida.`
        ],
        [
            Boolean(preMember && id),
            `No proporciones un miembro y una ID a la vez.`
        ],
        [
            Boolean(!isNaN(Number(tiempo))),
            `El tiempo proporcionado *(${tiempo})* no es valido ya que solo son números, también proporciona una letra que indique si son minutos, horas o días.`
        ],
        [
            Boolean(!(0, ms_1.default)(tiempo)),
            `El tiempo proporcionado *(${tiempo})* es in correcto.\nEjemplos:\n**Minutos:** 3m, 5m, 20m, 60m, etc\n**Horas:** 1h, 4h, 10h, 24h, etc\n**Días:** 1d, 2d, 4d, etc.`
        ],
        [
            Boolean(razon.length > 600),
            `La razón por la que el miembro ira a la cárcel excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`
        ],
        [
            Boolean(pricioners?.some(s => s.id == member?.id)),
            `El miembro *(${member})* ya se encuentra en la cárcel.`
        ],
        [
            Boolean((0, ms_1.default)(tiempo) > (0, ms_1.default)("4d")),
            `La cantidad de tiempo que has proporcionado *(${tiempo})* supera los **4** días, 4 días es el máximo que un miembro puede estar en la cárcel.`
        ],
        [
            Boolean(member?.id == client.user?.id),
            `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo enviar a la cárcel.`
        ],
        [
            Boolean(member?.user.bot),
            `El miembro que has proporcionado *(${member})* es un bot, no puedo enviar a un bot a la cárcel.`
        ]
    ]))
        return;
    const durante = (0, ms_1.default)(tiempo) >= 86400000 ? `**${Math.floor((0, ms_1.default)(tiempo) / 86400000)}** días` : (0, ms_1.default)(tiempo) >= 3600000 ? `**${Math.floor((0, ms_1.default)(tiempo) / 3600000)}** horas` : (0, ms_1.default)(tiempo) >= 60000 ? `**${Math.floor((0, ms_1.default)(tiempo) / 60000)}** minutos` : `**${Math.floor((0, ms_1.default)(tiempo) / 1000)}** segundos`;
    const carcelEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL() })
        .setThumbnail(member?.displayAvatarURL({ size: 1024 }) || null)
        .setTitle("⛓️ Miembro enviado a la cárcel")
        .setDescription(`👤 **Miembro:** ${member}\n**ID:** ${member?.id}\n\n⏱ **Durante:** ${durante}\n\n📑 **Razón:** ${razon}`)
        .setColor("#ECDE03")
        .setTimestamp();
    const carcelMdEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL() })
        .setTitle("⛓️ Has sido enviado a la cárcel")
        .setDescription(`⏱ **Durante:** ${durante}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${int.user.tag}`)
        .setColor("#ECDE03")
        .setFooter({ text: `Incumpliste alguna regla de ${int.guild?.name}`, iconURL: int.guild?.iconURL() || undefined })
        .setTimestamp();
    const logEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setTitle("📝 Registro del comando /encarcelar")
        .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "👤 **Miembro enviado a la cárcel:**", value: `${member}\n**ID:** ${member?.id}` }, { name: "⏱ **Durante:**", value: `${durante}` }, { name: "📑 **Razón:**", value: `${razon}` })
        .setColor("#ECDE03")
        .setFooter({ text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL() })
        .setTimestamp();
    if (int.user.id == int.guild?.ownerId) {
        if (member?.id == int.user.id)
            return (0, functions_1.setSlashError)(int, `El miembro que has proporcionado *(${member})* eres tu mi creador y dueño de este servidor.`);
        await int.deferReply();
    }
    else {
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(member?.id == int.guild?.ownerId),
                `El miembro que has proporcionado *(${member})* es el dueño del servidor, ¿como se te ocurre intentar tal cosa?.`
            ],
            [
                Boolean(member?.id == int.user.id),
                `El miembro que has proporcionado *(${member})* eres tu, no te puedo enviar a la cárcel.`
            ],
            [
                Boolean((author?.roles.highest ? (member?.roles.highest.comparePositionTo(author.roles.highest) || 0) : 0) >= 0),
                `El rol mas alto del miembro que has proporcionado *(${member})* esta en una posición mayor o igual a la posición de tu rol mas alto, no puedes enviar al miembro a la cárcel.`
            ]
        ]))
            return;
        await int.deferReply();
    }
    member?.roles.add("830260549098405935").then(async (c) => {
        let text = 'null';
        member?.send({ embeds: [carcelMdEb] }).then(() => {
            text = member.nickname || member.user.username;
        }).catch(() => {
            text = `No he podido enviar el mensaje al miembro ${member.nickname || member.user.username}`;
        }).finally(() => {
            carcelEb
                .setFooter({ text, iconURL: member.displayAvatarURL() });
            (0, functions_1.sendMessageSlash)(int, { embeds: [carcelEb] });
        });
        pricioners?.push({ id: member.id, tag: member.user.tag, reazon: razon, sentence: tiempo, time: Date.now() });
        await models_1.carcelModel.findByIdAndUpdate(serverId, { prisioneros: pricioners });
    });
    if (channelLogs?.type == discord_js_1.ChannelType.GuildText)
        channelLogs.send({ embeds: [logEb] });
};
exports.encarcelarSlashCommand = encarcelarSlashCommand;
