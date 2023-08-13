"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = exports.helpCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
exports.name = "help";
const helpCommand = (msg, client) => {
    msg.channel.sendTyping();
    const embedMen = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
        .setThumbnail(client.user?.displayAvatarURL() || null)
        .setTitle(`Soy ${client.user?.username}`)
        .setDescription(`**El bot de ${msg.guild?.name}**, ¿necesitas información o ayuda?`)
        .addFields({ name: `${db_1.botDB.emoji.information} **Información**`, value: `Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>.` }, { name: `${db_1.botDB.emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." })
        .setColor(msg.guild?.members.me?.displayHexColor || 'White')
        .setFooter({ text: msg.guild?.name || 'undefined', iconURL: msg.guild?.iconURL() || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageText)(msg, { embeds: [embedMen] });
};
exports.helpCommand = helpCommand;
exports.alias = ['ayuda'];
