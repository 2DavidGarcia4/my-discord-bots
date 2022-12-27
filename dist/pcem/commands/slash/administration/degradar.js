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
exports.degradarSlashCommand = exports.degradarScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../utils/functions");
exports.degradarScb = new discord_js_1.SlashCommandBuilder()
    .setName(`degradar`)
    .setDescription(`🛗 Degrada de rango a un miembro del personal.`)
    .addUserOption(miembro => miembro.setName(`miembro`)
    .setDescription(`🧑 Miembro del personal a degradar.`)
    .setRequired(true)).toJSON();
const degradarSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { options, user, guild } = int, { serverId } = db_1.botDB, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const dataPer = yield models_1.personalModel.findById(serverId), arrayPr = dataPer === null || dataPer === void 0 ? void 0 : dataPer.personal;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), channelLog = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.staff) || '');
    const roles = dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.roles, member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser('miembro', true).id);
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean((member === null || member === void 0 ? void 0 : member.id) == int.user.id),
            `El miembro que has proporcionado *(${member})* eres tu, no te puedes degradar a ti mismo.`
        ],
        [
            Boolean(member === null || member === void 0 ? void 0 : member.user.bot),
            `El miembro que has proporcionado *(${member})* es un bot, no puedes degradar a un bot.`
        ],
        [
            Boolean(!(arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.some(s => s.id == (member === null || member === void 0 ? void 0 : member.id)))),
            `El miembro que has proporcionado *(${member})* no es miembro del personal por lo tanto no lo pueden degradar.`
        ],
        [
            Boolean(((_b = arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id))) === null || _b === void 0 ? void 0 : _b.rango) == 1),
            `El miembro que has proporcionado *(${member})* no puede ser degradado ya que tiene el rango mas bajo el cual es **Cazador de alianzas**.`
        ]
    ]))
        return;
    const persona = arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id));
    if (!persona)
        return;
    let rol = roles === null || roles === void 0 ? void 0 : roles[Number(persona === null || persona === void 0 ? void 0 : persona.rango) - 2];
    dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.roles.filter(f => f != rol).map(m => member === null || member === void 0 ? void 0 : member.roles.remove(m));
    member === null || member === void 0 ? void 0 : member.roles.add(rol || '');
    if (!(member === null || member === void 0 ? void 0 : member.roles.cache.has((dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.rolID) || ''))) {
        member === null || member === void 0 ? void 0 : member.roles.add((dataPer === null || dataPer === void 0 ? void 0 : dataPer.datos.rolID) || '');
    }
    persona.rango--;
    persona === null || persona === void 0 ? void 0 : persona.historial.push({ fecha: Date.now(), accion: `Fue degradado/a al rango ${(persona === null || persona === void 0 ? void 0 : persona.rango) == 1 ? "**Cazador/a de alianzas**" : (persona === null || persona === void 0 ? void 0 : persona.rango) == 2 ? "**Ayudante**" : (persona === null || persona === void 0 ? void 0 : persona.rango) == 3 ? "**Moderador**" : "**Administrador**"} por **${int.user.tag}** *(id: ${int.user.id})*.` });
    const embAcenso = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
        .setTitle(`🛗 Degradado`)
        .setDescription(`${member} ha sido degradado de rango al rango ${persona.rango == 2 ? "**Ayudante**" : persona.rango == 3 ? "**Moderador**" : persona.rango == 4 ? "**Administrador**" : "**Ejecutivo**"} por ${int.user}.`)
        .setColor(((_d = (_c = int.guild) === null || _c === void 0 ? void 0 : _c.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White')
        .setFooter({ text: (member === null || member === void 0 ? void 0 : member.nickname) || (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setTimestamp();
    int.reply({ embeds: [embAcenso] });
    const embRegistro = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
        .setTitle(`📝 Registro del comando /ascender`)
        .addFields({ name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `🛗 **Miembro del personal degradado:**`, value: `${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}` }, { name: `🎖️ **Rango:**`, value: `${persona.rango == 2 ? "Ayudante" : persona.rango == 3 ? "Moderador" : persona.rango == 4 ? "Administrador" : "Ejecutivo"}` })
        .setColor("#D93800")
        .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
        .setTimestamp();
    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embRegistro] });
    yield models_1.personalModel.findByIdAndUpdate(serverId, { personal: arrayPr });
});
exports.degradarSlashCommand = degradarSlashCommand;
