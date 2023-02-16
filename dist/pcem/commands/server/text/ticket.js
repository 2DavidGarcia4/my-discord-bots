"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
exports.name = "ticket";
const ticketCommand = (msg) => {
    var _a, _b, _c, _d, _e;
    if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has('Administrator')))
        return;
    const embTicket = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.ticket} Tickets`)
        .setDescription(`Para crear un ticket has clic en el botón de abajo.`)
        .addFields({ name: `❓ **¿Qué es un Ticket?**`, value: `Es un canal privado en el cual solo tu y el equipo de soporte pueden ver y utilizar, en el cual el equipo se encargará de resolver tus dudas y ayudarte en lo que necesites y esté a nuestro alcance.` }, { name: `⛔ **¿Qué no debes de hacer?**`, value: `No debes de abrir tickets solo por diversión y no trates mal a el miembro de soporte que te atienda, nosotros seremos amables contigo, en caso de que algún miembro no te trate bien repórtalo por MD a <@717420870267830382>.` })
        .setColor(((_c = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White')
        .setFooter({ text: ((_d = msg.guild) === null || _d === void 0 ? void 0 : _d.name) || 'undefined', iconURL: ((_e = msg.guild) === null || _e === void 0 ? void 0 : _e.iconURL()) || undefined })
        .setTimestamp();
    const boton = new discord_js_1.ActionRowBuilder()
        .addComponents([
        new discord_js_1.ButtonBuilder()
            .setCustomId("crearTicket")
            .setEmoji("962127203645136896")
            .setLabel("Crear ticket")
            .setStyle(discord_js_1.ButtonStyle.Success)
    ]);
    msg.channel.send({ embeds: [embTicket], components: [boton] }).then(() => {
        msg.delete().catch(c => console.log(c));
    });
};
exports.ticketCommand = ticketCommand;
