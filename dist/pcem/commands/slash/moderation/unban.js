"use strict";
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
const desbanearSlashCommand = async (int, client) => {
    const { guild, options, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(int.user.id), { emoji, color } = db_1.botDB;
    const dataBot = await (0, utils_1.getBotData)(client), channelLog = guild?.channels.cache.get(dataBot?.logs.moderation || '');
    const id = options.getString('id', true);
    if (!Number(id))
        return (0, functions_1.setSlashError)(int, (isEnglish ? `The provided ID *(${id})* cannot be valid as it is not numeric.` : `La ID proporcionada *(${id})* no puede ser valida ya que no es numérica.`));
    if (!(await guild?.bans.fetch())?.some(s => s.user.id == id))
        return (0, functions_1.setSlashError)(int, (isEnglish ? `The user *(<@${id}>)* is not banned.` : `El usuario *(<@${id}>)* no esta baneado.`));
    client.users.fetch(id, { force: true }).then(async (user) => {
        const isBot = user.bot;
        const unbanReazon = `${isEnglish ? `Unbanned ${isBot ? 'bot' : 'user'}` : `${isBot ? 'Bot' : 'User'} desbaneado`}: ${user.tag} | ${isEnglish ? 'Moderator' : 'Moderador'}: ${int.user.tag} ID: ${int.user.id}`;
        const UnbanEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined })
            .setTitle(emoji.afirmative + ' ' + (isEnglish ?
            `Unbanned ${isBot ? 'bot' : 'user'}` :
            `${isBot ? 'Bot' : 'Usuario'} desbaneado`))
            .setDescription(`**${isEnglish ? (isBot ? '🤖 Bot' : '🧑 User') : (isBot ? '🤖 Bot' : '🧑 Usuario')}:** ${user}\n**ID:** ${user.id}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
            .setThumbnail(user.displayAvatarURL({ size: 1024, extension: user?.avatar?.includes('a_') ? 'gif' : 'png' }))
            .setFooter({ text: guild?.name || '', iconURL: guild?.iconURL() || undefined })
            .setColor(color.afirmative)
            .setTimestamp();
        const UnbanLogEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
            .setTitle("📝 Registro del comando /desbanear")
            .setColor(color.afirmative)
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();
        await int.deferReply();
        if (user.bot) {
            UnbanLogEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "🤖 **Bot desbaneado:**", value: `${user}\n**ID:** ${user.id}` });
        }
        else {
            UnbanLogEb
                .addFields({ name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}` }, { name: "👤 **Usuario desbaneado:**", value: `${user}\n**ID:** ${user.id}` });
        }
        guild?.members.unban(user.id, unbanReazon).then(() => {
            (0, functions_1.sendMessageSlash)(int, { embeds: [UnbanEb] });
        });
        // if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [UnbanLogEb]})
    }).catch(c => {
        (0, functions_1.setSlashError)(int, `${isEnglish ? `The ID you provided *(${id})* is not an ID of any Discord user` : `La ID que has proporcionado *(${id})* no es una ID de ningún usuario de Discord`}.`);
    });
};
exports.desbanearSlashCommand = desbanearSlashCommand;
