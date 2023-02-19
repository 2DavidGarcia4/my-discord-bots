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
exports.warnSlashCommand = exports.warnScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const db_1 = require("../../../db");
exports.warnScb = new discord_js_1.SlashCommandBuilder()
    .setName('warn')
    .setNameLocalization('es-ES', 'advertir')
    .setDescription('⚠️ Warn a member from the server.')
    .setDescriptionLocalization('es-ES', '⚠️ Advertir a un miembro del servidor.')
    .addUserOption(member => member.setName('member')
    .setNameLocalization('es-ES', 'miembro')
    .setDescription(`🧑 Provide the member to be warn.`)
    .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro a advertir.`)
    .setRequired(true))
    .addStringOption(reazon => reazon.setName('reazon')
    .setNameLocalization('es-ES', 'razón')
    .setDescription(`📝 Provide the reason why you will warn the member.`)
    .setDescriptionLocalization('es-ES', `📝 Proporciona la razón por la que advertiras al miembro.`)
    .setMinLength(4)
    .setMaxLength(800)
    .setRequired(true))
    .addAttachmentOption(image => image.setName('image')
    .setNameLocalization('es-ES', 'imagen')
    .setDescription('🖼️ Image of evidence')
    .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers | discord_js_1.PermissionFlagsBits.KickMembers)
    .toJSON();
const warnSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { guild, user, options, locale } = int, isEnglish = locale == 'en-US', author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser('member', true).id), reazon = options.getString("reazon", true), image = options.getAttachment('image');
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id)),
            (isEnglish ? `The member who provided *(${member})* it's me, I can't warn myself.` : `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo advertir a mi mismo.`)
        ],
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == user.id),
            (isEnglish ? `The member you provided *(${member})* is yourself, you can't warn yourself.` : `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes advertir a ti mismo.`)
        ],
        [
            Boolean(user.bot),
            (isEnglish ? `The member you provided *(${member})* is a bot, I can't warn a bot.` : `El miembro que ha proporcionado *(${member})* es un bot, no puedo advertir un bot.`)
        ],
        [
            Boolean((guild === null || guild === void 0 ? void 0 : guild.ownerId) == (member === null || member === void 0 ? void 0 : member.id)),
            (isEnglish ? `The member you provided *(${member})* is the owner of the server, what are you trying to do?` : `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`)
        ],
        [
            Boolean(member && (((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.roles.highest.comparePositionTo(member.roles.highest)) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role or more higher than mine, I can't warn him out.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los míos, no lo puedo advertir.`)
        ],
        [
            Boolean((user.id != (guild === null || guild === void 0 ? void 0 : guild.ownerId)) && member && ((author === null || author === void 0 ? void 0 : author.roles.highest.comparePositionTo(member.roles.highest)) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role or more higher than yours, you can't warn them.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los tuyos, no lo puedes advertir.`)
        ],
        [
            Boolean(image && ((_c = image.contentType) === null || _c === void 0 ? void 0 : _c.split('/')[0]) != 'image'),
            (isEnglish ? `The file provided is not an image, please provide an image as evidence.` : `El archivo proporcionado no es una imagen, proporciona una imagen como evidencia.`)
        ],
        [
            Boolean(image && image.size >= 8000000),
            (isEnglish ? `The image weight is equal to or greater than **8MB**, it provides a lighter image.` : `El peso de la imagen es igual o mayor a **8MB**, proporciona una imagen mas ligera.`)
        ]
    ]))
        return;
    const WarnEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.avatarURL() || undefined })
        .setTitle(`${db_1.botDB.emoji.exit} ` + (isEnglish ? 'Member warned' : `Miembro advertido`))
        .setDescription(`🧑 **${isEnglish ? 'Member' : 'Miembro'}:** ${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
        .setThumbnail((member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 1024, extension: ((_d = member.avatar) === null || _d === void 0 ? void 0 : _d.includes('a_')) ? 'gif' : 'png' })) || null)
        .setColor("#E5DA00")
        .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
        .setTimestamp();
    const WarnDMEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (member === null || member === void 0 ? void 0 : member.user.tag) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setThumbnail((guild === null || guild === void 0 ? void 0 : guild.iconURL({ size: 1024 })) || null)
        .setTitle(`${db_1.botDB.emoji.exit} Has sido advertido/a`)
        .setDescription(`**en:** ${guild === null || guild === void 0 ? void 0 : guild.name}\n\n📑 **Razón:** ${reazon}`)
        .setFooter({ text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setColor("#E5DA00")
        .setTimestamp();
    if (image) {
        image.name = `evidence.${(_e = image.contentType) === null || _e === void 0 ? void 0 : _e.split('/')[1]}`;
        WarnEb.setImage('attachment://' + image.name);
        WarnDMEb.setImage('attachment://' + image.name);
    }
    yield int.deferReply();
    member === null || member === void 0 ? void 0 : member.send({ embeds: [WarnDMEb], files: image ? [image] : [] }).catch(() => {
        if (WarnEb.data.footer)
            WarnEb.data.footer.text = isEnglish ? `I could not send the message to the former member ${member.user.tag}` : `No he podido enviar el mensaje al ex miembro ${member === null || member === void 0 ? void 0 : member.user.tag}`;
    }).finally(() => {
        (0, functions_1.sendMessageSlash)(int, { embeds: [WarnEb], files: image ? [image] : [] });
    });
});
exports.warnSlashCommand = warnSlashCommand;
