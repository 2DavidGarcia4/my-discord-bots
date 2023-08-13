"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = exports.helpCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const db_1 = require("../../../db");
const utils_1 = require("../../../utils");
exports.name = "help";
const helpCommand = (msg, client) => {
    const { member, guild, guildId, author } = msg;
    const { botInvite, serverInvite } = db_1.botDB;
    const prefix = (0, utils_1.getGuildPrefix)(guild);
    msg.channel.sendTyping();
    const HelpEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${member?.nickname || author?.username}`, iconURL: member?.displayAvatarURL() })
        .setTitle(`Soy **${client.user?.username}** Bot multi funcional`)
        .setThumbnail(client.user?.displayAvatarURL() || null)
        .setColor((0, utils_1.getEmbedColor)(guild))
        .setTimestamp();
    const HelpButtons = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setLabel('Invitame')
        .setEmoji('📨')
        .setStyle(discord_js_1.ButtonStyle.Link)
        .setURL(botInvite), new discord_js_1.ButtonBuilder()
        .setLabel('Servidor de soporte')
        .setEmoji('🔧')
        .setStyle(discord_js_1.ButtonStyle.Link)
        .setURL(serverInvite));
    if (guildId == db_1.botDB.serverId) {
        HelpEb
            .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
            .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." });
    }
    else {
        HelpEb
            .setDescription(`Mi prefijo en este servidor es \`\`${prefix}\`\` \nPara ver mis comandos puede utilizar mi comando \`\`${prefix}comandos\`\`\n\n*Si quieres reportar un fallo o no sabes como funciona un comando puedes unirte a mi servidor de soporte*`);
    }
    (0, functions_1.sendMessageText)(msg, { embeds: [HelpEb], components: [HelpButtons] });
};
exports.helpCommand = helpCommand;
exports.alias = ['ayuda'];
