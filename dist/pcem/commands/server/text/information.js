"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.informationCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
exports.name = "information";
const informationCommand = (msg) => {
    var _a, _b, _c;
    if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has('Administrator')))
        return;
    const embInformacion = new discord_js_1.EmbedBuilder({
        title: `${db_1.botDB.emoji.information} Información`,
        description: 'En el menú desplegable de abajo encontraras varias opciones, elije una para obtener información sobre ella.'
    }).setColor(((_c = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White');
    const menu = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId("información")
        .setPlaceholder(`📚 ¡Selecciona una opción!`)
        .addOptions([
        {
            label: `Servidor`,
            emoji: `💚`,
            description: `Muestra información del servidor.`,
            value: `servidor`
        },
        {
            label: `Categoría importante`,
            emoji: `💠`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-importante`
        },
        {
            label: `Categoría colaboradores`,
            emoji: `💎`,
            description: `Muestra información de la categoría.`,
            value: `categoría-colaboradores`
        },
        {
            label: `Categoría Promociones VIP`,
            emoji: `✨`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-promociones-vip`
        },
        {
            label: `Categoría promociónate`,
            emoji: `📣`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-promociónate`
        },
        {
            label: `Categoría general`,
            emoji: `🧭`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-general`
        },
        {
            label: `Categoría user x user`,
            emoji: `👥`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-user-x-user`
        },
        {
            label: `Categoría entretenimiento`,
            emoji: `🎮`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-entretenimiento`
        },
        {
            label: `Categoría audio`,
            emoji: `🔊`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-audio`
        },
        {
            label: `Categoría registros`,
            emoji: `📝`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-registros`
        },
        {
            label: `Categoría soporte`,
            emoji: `🔰`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-soporte`
        },
        {
            label: `Categoría estadísticas`,
            emoji: `📊`,
            description: `Muestra información de los canales de esa categoría.`,
            value: `categoría-estadísticas`
        },
        {
            label: `Roles exclusivos`,
            emoji: `🏆`,
            description: `Muestra información de todos los roles exclusivos.`,
            value: `roles-exclusivos`
        },
        {
            label: `Roles personales`,
            emoji: `🧑`,
            description: `Muestra información de todos los roles personales.`,
            value: `roles-personales`
        },
        {
            label: `Roles de ping`,
            emoji: `🔔`,
            description: `Muestra información de todos los roles de ping o notificaciones.`,
            value: `roles-ping`
        },
        {
            label: `Roles de nivel`,
            emoji: `🎖️`,
            description: `Muestra información de todos los roles de nivel.`,
            value: `roles-nivel`
        },
        {
            label: `Roles color`,
            emoji: `🌈`,
            description: `Muestra información de todos los roles de color.`,
            value: `roles-color`
        },
        {
            label: `Roles de economía`,
            emoji: `💸`,
            description: `Muestra información de todos los roles de economía.`,
            value: `roles-economía`
        },
        {
            label: `Roles del personal`,
            emoji: `👮`,
            description: `Muestra información de los roles del personal del servidor.`,
            value: `roles-personal`
        },
        {
            label: `Otros roles`,
            emoji: `♻️`,
            description: `Muestra información de todos los demás roles.`,
            value: `otros-roles`
        },
        {
            label: `Bot del servidor`,
            emoji: `🤖`,
            description: `Muestra información del bot del servidor.`,
            value: `bot-servidor`
        },
    ]));
    msg.channel.send({ embeds: [embInformacion], components: [menu] }).then(() => {
        msg.delete();
    });
};
exports.informationCommand = informationCommand;
