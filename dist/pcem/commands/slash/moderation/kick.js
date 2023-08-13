"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expulsarSlashCommand = exports.expulsarScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.expulsarScb = new discord_js_1.SlashCommandBuilder()
    .setName('kick')
    .setNameLocalization('es-ES', 'expulsar')
    .setDescription(`🚪 Kick a member from the server.`)
    .setDescriptionLocalization('es-ES', `🚪 Expulsa a un miembro del servidor.`)
    .addUserOption(member => member.setName('member')
    .setNameLocalization('es-ES', 'miembro')
    .setDescription(`🧑 Provide the member to be kicked.`)
    .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro a expulsar.`)
    .setRequired(true))
    .addStringOption(reazon => reazon.setName('reazon')
    .setNameLocalization('es-ES', 'razón')
    .setDescription(`📝 Provide the reason why you will expel the member.`)
    .setDescriptionLocalization('es-ES', `📝 Proporciona la razón por la que expulsaras al miembro.`)
    .setMinLength(4)
    .setMaxLength(800)
    .setRequired(true))
    .addAttachmentOption(image => image.setName('image')
    .setNameLocalization('es-ES', 'imagen')
    .setDescription('🖼️ Image of evidence')
    .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers)
    .toJSON();
const expulsarSlashCommand = async (int, client) => {
    const { guild, user, options, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(user.id);
    const dataBot = await (0, utils_1.getBotData)(client), canalRegistro = int.guild?.channels.cache.get(dataBot?.logs.moderation || '');
    const reazon = options.getString("reazon", true), member = guild?.members.cache.get(options.getUser('member', true).id), image = options.getAttachment('image');
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(member?.id == client.user?.id),
            (isEnglish ? `The member who provided *(${member})* is me, I can't kick myself.` : `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo expulsar a mi mismo.`)
        ],
        [
            Boolean(member?.id == user.id),
            (isEnglish ? `The member you provided *(${member})* is yourself, you can't kick yourself.` : `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes expulsar a ti mismo.`)
        ],
        [
            Boolean(guild?.ownerId == member?.id),
            (isEnglish ? `The member you provided *(${member})* is the owner of the server, what are you trying to do?` : `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`)
        ],
        [
            Boolean(member && (guild?.members.me?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role or more higher than mine, I can't kick him out.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los míos, no lo puedo expulsar.`)
        ],
        [
            Boolean((user.id != guild?.ownerId) && member && (author?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
            (isEnglish ? `The member you provided *(${member})* has a role or more higher than yours, you can't kick them.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los tuyos, no lo puedes expulsar.`)
        ],
        [
            Boolean(image && image.contentType?.split('/')[0] != 'image'),
            (isEnglish ? `The file provided is not an image, please provide an image as evidence.` : `El archivo proporcionado no es una imagen, proporciona una imagen como evidencia.`)
        ],
        [
            Boolean(image && image.size >= 8000000),
            (isEnglish ? `The image weight is equal to or greater than **8MB**, it provides a lighter image.` : `El peso de la imagen es igual o mayor a **8MB**, proporciona una imagen mas ligera.`)
        ]
    ]))
        return;
    const KickEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined })
        .setTitle(`${db_1.botDB.emoji.exit} ` + (member?.user.bot ?
        (isEnglish ? `Bot kicked` : `Bot expulsado`) :
        (isEnglish ? 'Member kicked' : `Miembro expulsado`)))
        .setDescription(member?.user.bot ?
        `🤖 **${isEnglish ? 'Former bot' : 'Ex bot'}:** ${member}\n**ID:** ${member?.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}` :
        `🧑 **${isEnglish ? 'Former member' : 'Ex miembro'}:** ${member}\n**ID:** ${member?.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
        .setThumbnail(member?.displayAvatarURL({ size: 1024, extension: member.avatar?.includes('a_') ? 'gif' : 'png' }) || null)
        .setColor("#ff8001")
        .setTimestamp()
        .setFooter({ text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined });
    const KickDMEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL() })
        .setThumbnail(guild?.iconURL({ size: 1024 }) || null)
        .setTitle(`${db_1.botDB.emoji.exit} Has sido expulsado/a`)
        .setDescription(`**de:** ${guild?.name}\n\n📑 **Razón:** ${reazon}`)
        .setFooter({ text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setColor("#ff8001")
        .setTimestamp();
    const KickLogEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setTitle("📝 Registro del comando /expulsar")
        .setColor("#ff8001")
        .setFooter({ text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL() })
        .setTimestamp();
    if (image) {
        image.name = `evidence.${image.contentType?.split('/')[1]}`;
        KickEb.setImage('attachment://' + image.name);
        KickDMEb.setImage('attachment://' + image.name);
    }
    const isBot = user.bot;
    const kickReazon = `${reazon} | ${isEnglish ? `Kicked ${isBot ? 'bot' : 'member'}` : `${isBot ? 'Bot' : 'Miembro'} expulsado`}: ${member?.user.tag} | ${isEnglish ? 'Moderator' : 'Moderador'}: ${user.tag} ID: ${user.id}`;
    await int.deferReply();
    if (isBot) {
        KickLogEb
            .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "🤖 **Bot expulsado:**", value: `${member}\n**ID:** ${member?.id}` }, { name: "📑 **Razón:**", value: `${reazon}` });
        member?.kick(kickReazon).then(() => {
            (0, functions_1.sendMessageSlash)(int, { embeds: [KickEb], files: image ? [image] : [] });
            // if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({embeds: [KickLogEb]})
        });
    }
    else {
        KickLogEb
            .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "👤 **Miembro expulsado:**", value: `${member}\n**ID:** ${member?.id}` }, { name: "📑 **Razón:**", value: `${reazon}` });
        member?.kick(kickReazon).then(k => {
            // if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({embeds: [KickLogEb]})
            member?.send({ embeds: [KickDMEb], files: image ? [image] : [] }).catch(() => {
                if (KickEb.data.footer)
                    KickEb.data.footer.text = isEnglish ? `I could not send the message to the former member ${member.user.tag}` : `No he podido enviar el mensaje al ex miembro ${member?.user.tag}`;
            }).finally(() => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [KickEb], files: image ? [image] : [] });
            });
        });
    }
};
exports.expulsarSlashCommand = expulsarSlashCommand;
