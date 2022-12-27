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
exports.ascenderSlashCommand = exports.ascenderScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../utils/functions");
exports.ascenderScb = new discord_js_1.SlashCommandBuilder()
    .setName(`ascender`)
    .setDescription(`🛗 Haciende de rango a un miembro del personal.`)
    .addUserOption(miembro => miembro.setName(`miembro`).setDescription(`🧑 Miembro del personal a ascender.`).setRequired(true)).toJSON();
const ascenderSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { options, guild, user } = int, { serverId } = db_1.botDB, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const dataPer = yield models_1.personalModel.findById(serverId), arrayPr = dataPer === null || dataPer === void 0 ? void 0 : dataPer.personal;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), channelLog = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.staff) || '');
    const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser('miembro', true).id);
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == int.user.id),
            `El miembro que has proporcionado *(${member})* eres tu, no te puedens ascender a ti mismo.`
        ],
        [
            Boolean(member === null || member === void 0 ? void 0 : member.user.bot),
            `El miembro que has proporcionado *(${member})* es un bot, no puedes ascender a un bot.`
        ],
        [
            Boolean(!(arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.some(s => s.id == (member === null || member === void 0 ? void 0 : member.id)))),
            `El miembro que has proporcionado *(${member})* no es miembro del personal por lo tanto no lo pueden ascender.`
        ],
        [
            Boolean(((_b = arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id))) === null || _b === void 0 ? void 0 : _b.rango) == 5),
            `El miembro que has proporcionado *(${member})* no puede ser ascendido ya que tiene el rango mas alto el cual es **Ejecutivo**.`
        ]
    ]))
        return;
    const persona = arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id));
    if (!persona)
        return;
    const rol = dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.roles[persona.rango];
    (_c = dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.roles.filter((f) => f != rol)) === null || _c === void 0 ? void 0 : _c.map((m) => member === null || member === void 0 ? void 0 : member.roles.remove(m));
    member === null || member === void 0 ? void 0 : member.roles.add(rol || '');
    if (!(member === null || member === void 0 ? void 0 : member.roles.cache.has((dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.rolID) || ''))) {
        member === null || member === void 0 ? void 0 : member.roles.add((dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.rolID) || '');
    }
    persona.rango++;
    persona.historial.push({ fecha: Date.now(), accion: `Fue ascendido/a al rango ${persona.rango == 2 ? "**Ayudante**" : persona.rango == 3 ? "**Moderador**" : persona.rango == 4 ? "**Administrador**" : "**Ejecutivo**"} por **${int.user.tag}** *(id: ${int.user.id})*.` });
    const embAcenso = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || user.username, iconURL: int.user.displayAvatarURL() })
        .setTitle(`🛗 Acendido`)
        .setDescription(`${member} ha sido ascendido de rango al rango ${persona.rango == 2 ? "**Ayudante**" : persona.rango == 3 ? "**Moderador**" : persona.rango == 4 ? "**Administrador**" : "**Ejecutivo**"} por ${int.user}.`)
        .setColor(((_e = (_d = int.guild) === null || _d === void 0 ? void 0 : _d.members.me) === null || _e === void 0 ? void 0 : _e.displayHexColor) || 'White')
        .setFooter({ text: (member === null || member === void 0 ? void 0 : member.nickname) || (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setTimestamp();
    int.reply({ embeds: [embAcenso] });
    const embRegistro = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setTitle(`📝 Registro del comando /ascender`)
        .addFields({ name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `🛗 **Miembro del personal ascendido:**`, value: `${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}` }, { name: `🎖️ **Rango:**`, value: `${persona.rango == 2 ? "Ayudante" : persona.rango == 3 ? "Moderador" : persona.rango == 4 ? "Administrador" : "Ejecutivo"}` })
        .setColor("#00C624")
        .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setTimestamp();
    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embRegistro] });
    yield models_1.personalModel.findByIdAndUpdate(serverId, { personal: arrayPr });
});
exports.ascenderSlashCommand = ascenderSlashCommand;
