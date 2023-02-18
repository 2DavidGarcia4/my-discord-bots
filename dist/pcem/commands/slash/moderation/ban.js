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
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.banearScb = new discord_js_1.SlashCommandBuilder()
    .setName("ban")
    .setNameLocalization('es-ES', 'banear')
    .setDescription(`⛔ Ban a member or external user from the server.`)
    .setDescriptionLocalization('es-ES', `⛔ Banea a un miembro o usuario externo del servidor.`)
    .addStringOption(reazon => reazon.setName("reazon")
    .setNameLocalization('es-ES', 'rezón')
    .setDescription('📝 The reason you will ban the member or external user.')
    .setDescriptionLocalization('es-ES', `📝 La razón por la que banearas al miembro o usuario externo.`)
    .setMinLength(4)
    .setMaxLength(800)
    .setRequired(true))
    .addUserOption(member => member.setName("member")
    .setNameLocalization('es-ES', 'miembro')
    .setDescription(`🧑 Provide the member to ban.`)
    .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro a banear.`)
    .setRequired(false))
    .addStringOption(id => id.setName(`id`)
    .setDescription(`🆔 ID of the member or external user to ban.`)
    .setDescriptionLocalization('es-ES', `🆔 ID del miembro o usuario externo a banear.`)
    .setMinLength(7)
    .setRequired(false))
    .addAttachmentOption(image => image.setName('image')
    .setNameLocalization('es-ES', 'imagen')
    .setDescription('🖼️ Image of evidence')
    .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .toJSON();
const banearSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { guild, options, locale, user } = int, isEnglish = locale == 'en-US';
    const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id), { color, emoji } = db_1.botDB;
    const dataBot = yield (0, utils_1.getBotData)(client), channelLog = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
    const reazon = options.getString("reazon", true), preMember = options.getUser("member"), preId = options.getString("id"), userId = (preMember === null || preMember === void 0 ? void 0 : preMember.id) || preId || '';
    const image = options.getAttachment('image');
    const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userId);
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(preId && !Number(preId)),
            (isEnglish ? `The provided ID *(${preId})* cannot be valid as it is not numeric.` : `La ID proporcionada *(${preId})* no puede ser valida ya que no es numérica.`)
        ],
        [
            Boolean(!preMember && !preId),
            (isEnglish ? 'You have not provided the member or external user to ban.' : `No has proporcionado el miembro o usuario externo a banear.`)
        ],
        [
            Boolean(preMember && preId),
            (isEnglish ? 'Do not provide a member and an ID at the same time.' : `No proporciones un miembro y una ID a la vez.`)
        ],
        [
            Boolean(userId == ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)),
            (isEnglish ? `The member you provided *(${member})* is me, I can't ban myself.` : `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo banear a mi mismo.`)
        ],
        [
            Boolean(userId == int.user.id),
            (isEnglish ? `The member you provided *(${member})* is you, you can't ban yourself.` : `El miembro que has proporcionado *(${member})* eres tu, no te puedes banear a ti mismo.`)
        ],
        [
            Boolean((guild === null || guild === void 0 ? void 0 : guild.ownerId) == (member === null || member === void 0 ? void 0 : member.id)),
            (isEnglish ? `The member you provided *(${member})* is the owner of the server, what are you trying to do?` : `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`)
        ],
        [
            Boolean((_b = (yield (guild === null || guild === void 0 ? void 0 : guild.bans.fetch()))) === null || _b === void 0 ? void 0 : _b.some(s => s.user.id == userId)),
            (isEnglish ? `User with id *${userId}* is already banned.` : `El usuario con la id *${userId}* ya se encuentra baneado.`)
        ],
        [
            Boolean(member && (((_c = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _c === void 0 ? void 0 : _c.roles.highest.comparePositionTo(member.roles.highest)) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role greater than or equal to my highest role, I can't ban him.` : `El miembro que has proporcionado *(${member})* tiene un rol mayor o igual a mi rol mas alto, no puedo banearlo.`)
        ],
        [
            Boolean((user.id != (guild === null || guild === void 0 ? void 0 : guild.ownerId)) && member && ((author === null || author === void 0 ? void 0 : author.roles.highest.comparePositionTo(member.roles.highest)) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role greater than or equal to your highest role, I can't ban him.` : `El miembro que has proporcionado *(${member})* tiene un rol mayor o igual a tu rol mas alto, no puedo banearlo.`)
        ],
        [
            Boolean(image && ((_d = image.contentType) === null || _d === void 0 ? void 0 : _d.split('/')[0]) != 'image'),
            (isEnglish ? `The file provided is not an image, please provide an image as evidence.` : `El archivo proporcionado no es una imagen, proporciona una imagen como evidencia.`)
        ],
        [
            Boolean(image && image.size >= 8000000),
            (isEnglish ? `The image weight is equal to or greater than **8MB**, it provides a lighter image.` : `El peso de la imagen es igual o mayor a **8MB**, proporciona una imagen mas ligera.`)
        ]
    ]))
        return;
    client.users.fetch(userId, { force: true }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f;
        const isBot = user.bot;
        const banReazon = `${reazon} | ${isEnglish ? `Banned ${isBot ? 'bot' : 'member'}` : `${isBot ? 'Bot' : 'Miembro'} baneado`}: ${user.tag} | ${isEnglish ? 'Moderator' : 'Moderador'}: ${int.user.tag} ID: ${int.user.id}`;
        const BanEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
            .setTitle('⛔ ' + (isBot ?
            (isEnglish ? 'Bot banned' : 'Bot baneado') :
            (isEnglish ? 'Member banned' : 'Miembro baneado')))
            .setDescription(isBot ?
            `🤖 **${isEnglish ? (member ? 'Former bot' : 'External bot') : (member ? 'Ex bot' : 'Bot externo')}:** ${user}\n**ID:** ${user.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}` :
            `👤 **${isEnglish ? (member ? 'Former member' : 'External user') : (member ? 'Ex miembro' : 'Usuario externo')}:** ${user}\n**ID:** ${user.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
            .setThumbnail(user.displayAvatarURL({ size: 1024, extension: ((_e = member === null || member === void 0 ? void 0 : member.avatar) === null || _e === void 0 ? void 0 : _e.includes('a_')) ? 'gif' : 'png' }))
            .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
            .setColor(color.negative)
            .setTimestamp();
        const BanDMEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail((guild === null || guild === void 0 ? void 0 : guild.iconURL({ size: 1024 })) || null)
            .setTitle("⛔ Has sido baneado/a")
            .setDescription(`**de:** ${guild === null || guild === void 0 ? void 0 : guild.name}\n\n📑 **Razón:** ${reazon}`)
            .setFooter({ text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
            .setColor(color.negative)
            .setTimestamp();
        const logEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
            .setTitle("📝 Registro del comando /banear")
            .setColor(color.negative)
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();
        if (image) {
            image.name = `evidence.${(_f = image.contentType) === null || _f === void 0 ? void 0 : _f.split('/')[1]}`;
            BanEb.setImage('attachment://' + image.name);
            BanDMEb.setImage('attachment://' + image.name);
        }
        yield int.deferReply();
        if (member) {
            if (isBot) {
                member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: banReazon }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                    (0, functions_1.sendMessageSlash)(int, { embeds: [BanEb], files: image ? [image] : [] });
                }));
            }
            else {
                member.send({ embeds: [BanDMEb], files: image ? [image] : [] }).catch(() => {
                    if (BanEb.data.footer)
                        BanEb.data.footer.text = isEnglish ? `I could not send the message to the former member ${member.user.tag}` : `No he podido enviar el mensaje al ex miembro ${member === null || member === void 0 ? void 0 : member.user.tag}`;
                }).finally(() => {
                    member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: banReazon }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                        (0, functions_1.sendMessageSlash)(int, { embeds: [BanEb], files: image ? [image] : [] });
                    }));
                });
            }
            logEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `${isBot ? '🤖 **Ex bot' : '👤 **Ex miembro'} baneado:**`, value: `${user}\n**ID:** ${user.id}` }, { name: "📑 **Razón:**", value: `${reazon}` });
        }
        else {
            guild === null || guild === void 0 ? void 0 : guild.members.ban(user, { deleteMessageSeconds: 7 * 24 * 60 * 60, reason: banReazon }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                (0, functions_1.sendMessageSlash)(int, { embeds: [BanEb], files: image ? [image] : [] });
            }));
            logEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `${isBot ? '🤖 **Bot' : '👤 **Usuario'} externo baneado:**`, value: `${user}\n**ID:** ${user.id}` }, { name: "📑 **Razón:**", value: `${reazon}` });
        }
        // if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [logEb]})
    })).catch((er) => __awaiter(void 0, void 0, void 0, function* () {
        (0, functions_1.setSlashError)(int, (isEnglish ? `The ID you provided *(${preId})* is not an ID of any Discord user.` : `La ID que has proporcionado *(${preId})* no es una ID de ningún usuario de Discord.`));
        console.log('catch band command', er);
    }));
}); //? lineas 285 
exports.banearSlashCommand = banearSlashCommand;
