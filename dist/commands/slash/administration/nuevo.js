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
exports.nuevoSlashCommand = exports.nuevoScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.nuevoScb = new discord_js_1.SlashCommandBuilder()
    .setName('nuevo')
    .setDescription(`Nuevo algo`)
    .addSubcommand(cazador => cazador.setName(`cazador-alianzas`)
    .setDescription(`🏹 Se registra al nuevo cazador de alianzas y se le da los roles correspondientes.`)
    .addUserOption(miembro => miembro.setName(`cazador`).setDescription(`🧑 Nuevo cazador de alianzas.`).setRequired(true)))
    .addSubcommand(ayudante => ayudante.setName(`ayudante`)
    .setDescription(`🔷 Se registra al nuevo ayudante en la DB y se le da los roles correspondientes.`)
    .addUserOption(miembro => miembro.setName(`ayudante`).setDescription(`🧑 Nuevo ayudante.`).setRequired(true))).toJSON();
const nuevoSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { guild, user, options } = int, subCommand = options.getSubcommand(true), author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id), { serverId } = db_1.botDB;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), channelLog = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.staff) || '');
    const dataPer = yield models_1.personalModel.findById(serverId), arrayPr = dataPer === null || dataPer === void 0 ? void 0 : dataPer.personal;
    if (subCommand == "cazador-alianzas") {
        const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser("cazador", true).id);
        if (!dataPer)
            return;
        const miembroPr = arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id));
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(member === null || member === void 0 ? void 0 : member.user.bot),
                `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser cazador de alianzas.`
            ],
            [
                Boolean(miembroPr === null || miembroPr === void 0 ? void 0 : miembroPr.miembro),
                `El miembro que has proporcionado *(${member})* ya es miembro del personal.`
            ]
        ]))
            return;
        yield int.deferReply();
        if (miembroPr) {
            member === null || member === void 0 ? void 0 : member.roles.add([dataPer.datos.rolID, dataPer.datos.roles[0]]);
            miembroPr.miembro = true;
            miembroPr.rango = 1;
        }
        else {
            member === null || member === void 0 ? void 0 : member.roles.add([dataPer.datos.rolID, dataPer.datos.roles[0]]);
            arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.push({ id: (member === null || member === void 0 ? void 0 : member.id) || '', tag: (member === null || member === void 0 ? void 0 : member.user.tag) || '', rango: 1, miembro: true, historial: [{ fecha: Date.now(), accion: (miembroPr ? `Volvió a formar parte del personal del servidor con el rango **Cazador/a de alianzas** por **${int.user.tag}** *(id: ${int.user.id})*.` : `Formo parte del personal del servidor con el rango **Cazador/a de alianzas** por **${int.user.tag}** *(id: ${int.user.id})*.`) }] });
        }
        yield models_1.personalModel.findByIdAndUpdate(serverId, { personal: arrayPr });
        const NuevoCazadorEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || user.username, iconURL: user.displayAvatarURL() })
            .setTitle(`🏹 Nuevo cazador de alianzas`)
            .setDescription(miembroPr ? `${member} volvió a ser miembro del personal del servidor con el rango **Cazador/a de alianzas**.` : `Ahora ${member} es nuevo/a miembro del personal del servidor con el rango **Cazador/a de alianzas**.`)
            .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
            .setFooter({ text: (member === null || member === void 0 ? void 0 : member.nickname) || (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
            .setTimestamp();
        (0, functions_1.sendMessageSlash)(int, { embeds: [NuevoCazadorEb] });
        const LogEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `Ejecutado por ${user.tag}`, iconURL: user.displayAvatarURL() })
            .setTitle(`📝 Registro del comando /nuevo cazador-alianzas`)
            .addFields({ name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `🏹 **Nuevo cazador de alianzas:**`, value: `${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}` })
            .setColor("#00F0FF")
            .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
            .setTimestamp();
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [LogEb] });
    }
    if (subCommand == "ayudante") {
        const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser("ayudante", true).id);
        if (!dataPer)
            return;
        const miembroPr = arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id));
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(member === null || member === void 0 ? void 0 : member.user.bot),
                `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser ayudante.`
            ],
            [
                Boolean(miembroPr === null || miembroPr === void 0 ? void 0 : miembroPr.miembro),
                `El miembro que has proporcionado *(${member})* ya es miembro del personal.`
            ]
        ]))
            return;
        yield int.deferReply();
        if (miembroPr) {
            member === null || member === void 0 ? void 0 : member.roles.add([dataPer.datos.rolID, dataPer.datos.roles[1]]);
            miembroPr.miembro = true;
            miembroPr.rango = 2;
        }
        else if (member) {
            member === null || member === void 0 ? void 0 : member.roles.add([dataPer.datos.rolID, dataPer.datos.roles[1]]);
            arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.push({ id: member.id, tag: member.user.tag, rango: 2, miembro: true, historial: [{ fecha: Date.now(), accion: (miembroPr ? `Volvió a formar parte del personal del servidor con el rango **Ayudante** por **${int.user.tag}** *(id: ${int.user.id})*.` : `Formo parte del personal del servidor con el rango **Ayudante** por **${int.user.tag}** *(id: ${int.user.id})*.`) }] });
        }
        yield models_1.personalModel.findByIdAndUpdate(serverId, { personal: arrayPr });
        const NuevoAyudanteEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || (user === null || user === void 0 ? void 0 : user.username) || 'undefined', iconURL: user === null || user === void 0 ? void 0 : user.displayAvatarURL() })
            .setTitle(`🔷 Nuevo ayudante`)
            .setDescription(miembroPr ? `${member} volvió a ser miembro del personal del servidor con el rango **Ayudante**.` : `Ahora ${member} es nuevo/a miembro del personal del servidor con el rango **Ayudante**.`)
            .setColor(((_c = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White')
            .setFooter({ text: (member === null || member === void 0 ? void 0 : member.nickname) || (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
            .setTimestamp();
        (0, functions_1.sendMessageSlash)(int, { embeds: [NuevoAyudanteEb] });
        const logEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
            .setTitle(`📝 Registro del comando /nuevo ayudante`)
            .addFields({ name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `🔷 **Nuevo ayudante:**`, value: `${member}\n**ID:** ${member === null || member === void 0 ? void 0 : member.id}` })
            .setColor("#00FF83")
            .setFooter({ text: (member === null || member === void 0 ? void 0 : member.user.username) || 'undefined', iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
            .setTimestamp();
        if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
            channelLog.send({ embeds: [logEb] });
    }
});
exports.nuevoSlashCommand = nuevoSlashCommand;
