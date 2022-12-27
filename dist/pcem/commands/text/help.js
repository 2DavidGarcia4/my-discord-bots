"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpCommand = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../db");
const functions_1 = require("../../../utils/functions");
const helpCommand = (msg, client) => {
    var _a, _b, _c, _d, _e, _f, _g;
    msg.channel.sendTyping();
    const embedMen = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
        .setThumbnail(((_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL()) || null)
        .setTitle(`Soy ${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username}`)
        .setDescription(`**El bot de ${(_c = msg.guild) === null || _c === void 0 ? void 0 : _c.name}**, ¿necesitas información o ayuda?`)
        .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: `Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>.` }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." })
        .setColor(((_e = (_d = msg.guild) === null || _d === void 0 ? void 0 : _d.members.me) === null || _e === void 0 ? void 0 : _e.displayHexColor) || 'White')
        .setFooter({ text: ((_f = msg.guild) === null || _f === void 0 ? void 0 : _f.name) || 'undefined', iconURL: ((_g = msg.guild) === null || _g === void 0 ? void 0 : _g.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageText)(msg, { embeds: [embedMen] });
};
exports.helpCommand = helpCommand;
