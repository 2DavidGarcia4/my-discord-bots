"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpSlashCommand = exports.helpScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.helpScb = new discord_js_1.SlashCommandBuilder()
    .setName("help")
    .setNameLocalization('es-ES', 'ayuda')
    .setDescription(`👋 Do you need help? I can help you.`)
    .setDescriptionLocalization('es-ES', '👋 ¿Necesitas ayuda?, te puedo ayudar')
    .toJSON();
const helpSlashCommand = async (int, client) => {
    const { guild, user, locale } = int, isEnglish = locale == 'en-US';
    const { color, emoji, serverInvite, botInvite } = db_1.botDB;
    const author = guild?.members.cache.get(user.id);
    await int.deferReply();
    const HelpEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `${isEnglish ? 'Hello' : 'Hola'} ${author?.nickname || author?.user.username}`, iconURL: int.user.displayAvatarURL() })
        .setTitle(isEnglish ? `I am multifunctional ${client.user?.username} Bot` : `Soy **${client.user?.username}** Bot multi funcional`)
        .setThumbnail(client.user?.displayAvatarURL() || null)
        .setColor((0, utils_1.getEmbedColor)(guild))
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
};
exports.helpSlashCommand = helpSlashCommand;
