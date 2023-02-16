"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = exports.helpCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const db_1 = require("../../../db");
exports.name = "help";
const helpCommand = (msg, client) => {
    var _a, _b, _c;
    const { member, guild, guildId } = msg;
    msg.channel.sendTyping();
    const HelpEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${(member === null || member === void 0 ? void 0 : member.nickname) || (member === null || member === void 0 ? void 0 : member.user.username)}`, iconURL: member === null || member === void 0 ? void 0 : member.user.displayAvatarURL() })
        .setTitle(`Soy **${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}** Bot multi funcional`)
        .setThumbnail(((_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL()) || null)
        .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
        .setColor(((_c = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White')
        .setTimestamp();
    if (guildId == db_1.botDB.serverId) {
        HelpEb
            .setDescription(`**Bot publico** y personalizado de este servidor, ¿necesitas información o ayuda?`)
            .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." });
    }
    else {
        HelpEb
            .setDescription(`Usa el comando \`\`${db_1.botDB.prefix}comandos\`\` para conocer todos mis comandos.\nMi prefijo en este servidor es: \`\`${db_1.botDB.prefix}\`\`\n[📨 **Invítame a tu servidor**](${'https://invitation.com'})\n[🔧 **Servidor de soporte**](${db_1.botDB.serverInvite})`);
    }
    (0, functions_1.sendMessageText)(msg, { embeds: [HelpEb] });
};
exports.helpCommand = helpCommand;
exports.alias = ['ayuda'];
