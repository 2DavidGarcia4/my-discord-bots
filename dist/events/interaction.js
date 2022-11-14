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
exports.interactionEvent = exports.slashComands = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const __1 = require("..");
const models_1 = require("../models");
// Generals
const webs_1 = require("../commands/slash/generals/webs");
const ping_1 = require("../commands/slash/generals/ping");
const ayuda_1 = require("../commands/slash/generals/ayuda");
const reglas_1 = require("../commands/slash/generals/reglas");
const plantilla_1 = require("../commands/slash/generals/plantilla");
const informacion_1 = require("../commands/slash/generals/informacion");
const estadisticas_1 = require("../commands/slash/generals/estadisticas");
const clasificaciones_1 = require("../commands/slash/generals/clasificaciones");
const sugerir_1 = require("../commands/slash/generals/sugerir");
const usuario_1 = require("../commands/contextMenu/usuario");
const rolesBase_1 = require("../commands/contextMenu/rolesBase");
// Staff
const examen_1 = require("../commands/slash/staff/examen");
const crear_1 = require("../commands/slash/staff/crear");
// Moderation
const limpiar_1 = require("../commands/slash/moderation/limpiar");
const encarcelar_1 = require("../commands/slash/moderation/encarcelar");
const expulsar_1 = require("../commands/slash/moderation/expulsar");
const banear_1 = require("../commands/slash/moderation/banear");
const desbanear_1 = require("../commands/slash/moderation/desbanear");
// Administration
const historial_1 = require("../commands/slash/administration/historial");
const ascender_1 = require("../commands/slash/administration/ascender");
const degradar_1 = require("../commands/slash/administration/degradar");
const finalizar_1 = require("../commands/slash/administration/finalizar");
const marcar_1 = require("../commands/slash/administration/marcar");
const nuevo_1 = require("../commands/slash/administration/nuevo");
const reroll_1 = require("../commands/slash/administration/reroll");
const functions_1 = require("../utils/functions");
exports.slashComands = new discord_js_1.Collection();
const cmds = [
    webs_1.websScb, ping_1.pingScb, ayuda_1.ayudaScb, reglas_1.reglasScb, plantilla_1.plantillaScb, informacion_1.informacionScb, estadisticas_1.estadisticasScb, clasificaciones_1.clasificacionesScb, sugerir_1.sugerirScb, usuario_1.usuarioCmcb, rolesBase_1.rolesBaseCmcb,
    examen_1.examenScb, crear_1.crearScb,
    limpiar_1.limpiarScb, encarcelar_1.encarcelarScb, expulsar_1.expulsarScb, banear_1.banearScb, desbanear_1.desbanearScb,
    historial_1.historialSmb, ascender_1.ascenderScb, degradar_1.degradarScb, finalizar_1.finalizarScb, marcar_1.marcarScb, nuevo_1.nuevoScb, reroll_1.rerollScb
];
cmds.forEach((cmd, ps) => exports.slashComands.set(cmd.name, cmd));
const interactionEvent = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { emoji, owners, color, serverId } = db_1.botDB;
    if (int.isChatInputCommand()) {
        const { commandName } = int;
        //? Generals
        if (commandName == 'webs')
            (0, webs_1.websSlashCommand)(int);
        if (commandName == 'sugerir')
            (0, sugerir_1.sugerirSlashCommand)(int);
        if (commandName == 'información')
            (0, informacion_1.informacionSlashCommand)(int);
        if (commandName == 'ping')
            (0, ping_1.pingSlashCommand)(int, client);
        if (commandName == 'ayuda')
            (0, ayuda_1.ayudaSlashCommand)(int, client);
        if (commandName == 'reglas')
            (0, reglas_1.reglasSlashCommand)(int, client);
        if (commandName == 'plantilla')
            (0, plantilla_1.plantillaSlashCommand)(int, client);
        if (commandName == 'estadísticas')
            (0, estadisticas_1.estadisticasSlashCommand)(int, client);
        if (commandName == 'clasificaciones')
            (0, clasificaciones_1.clasificacionesSlashCommand)(int, client);
        //? Staff
        if (commandName == 'examen')
            (0, examen_1.examenSlashCommand)(int);
        if (commandName == 'crear')
            (0, crear_1.crearSlashCommand)(int, client);
        //? Moderation
        if (commandName == 'limpiar')
            (0, limpiar_1.limpiarSlashCommand)(int, client);
        if (commandName == 'encarcelar')
            (0, encarcelar_1.encarcelarSlashCommand)(int, client);
        if (commandName == 'expulsar')
            (0, expulsar_1.expulsarSlashCommand)(int, client);
        if (commandName == 'banear')
            (0, banear_1.banearSlashCommand)(int, client);
        if (commandName == 'desbanear')
            (0, desbanear_1.desbanearSlashCommand)(int, client);
        //? Administration
        if (commandName == 'historial')
            (0, historial_1.historialSlashCommand)(int, client);
        if (commandName == 'ascender')
            (0, ascender_1.ascenderSlashCommand)(int, client);
        if (commandName == 'degradar')
            (0, degradar_1.degradarSlashCommand)(int, client);
        if (commandName == 'finalizar')
            (0, finalizar_1.finalizarSlashCommand)(int, client);
        if (commandName == 'marcar')
            (0, marcar_1.marcarSlashCommadn)(int, client);
        if (commandName == 'nuevo')
            (0, nuevo_1.nuevoSlashCommand)(int, client);
        if (commandName == 'reroll')
            (0, reroll_1.rerollSlashCommand)(int);
    }
    if (int.isContextMenuCommand()) {
        const { commandName, commandType } = int;
        if (commandType == discord_js_1.ApplicationCommandType.User) {
            if (commandName == 'Usuario')
                (0, usuario_1.usuarioContextMenu)(int);
            if (commandName == 'Roles base')
                (0, rolesBase_1.rolesBaseContextMenu)(int);
        }
    }
    if (int.isButton()) {
        const { customId, guild, user } = int;
        if (customId == 'eliminarMsgMD')
            int.message.delete();
        //? Sistema de sugerencias
        if (customId == 'confirmar') {
            const dataSug = yield models_1.suggestionsModel.findById(serverId), statsSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.sugerencias, arrayMsgSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes, arrayMiemSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.miembros, canalRevicion = client.channels.cache.get("831773866228449280");
            if (!statsSug)
                return;
            let posicion = 0;
            if (arrayMsgSug) {
                for (let i = 0; i < arrayMsgSug.length; i++) {
                    if (arrayMsgSug[i].autorID === user.id)
                        posicion = i;
                }
            }
            let suger = dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes[posicion].sugerencia;
            console.log(suger);
            const embCanfirmada = new discord_js_1.EmbedBuilder()
                .setTitle(`${emoji.afirmative} Acción confirmada`)
                .setDescription(`**¡Tu sugerencia ha sido enviada al personal del servidor!**\nPara que la revisen y determinen si es apta o no para ser publicada en <#828300239488024587>.`)
                .setColor("#00ff00")
                .setFooter({ text: `Se te notificara al MD en cualquiera de los 2 casos.` });
            int.update({ embeds: [embCanfirmada], components: [] });
            const revicionEb = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setTitle("🔎 Sugerencia esperando revisión")
                .addFields({ name: `✉️ **Sugerencia:**`, value: `${suger}` })
                .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White')
                .setTimestamp();
            const revicionBtns = new discord_js_1.ActionRowBuilder()
                .addComponents([
                new discord_js_1.ButtonBuilder()
                    .setCustomId("aprobar")
                    .setEmoji(emoji.afirmative)
                    .setLabel("Aprobar")
                    .setStyle(discord_js_1.ButtonStyle.Success),
                new discord_js_1.ButtonBuilder()
                    .setCustomId("denegar")
                    .setEmoji(emoji.negative)
                    .setLabel("Denegar")
                    .setStyle(discord_js_1.ButtonStyle.Danger)
            ]);
            if ((canalRevicion === null || canalRevicion === void 0 ? void 0 : canalRevicion.type) == discord_js_1.ChannelType.GuildText && arrayMsgSug)
                canalRevicion.send({ embeds: [revicionEb], components: [revicionBtns] }).then((t) => __awaiter(void 0, void 0, void 0, function* () {
                    arrayMsgSug[posicion] = { id: "", origenID: t.id, autorID: int.user.id, sugerencia: suger || '', estado: "normal", positivas: 0, negativas: 0 };
                    statsSug.cantidad++;
                }));
            if (arrayMiemSug === null || arrayMiemSug === void 0 ? void 0 : arrayMiemSug.some(s => s.id === int.user.id)) {
                let posicionData = 0;
                for (let i = 0; i < arrayMiemSug.length; i++) {
                    if (arrayMiemSug[i].id === int.user.id) {
                        posicionData = i;
                    }
                }
                arrayMiemSug[posicionData].sugerencias++;
            }
            else {
                arrayMiemSug === null || arrayMiemSug === void 0 ? void 0 : arrayMiemSug.push({ id: int.user.id, sugerencias: 1, aceptadas: 0, denegadas: 0 });
            }
            yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { sugerencias: statsSug, mensajes: arrayMsgSug, miembros: arrayMiemSug });
        }
        if (customId == "cancelar") {
            const dataSug = yield models_1.suggestionsModel.findById(serverId), arrayMsgSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes;
            if (arrayMsgSug) {
                for (let i = 0; i < arrayMsgSug.length; i++) {
                    if (arrayMsgSug[i].autorID == int.user.id)
                        arrayMsgSug.splice(i, 1);
                }
            }
            yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: arrayMsgSug });
            const cancelarEb = new discord_js_1.EmbedBuilder()
                .setTitle(`${emoji.negative} Acción cancelada`)
                .setDescription(`Has cancelado la sugerencia.`)
                .setColor(color.negative);
            int.update({ embeds: [cancelarEb], components: [] });
        }
        if (customId == "aprobar") {
            const dataSug = yield models_1.suggestionsModel.findById(serverId);
            if (!dataSug)
                return;
            const arrayMsgSug = dataSug.mensajes, statsSug = dataSug.sugerencias;
            const rolSugerencia = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get('840704367467954247');
            const canalSugs = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get('828300239488024587');
            let posicion = 0;
            if (arrayMsgSug) {
                for (let i = 0; i < arrayMsgSug.length; i++) {
                    if (arrayMsgSug[i].origenID === int.message.id)
                        posicion = i;
                }
            }
            let member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get((dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes[posicion].autorID) || '');
            const sugAceptadaEb = new discord_js_1.EmbedBuilder()
                .setTitle(`${emoji.afirmative} Sugerencia aprobada`)
                .setColor(color.afirmative)
                .setFooter({ text: int.user.tag, iconURL: int.user.displayAvatarURL() })
                .setTimestamp();
            const sugerenciaEb = new discord_js_1.EmbedBuilder()
                .setTitle("✉️ Sugerencia:")
                .setDescription(`${dataSug.mensajes[posicion].sugerencia}`)
                .setColor((rolSugerencia === null || rolSugerencia === void 0 ? void 0 : rolSugerencia.hexColor) || 'White')
                .setTimestamp();
            if (member) {
                sugAceptadaEb
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    .setDescription(`Sugerencia de ${member === null || member === void 0 ? void 0 : member.user.tag} aprobada por ${user.tag}`)
                    .addFields({ name: `✉️ **Sugerencia:**`, value: `${dataSug.mensajes[posicion].sugerencia}` });
                int.update({ embeds: [sugAceptadaEb], components: [] });
                const sugAceptDmEb = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: member === null || member === void 0 ? void 0 : member.user.tag, iconURL: member === null || member === void 0 ? void 0 : member.user.displayAvatarURL() })
                    .setTitle(`${emoji.afirmative} Tu sugerencia ha sido aprobada`)
                    .setDescription(`Tu sugerencia ha sido publicada en el canal ${canalSugs}`)
                    .addFields({ name: `✉️ **Tu sugerencia:**`, value: `${dataSug.mensajes[posicion].sugerencia}` })
                    .setColor(color.afirmative)
                    .setFooter({ text: `Sugerencia aceptada por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
                    .setTimestamp();
                member.send({ embeds: [sugAceptDmEb] }).catch(() => '');
                sugerenciaEb
                    .setAuthor({ name: `Nueva sugerencia de ${member === null || member === void 0 ? void 0 : member.user.tag}`, iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() });
                member === null || member === void 0 ? void 0 : member.roles.add('830260561044176896');
                if (dataSug.miembros.some(s => s.id == (member === null || member === void 0 ? void 0 : member.id))) {
                    let posicionData = 0;
                    for (let i = 0; i < dataSug.miembros.length; i++) {
                        posicionData = i;
                    }
                    let sugerenciasDeData = dataSug.miembros[posicionData].sugerencias;
                    let aceptadasDeData = dataSug.miembros[posicionData].aceptadas;
                    let denegadasDeData = dataSug.miembros[posicionData].denegadas;
                    dataSug.miembros[posicionData] = { id: member === null || member === void 0 ? void 0 : member.id, sugerencias: sugerenciasDeData, aceptadas: aceptadasDeData + 1, denegadas: denegadasDeData };
                    yield dataSug.save();
                }
            }
            else {
                const user = yield client.users.fetch((dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes[posicion].autorID) || '', { force: true });
                sugAceptadaEb
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription(`Sugerencia de **${user.tag}** aprobada por **${int.user.tag}**.`)
                    .addFields({ name: `✉️ **Sugerencia:**`, value: `${dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes[posicion].sugerencia}` });
                int.update({ embeds: [sugAceptadaEb], components: [] });
                sugerenciaEb
                    .setAuthor({ name: `Nueva sugerencia de ${user.tag}`, iconURL: user.displayAvatarURL() });
            }
            if ((canalSugs === null || canalSugs === void 0 ? void 0 : canalSugs.type) == discord_js_1.ChannelType.GuildText)
                canalSugs.send({ embeds: [sugerenciaEb], content: "<@&840704367467954247>" }).then((tm) => __awaiter(void 0, void 0, void 0, function* () {
                    tm.react('946826193032851516');
                    tm.react('946826212960010251');
                    let orID = arrayMsgSug[posicion].origenID;
                    let miemID = arrayMsgSug[posicion].autorID;
                    let sug = arrayMsgSug[posicion].sugerencia;
                    arrayMsgSug[posicion] = { id: tm.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: "normal", positivas: 0, negativas: 0 };
                    statsSug.aceptadas++;
                }));
            yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: arrayMsgSug, sugerencias: statsSug });
        }
        if (customId == "denegar") {
            const dataSug = yield models_1.suggestionsModel.findById(serverId);
            if (!dataSug)
                return;
            const arrayMsgSug = dataSug.mensajes, statsSug = dataSug.sugerencias, membersSug = dataSug.miembros;
            let posicion = 0;
            for (let i = 0; i < dataSug.mensajes.length; i++) {
                if (dataSug.mensajes[i].origenID == int.message.id)
                    posicion = i;
            }
            const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(dataSug.mensajes[posicion].autorID);
            const denegadaEb = new discord_js_1.EmbedBuilder()
                .setTitle(`${emoji.negative} Sugerencia denegada`)
                .addFields({ name: `✉️ **Sugerencia:**`, value: `${dataSug.mensajes[posicion].sugerencia}` })
                .setColor(color.negative)
                .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
                .setTimestamp();
            if (member) {
                denegadaEb
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    .setDescription(`Sugerencia de **${member.user.tag}** denegada por **${int.user.tag}**.`);
                const denegadaDmEb = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    .setTitle(`${emoji.negative} Tu sugerencia ha sido denegada`)
                    .addFields({ name: `✉️ **Sugerencia:**`, value: `${dataSug.mensajes[posicion].sugerencia}` })
                    .setColor(color.negative)
                    .setFooter({ text: `Sugerencia denegada por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
                    .setTimestamp();
                member.send({ embeds: [denegadaDmEb] }).catch(c => console.log(c));
                if (dataSug.miembros.some(s => s.id == member.id)) {
                    let posicionData = 0;
                    for (let i = 0; i < dataSug.miembros.length; i++) {
                        posicionData = i;
                    }
                    membersSug[posicionData].denegadas++;
                }
            }
            else {
                let user = yield client.users.fetch(dataSug.mensajes[posicion].autorID, { force: true });
                denegadaEb
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription(`Sugerencia de **${user.tag}** denegada por **${user.tag}**.`);
            }
            int.update({ embeds: [denegadaEb], components: [] }).then((t) => __awaiter(void 0, void 0, void 0, function* () {
                statsSug.denegadas++;
                arrayMsgSug.splice(posicion, 1);
                yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: arrayMsgSug, sugerencias: statsSug, miembros: membersSug });
            }));
        }
        if (customId == "implementada") {
            const dataSug = yield models_1.suggestionsModel.findById(serverId);
            if (!dataSug)
                return;
            const arrayMsgSug = dataSug.mensajes, statsSug = dataSug.sugerencias;
            const channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get("828300239488024587");
            if (!(channel && channel.type == discord_js_1.ChannelType.GuildText))
                return;
            let posMar = 0;
            for (let i = 0; i < __1.sistemMarcar.length; i++) {
                if (__1.sistemMarcar[i].autorID == int.user.id)
                    posMar = i;
            }
            let posicion = 0;
            for (let i = 0; i < arrayMsgSug.length; i++) {
                if (arrayMsgSug[i].id == __1.sistemMarcar[posMar].sugID)
                    posicion = i;
            }
            const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(arrayMsgSug[posicion].autorID);
            const message = channel.messages.cache.get(arrayMsgSug[posicion].id);
            message === null || message === void 0 ? void 0 : message.reactions.removeAll();
            const embed = message === null || message === void 0 ? void 0 : message.embeds[0];
            if (!embed)
                return;
            const editedEb = new discord_js_1.EmbedBuilder({
                title: embed.title || undefined,
                fields: embed.fields,
                description: embed.description || undefined,
                timestamp: embed.timestamp || ''
            });
            // let antField = embed.fields[0]
            const nuevoField = { name: '🚥 **Estado:**', value: "**sugerencia implementada**", inline: false };
            arrayMsgSug[posicion].estado = 'implementada';
            arrayMsgSug[posicion].id = __1.sistemMarcar[posMar].sugID;
            statsSug.implementadas++;
            const estadoEb = new discord_js_1.EmbedBuilder()
                .setTitle("🚥 Estado agregado a la sugerencia")
                .setDescription(`Se le ha agregado a la sugerencia el estado 🟢 **Implementada**.`)
                .setColor("#00ff00");
            int.reply({ embeds: [estadoEb], ephemeral: true });
            member === null || member === void 0 ? void 0 : member.roles.add("946139081367240714");
            editedEb
                .setFields(nuevoField)
                .setColor(color.afirmative);
            if (member) {
                editedEb
                    .setAuthor({ name: `Sugerencia de ${member.user.tag}`, iconURL: member.displayAvatarURL() });
                const embEstadoMD = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    .setTitle("El estado de tu sugerencia a sido actualizado")
                    .setDescription(`🚥 **Estado:** sugerencia implementada`)
                    .addFields({ name: "✉️ **Sugerencia:**", value: `${dataSug.mensajes[posicion].sugerencia}` })
                    .setColor(color.afirmative)
                    .setFooter({ text: `Actualizado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() });
                member.send({ embeds: [embEstadoMD] }).catch(c => console.log(c));
            }
            else {
                editedEb.setAuthor(embed.author);
            }
            message.edit({ embeds: [editedEb] });
        }
        if (customId == "en progreso") {
            const dataSug = yield models_1.suggestionsModel.findById(serverId);
            if (!dataSug)
                return;
            const arrayMsgSug = dataSug.mensajes, statsSug = dataSug.sugerencias;
            const channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get("828300239488024587");
            if ((channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildText)
                return;
            let posMar = 0;
            for (let i = 0; i < __1.sistemMarcar.length; i++) {
                if (__1.sistemMarcar[i].autorID == int.user.id)
                    posMar = i;
            }
            let posicion = 0;
            for (let i = 0; i < dataSug.mensajes.length; i++) {
                if (dataSug.mensajes[i].id == __1.sistemMarcar[posMar].sugID)
                    posicion = i;
            }
            const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(dataSug.mensajes[posicion].autorID);
            const message = (_b = channel.messages) === null || _b === void 0 ? void 0 : _b.cache.get(dataSug.mensajes[posicion].id);
            const embed = message === null || message === void 0 ? void 0 : message.embeds[0];
            if (!embed)
                return;
            const editedEb = new discord_js_1.EmbedBuilder({
                title: embed.title || undefined,
                fields: embed.fields,
                description: embed.description || undefined,
                timestamp: embed.timestamp || ''
            });
            const nuevoField = { name: '🚥 **Estado:**', value: "__sugerencia en progreso__", inline: false };
            arrayMsgSug[posicion].id = __1.sistemMarcar[posMar].sugID;
            arrayMsgSug[posicion].estado = 'en progreso';
            statsSug.en_progreso++;
            editedEb
                .setFields(nuevoField)
                .setColor('#FFC300');
            const estadoEb = new discord_js_1.EmbedBuilder()
                .setTitle("🚥 Estado agregado a la sugerencia")
                .setDescription(`Se le ha agregado a la sugerencia el estado 🟢 **Implementada**.`)
                .setColor("#00ff00");
            int.reply({ embeds: [estadoEb], ephemeral: true });
            member === null || member === void 0 ? void 0 : member.roles.add("946139081367240714");
            const embEstado = new discord_js_1.EmbedBuilder()
                .setTitle("🚥 Estado agregado a la sugerencia")
                .setDescription(`Se le ha agregado a la sugerencia el estado 🟡 **en progreso**.`)
                .setColor("#FFC300");
            int.reply({ embeds: [embEstado], ephemeral: true });
            if (member) {
                editedEb
                    .setAuthor({ name: `Sugerencia de ${member.user.tag}`, iconURL: member.displayAvatarURL() });
                const embEstadoMD = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    .setTitle("El estado de tu sugerencia a sido actualizado")
                    .setDescription(`🚥 **Estado:** sugerencia __en progreso__`)
                    .addFields({ name: "✉️ **Sugerencia:**", value: `${dataSug.mensajes[posicion].sugerencia}` })
                    .setColor("#FFC300")
                    .setFooter({ text: `Actualizado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() });
                member.send({ embeds: [embEstadoMD] }).catch(c => console.log(c));
            }
            else {
                editedEb.setAuthor(embed.author);
            }
            yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: arrayMsgSug, sugerencias: statsSug });
        }
        if (int.customId == "no sucedera") {
            const dataSug = yield models_1.suggestionsModel.findById(serverId);
            if (!dataSug)
                return;
            const arrayMsgSug = dataSug.mensajes, statsSug = dataSug.sugerencias;
            const channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get("828300239488024587");
            if ((channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildText)
                return;
            let posMar = 0;
            for (let i = 0; i < __1.sistemMarcar.length; i++) {
                if (__1.sistemMarcar[i].autorID === int.user.id)
                    posMar = i;
            }
            let posicion = 0;
            for (let i = 0; i < dataSug.mensajes.length; i++) {
                if (dataSug.mensajes[i].id === __1.sistemMarcar[posMar].sugID)
                    posicion = i;
            }
            const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(dataSug.mensajes[posicion].autorID);
            const message = channel.messages.cache.get(dataSug.mensajes[posicion].id);
            message === null || message === void 0 ? void 0 : message.reactions.removeAll();
            let embed = message === null || message === void 0 ? void 0 : message.embeds[0];
            if (!embed)
                return;
            const editedEb = new discord_js_1.EmbedBuilder({
                title: embed.title || undefined,
                fields: embed.fields,
                description: embed.description || undefined,
                timestamp: embed.timestamp || ''
            });
            let nuevoField = { name: '🚥 **Estado:**', value: "__***no sucederá***__", inline: false };
            editedEb
                .setFields(nuevoField)
                .setColor(color.negative);
            arrayMsgSug[posicion].id = __1.sistemMarcar[posMar].sugID;
            arrayMsgSug[posicion].estado = 'no sucederá';
            statsSug.no_sucedera++;
            const embEstado = new discord_js_1.EmbedBuilder()
                .setTitle("🚥 Estado agregado a la sugerencia")
                .setDescription(`Se le ha agregado a la sugerencia el estado 🔴 **no sucederá**.`)
                .setColor(color.negative);
            int.reply({ embeds: [embEstado], ephemeral: true });
            if (member) {
                editedEb.setAuthor({ name: ``, iconURL: member.displayAvatarURL() });
                const embEstadoMD = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    .setTitle("El estado de tu sugerencia a sido actualizado")
                    .setDescription(`🚥 **Estado:** sugerencia __no sucederá__`)
                    .addFields({ name: "✉️ **Sugerencia:**", value: `${dataSug.mensajes[posicion].sugerencia}` })
                    .setColor(color.negative)
                    .setFooter({ text: `Actualizado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() });
                member.send({ embeds: [embEstadoMD] }).catch(c => console.log(c));
            }
            else {
                editedEb.setAuthor(embed.author);
            }
        }
        // if(int.customId == "normal"){
        //   let dataSug = await systemSug.findOne({_id: int.guildId})
        //   let canal = int.guild.channels.cache.get("828300239488024587")
        //   let rol = int.guild.roles.cache.get("840704367467954247")
        //   let posMar
        //   for(let i=0; i<sistemMarcar.length; i++){
        //       if(sistemMarcar[i].autorID == int.user.id){
        //           posMar = i
        //       }
        //   }
        //   let posicion 
        //   for(let i=0; i<dataSug.mensajes.length; i++){
        //       if(dataSug.mensajes[i].id == sistemMarcar[posMar].sugID){
        //           posicion = i
        //       }
        //   }
        //   let mensaje = canal.messages.cache.get(dataSug.mensajes[posicion].id)
        //   let embed = mensaje.embeds[0]
        //   embed.fields.splice(1,1)
        //   embed.color = rol.hexColor
        //   mensaje.edit({embeds: [embed]})
        //   let orID = dataSug.mensajes[posicion].origenID
        //   let auID = dataSug.mensajes[posicion].autorID
        //   let sug = dataSug.mensajes[posicion].sugerencia
        //   let positi = dataSug.mensajes[posicion].positivas
        //   let negati = dataSug.mensajes[posicion].negativas
        //   dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "normal", positivas: positi, negativas: negati}
        //   let cant = dataSug.sugerencias.cantidad
        //   let acept = dataSug.sugerencias.aceptadas
        //   let den = dataSug.sugerencias.denegadas
        //   let imple = dataSug.sugerencias.implementadas
        //   let enP = dataSug.sugerencias.en_progreso
        //   let noSus = dataSug.sugerencias.no_sucedera
        //   dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
        //   await dataSug.save()
        //   const embEstado = new Discord.MessageEmbed()
        //   .setTitle("🚥 Estado agregado a la sugerencia")
        //   .setDescription(`Se le ha agregado a la sugerencia el estado 🔵 **normal**.`)
        //   .setColor(rol.hexColor)
        //   int.reply({embeds: [embEstado], ephemeral: true})
        // }
    }
    if (int.isSelectMenu()) {
        const { customId, values, guild, user } = int;
        if (customId == 'select-type-role') {
            const guildColor = ((_c = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White';
            if (values[0] == 'access') {
                const accesEb = new discord_js_1.EmbedBuilder()
                    .setTitle(`💂 Roles de acceso`)
                    .setDescription(`Estos roles te otorgan acceso a categorías ocultas.\n*Selecciona uno para obtenerlo*\n\n**<@&1041161492126507118>:** Este rol te da acceso a la categoría *👥 User x user* en la cual hay canales en los que puedes publicar e encontrar a personas que hagan join x join, alianzas, etc.\n\n**<@&1041162293683159101>:** Este rol te da acceso a la categoría *🔞 NSFW* en la cual hay canales con contenido sexual para mayore.\n\n**<@&1041161785186725919>:** Este rol te da acceso a la categoría *📝 Registros* la cual tiene canales en los que se registran acciones en el servidor, como sanciones.\n\n**<@&1041161797434081450>:** Este rol te da acceso a la categoría *🎮 Entretenimiento* en la que encontraras canales de bots de entretenimiento como el bot de economía.`)
                    .setColor(guildColor);
                const accesMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId('acces-roles')
                    .setPlaceholder("📑 Elige varias opciones.")
                    .setMaxValues(4)
                    .addOptions([
                    {
                        emoji: '👥',
                        label: 'J4J',
                        description: 'Te da acceso a la categoría 👥 User x user.',
                        value: 'j4j'
                    },
                    {
                        emoji: '🔞',
                        label: 'NSFW',
                        description: 'Te da acceso a la categoría 🔞 NSFW.',
                        value: 'nsfw'
                    },
                    {
                        emoji: '📝',
                        label: 'Registros',
                        description: 'Te da acceso a la categoría 📝 Registros.',
                        value: 'logs'
                    },
                    {
                        emoji: '🎮',
                        label: 'Entretenimiento',
                        description: 'Te da acceso a la categoría 🎮 Entretenimiento.',
                        value: 'entertainment'
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [accesEb], components: [accesMenu] });
            }
            if (values[0] == 'colors') {
                const colorsEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🌈 Roles de colores")
                    .setDescription(`Elige una opción para obtener un rol que cambiará el color de tu nombre dentro del servidor.\n\n**<@&825913849504333874>\n\n<@&825913858446327838>\n\n<@&825913837944438815>\n\n<@&823639766226436146>\n\n<@&823639778926395393>\n\n<@&825913846571991100>\n\n<@&823639775499386881>\n\n<@&825913860992270347>\n\n<@&825913843645546506>\n\n<@&823639769300467724>\n\n<@&825913834803560481>\n\n<@&825913840981901312>\n\n<@&825913855392743444>\n\n<@&825913852654780477>**`)
                    .setColor(guildColor);
                const colorsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId("colors-roles")
                    .setPlaceholder("📑 Elige una opción para obtener un rol.")
                    .addOptions([
                    {
                        label: "Negro",
                        emoji: "🎩",
                        description: "Pinta tu nombre de color Negro.",
                        value: "negro"
                    },
                    {
                        label: "Café ",
                        emoji: "🦂",
                        description: "Pinta tu nombre de color Café .",
                        value: "cafe"
                    },
                    {
                        label: "Naranja",
                        emoji: "🍊",
                        description: "Pinta tu nombre de color Naranja.",
                        value: "naranja"
                    },
                    {
                        label: "Rojo",
                        emoji: "🍎",
                        description: "Pinta tu nombre de color Rojo.",
                        value: "rojo"
                    },
                    {
                        label: "Rosa",
                        emoji: "🌷",
                        description: "Pinta tu nombre de color Rosa.",
                        value: "rosa"
                    },
                    {
                        label: "Morado",
                        emoji: "☂️",
                        description: "Pinta tu nombre de color Morado.",
                        value: "morado"
                    },
                    {
                        label: "Azul",
                        emoji: "💧",
                        description: "Pinta tu nombre de color Azul.",
                        value: "azul"
                    },
                    {
                        label: "Azul celeste",
                        emoji: "🐬",
                        description: "Pinta tu nombre de color Azul celeste.",
                        value: "celeste"
                    },
                    {
                        label: "Cian",
                        emoji: "🧼",
                        description: "Pinta tu nombre de color Cian.",
                        value: "cian"
                    },
                    {
                        label: "Verde",
                        emoji: "🌲",
                        description: "Pinta tu nombre de color Verde.",
                        value: "verde"
                    },
                    {
                        label: "Verde Lima",
                        emoji: "🍀",
                        description: "Pinta tu nombre de color Verde Lima.",
                        value: "lima"
                    },
                    {
                        label: "Amarillo",
                        emoji: "🍌",
                        description: "Pinta tu nombre de color Amarillo.",
                        value: "amarillo"
                    },
                    {
                        label: "Gris",
                        emoji: "🐺",
                        description: "Pinta tu nombre de color Gris.",
                        value: "gris"
                    },
                    {
                        label: "Blanco",
                        emoji: "☁️",
                        description: "Pinta tu nombre de color Blanco",
                        value: "blanco"
                    }
                ]));
                int.reply({ ephemeral: true, embeds: [colorsEb], components: [colorsMenu] });
            }
            if (values[0] == 'notifications') {
                const notificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🔔 Roles de notificaciones")
                    .setDescription(`Elige una opción para obtener un rol que te notificará de nuevos anuncios, alianzas, sorteos, encuestas, eventos, sugerencias de la comunidad o postulaciones a staff del servidor o puedes obtener un rol que te notifica cuando se necesite revivir el chat general el cual es <@&850932923573338162> y puede ser muy usado.\n\n**<@&840704358949584926>\n\n<@&840704364158910475>\n\n<@&840704370387451965>\n\n<@&840704372911505418>\n\n<@&915015715239637002>\n\n<@&840704367467954247>\n\n<@&840704375190061076>\n\n<@&850932923573338162>**`)
                    .setColor(guildColor);
                const notificationsBtns = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId("notifications-roles")
                    .setPlaceholder("📑 Elige varias opciones.")
                    .setMaxValues(8)
                    .addOptions([
                    {
                        label: "Anuncios",
                        emoji: "📢",
                        description: "Te notifica cuándo haya un nuevo Anuncio.",
                        value: "anuncio"
                    },
                    {
                        label: "Alianzas",
                        emoji: "🤝",
                        description: "Te notifica cuándo haya una nueva Alianza.",
                        value: "alianza"
                    },
                    {
                        label: "Sorteos",
                        emoji: "🎉",
                        description: "Te notifica cuándo haya un nuevo Sorteo.",
                        value: "sorteo"
                    },
                    {
                        label: "Encuestas",
                        emoji: "📊",
                        description: "Te notifica cuándo haya una nueva Encuesta.",
                        value: "encuesta"
                    },
                    {
                        label: "Evento",
                        emoji: "🥳",
                        description: "Te notifica cuándo haya un nuevo Evento.",
                        value: "evento"
                    },
                    {
                        label: "Sugerencias",
                        emoji: "📧",
                        description: "Te notifica cuándo haya una nueva Sugerencia.",
                        value: "sugerencia"
                    },
                    {
                        label: "Postulaciones",
                        emoji: "📝",
                        description: "Te notifica cuándo haya una actualización sobre las Postulaciones.",
                        value: "postulacion"
                    },
                    {
                        label: "Revivir chat",
                        emoji: "❇️",
                        description: "Te notifica cuándo se necesite Revivir el chat general.",
                        value: "revivir"
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [notificationsEb], components: [notificationsBtns] });
            }
            if (values[0] == 'gender') {
                const genderEb = new discord_js_1.EmbedBuilder()
                    .setTitle("♀️♂️ Roles de género")
                    .setDescription(`Elige una opción en el menú de abajo para agregarte un rol y así determinar tu género dentro del servidor.\n\n**<@&828720344869240832>\n\n<@&828720347246624769>**`)
                    .setColor(guildColor);
                const genderBtns = new discord_js_1.ActionRowBuilder()
                    .addComponents([
                    new discord_js_1.SelectMenuBuilder()
                        .setCustomId("gender-roles")
                        .setPlaceholder("📑 Elige una opción para obtener un rol.")
                        .addOptions([
                        {
                            label: "Mujer",
                            emoji: "👩",
                            description: "Rol que te determina como mujer aquí.",
                            value: "mujer"
                        },
                        {
                            label: "Hombre",
                            emoji: "👨",
                            description: "Rol que te determina como hombre aquí.",
                            value: "hombre"
                        }
                    ])
                ]);
                int.reply({ ephemeral: true, embeds: [genderEb], components: [genderBtns] });
            }
            if (values[0] == 'age') {
                const ageEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🔢 Roles de edad")
                    .setDescription(`Elije una opción en el menú de abajo para agregarte un rol de edad y así determinar tu edad dentro del servidor.\n\n**<@&828720200924790834>\n\n<@&828720340719894579>**`)
                    .setColor(guildColor);
                const ageMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId("age-roles")
                    .setPlaceholder("📑 Elige una opción para obtener un rol.")
                    .addOptions([
                    {
                        label: "-18",
                        emoji: "🌗",
                        description: "Rol que te determina como menor de edad.",
                        value: "-18"
                    },
                    {
                        label: "+18",
                        emoji: "🌕",
                        description: "Rol que te determina como mayor de edad.",
                        value: "+18"
                    }
                ]));
                int.reply({ ephemeral: true, embeds: [ageEb], components: [ageMenu] });
            }
            if (values[0] == 'video-games') {
                const videoGamesEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🎮 Roles de videojuegos")
                    .setDescription(`Elige una o más opciones en el menú de abajo para obtener un rol del videojuego que te guste y así los demás miembros sabrán que videojuegos te gustan.\n\n**<@&886331637690953729>\n\n<@&886331642074005545>\n\n<@&886331630690631691>\n\n<@&885005724307054652>\n\n<@&886331626643152906>\n\n<@&886331634272587806>**`)
                    .setColor(guildColor);
                const videoGamesMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId("video-games-roles")
                    .setPlaceholder("📑 Elige varias opciones.")
                    .setMaxValues(6)
                    .addOptions([
                    {
                        label: "Fornite",
                        emoji: "☂️",
                        description: "Obtienes el rol de Fornite.",
                        value: "fornite"
                    },
                    {
                        label: "Minecraft",
                        emoji: "⛏️",
                        description: "Obtienes el rol de Minecraft.",
                        value: "minecraft"
                    },
                    {
                        label: "Free Fire",
                        emoji: "🔫",
                        description: "Obtienes el rol de Free Fire.",
                        value: "free"
                    },
                    {
                        label: "Roblox",
                        emoji: "💠",
                        description: "Obtienes el rol de Roblox.",
                        value: "roblox"
                    },
                    {
                        label: "GTA V",
                        emoji: "🚗",
                        description: "Obtienes el rol de GTA V.",
                        value: "GTA"
                    },
                    {
                        label: "Among Us",
                        emoji: "🔍",
                        description: "Obtienes el rol de Among Us.",
                        value: "amongus"
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [videoGamesEb], components: [videoGamesMenu] });
            }
        }
        if (customId == 'gender-roles') {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'mujer',
                    rol: '828720344869240832',
                    status: ''
                },
                {
                    value: 'hombre',
                    rol: '828720347246624769',
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == 'age-roles') {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
            const dictionary = [
                {
                    value: '-18',
                    rol: '828720200924790834',
                    status: ''
                },
                {
                    value: '+18',
                    rol: '828720340719894579',
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == "video-games-roles") {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'fornite',
                    rol: '886331637690953729',
                    status: ''
                },
                {
                    value: 'minecraft',
                    rol: '886331642074005545',
                    status: ''
                },
                {
                    value: 'free',
                    rol: '886331630690631691',
                    status: ''
                },
                {
                    value: 'roblox',
                    rol: '885005724307054652',
                    status: ''
                },
                {
                    value: 'GTA',
                    rol: '886331626643152906',
                    status: ''
                },
                {
                    value: 'amongus',
                    rol: '886331634272587806',
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == "colors-roles") {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'negro',
                    rol: '825913849504333874',
                    status: ''
                },
                {
                    value: 'cafe',
                    rol: '825913858446327838',
                    status: ''
                },
                {
                    value: 'naranja',
                    rol: '825913837944438815',
                    status: ''
                },
                {
                    value: 'rojo',
                    rol: '823639766226436146',
                    status: ''
                },
                {
                    value: 'rosa',
                    rol: '823639778926395393',
                    status: ''
                },
                {
                    value: 'morado',
                    rol: '825913846571991100',
                    status: ''
                },
                {
                    value: 'azul',
                    rol: '823639775499386881',
                    status: ''
                },
                {
                    value: 'celeste',
                    rol: '825913860992270347',
                    status: ''
                },
                {
                    value: 'cian',
                    rol: '825913843645546506',
                    status: ''
                },
                {
                    value: 'verde',
                    rol: '823639769300467724',
                    status: ''
                },
                {
                    value: 'lima',
                    rol: '825913834803560481',
                    status: ''
                },
                {
                    value: 'amarillo',
                    rol: '825913840981901312',
                    status: ''
                },
                {
                    value: 'gris',
                    rol: '825913855392743444',
                    status: ''
                },
                {
                    value: 'blanco',
                    rol: '825913852654780477',
                    status: ''
                },
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == "notifications-roles") {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'anuncio',
                    rol: '840704358949584926',
                    status: ''
                },
                {
                    value: 'alianza',
                    rol: '840704364158910475',
                    status: ''
                },
                {
                    value: 'sorteo',
                    rol: '840704370387451965',
                    status: ''
                },
                {
                    value: 'encuesta',
                    rol: '840704372911505418',
                    status: ''
                },
                {
                    value: 'evento',
                    rol: '915015715239637002',
                    status: ''
                },
                {
                    value: 'sugerencia',
                    rol: '840704367467954247',
                    status: ''
                },
                {
                    value: 'postulacion',
                    rol: '840704375190061076',
                    status: ''
                },
                {
                    value: 'revivir',
                    rol: '850932923573338162',
                    status: ''
                },
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == 'acces-roles') {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id), dictionary = [
                {
                    value: 'j4j',
                    rol: '1041161492126507118',
                    status: ''
                },
                {
                    value: 'nsfw',
                    rol: '1041162293683159101',
                    status: ''
                },
                {
                    value: 'logs',
                    rol: '1041161785186725919',
                    status: ''
                },
                {
                    value: 'entertainment',
                    rol: '1041161797434081450',
                    status: ''
                },
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == "información") {
            const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
            const dataCol = yield models_1.collaboratorsModel.findById(serverId), colaboradores = [];
            if (!dataCol)
                return;
            for (let c in dataCol.colaboradores) {
                if (dataCol.colaboradores[c].colaborador) {
                    colaboradores.push(`**<#${dataCol.colaboradores[c].canalID}>**: canal del colaborador **${(_d = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(dataCol.colaboradores[c].id)) === null || _d === void 0 ? void 0 : _d.user.tag}**.`);
                }
            }
            let infos = [
                {
                    valor: `servidor`,
                    color: ((_e = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _e === void 0 ? void 0 : _e.displayHexColor) || 'White',
                    miniatura: (guild === null || guild === void 0 ? void 0 : guild.iconURL({ size: 1024 })) || '',
                    titulo: `${guild === null || guild === void 0 ? void 0 : guild.name}`,
                    descripcion: `Es un servidor enfocado en la promoción, creado el <t:${Math.floor(((guild === null || guild === void 0 ? void 0 : guild.createdAt.valueOf()) || 0) / 1000)}:F> aquí puedes promocionarte, dar a conocer tu contenido, trabajo, redes sociales a mas personas, además de eso puedes charlar con los demás miembros del servidor, hacer amigos, entretenerte con los diversos bots de entretenimiento que tenemos, entre otras cosas.\n\n**¡Disfruta del servidor!**\n*Gracias por estar aquí*`
                },
                {
                    valor: `categoría-importante`,
                    color: `#F4F2F2`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982802288660/importante.png`,
                    titulo: `💠 Importante`,
                    descripcion: `Categoría: **<#823655193886851143>**: en esta categoría hay canales importantes que debes de revisar.\n\n> **<#823343749039259648>**: en este canal están las reglas del servidor importante que las leas y las respetes para no tener que sancionarte. \n> .\n> **<#826205120173310032>**: en este canal se publican **anuncios**, **eventos**, **sorteos**, **encuestas** y el estado de las **postulaciones** del personal del servidor, si no te quieres perder de ninguno de los anteriores y ser notificado cuando haya un rol que te notifica por cada uno puedes obtener los roles en el canal <#823639152922460170>, si quieres saber más sobre esos roles selecciona la opción **🔔 Roles de ping** en este menú.\n> .\n> **<#837563299058679828>**: en este canal se da la bienvenida a cada nuevo miembro con un mensaje automático del bot <@843185929002025030>.\n> .\n> **<#823639152922460170>**: en este canal puedes obtener roles con solo dar un clic, roles que cambian el color de tu nombre en el servidor, roles de notificaciones los cuales te notifican cuando hay una nueva actualización sobre algún tema como **anuncios**, **postulaciones**, **sorteos**, **eventos**, etc.`
                },
                {
                    valor: `categoría-colaboradores`,
                    color: `#6B6B6B`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981506248734/colaborador.png`,
                    titulo: `💎 Colaboradores`,
                    descripcion: `Categoría **<#913490278529261619>**:  en esta categoría encontrarás canales para los colaboradores del servidor, cada colaborador tendrá su canal en el cual podrá modificar el nombre y descripción de su canal cuantas veces quiera, publicar su contenido utilizando @everyone o @here una vez por día.\n\n${colaboradores.length == 0 ? "" : "**Canales de los colaboradores actuales:**\n> " + colaboradores.join("\n> .\n> ")}\n> **¿Quieres ser colaborador?** selecciona la opción **:trophy: Roles exclusivos** en este menú para obtener información sobre ello.`
                },
                {
                    valor: `categoría-promociones-vip`,
                    color: `#643602`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924983553077298/VIP.png`,
                    titulo: `✨ Promociones VIP`,
                    descripcion: `Categoría **<#827295364167237644>**: en esta categoría hay canales de promoción exclusivos los cuales solo si tienes cierto rol puedes acceder a ellos.\n\n> **<#826193847943037018>**: a este canal de promoción tienen acceso los miembros con el rol <@&826197551904325712>, en el pueden publicar o promocionar su contenido cada **6** horas y utilizar @everyone o @here pero solo **2** días a la semana y **1** vez por día.\n> .\n> **<#870884933529378846>**: a este canal de promoción solo tienen acceso los miembros que tienen el rol <@&826197378229993503>, en el canal pueden publicar o promocionar su contenido cada **4** horas.\n\n**¿Quieres saber como conseguir esos roles?**, selecciona la opción **🏆 Roles exclusivos** en el menú de información.`
                },
                {
                    valor: `categoría-promociónate`,
                    color: `#F28204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925160049381437/promocionate.png`,
                    titulo: `📣 Promociónate`,
                    descripcion: `Categoría **<#785729364288339978>**: en esta categoría están todos los canales en los que puedes hacer promoción de tu servidor, bot, redes sociales, webs y mas contenido, sin necesidad de tener algún rol o permiso.\n\n> **<#836315643070251008>** en este canal puedes promocionar todo tipo de contenido.\n> .\n> **<#823381769750577163>**: en este canal solo puedes promocionar servidores de **Discord** excepto si es un servidor **NSFW** o **+18**.\n> .\n> **<#823961526297165845>**: en este canal solo puedes promocionar videos de **YouTube** o canales del mismo.\n> .\n> **<#823381980389310464>**: en este canal solo puedes promocionar contenido de **Twitch**, directos y canales.\n> .\n> **<#827295990360965153>**: en este canal solo puedes promocionar contenido de **TikTok**, TikToks, cuentas, etc.\n> .\n> **<#823381924344758313>**: en este canal solo puedes promocionar contenido de **Twitter** como link de una cuenta, etc.\n> .\n> **<#823382007391584276>**: en este canal solo se puede promocionar contenido de **Instagram**, tu cuenta, enlaces, etc.\n> .\n> **<#833750678978822154>**: en este canal solo se puede promocionar **Páginas web**.`
                },
                {
                    valor: `categoría-general`,
                    color: `#F2D904`,
                    miniatura: ``,
                    titulo: `🧭 General`,
                    descripcion: `Categoría **<#837063475552321546>**: en esta categoría encontrarás canales en los que podrás interactuar, charlar, utilizar comandos de bots, ver memes o enviar y mas.\n\n> **<#773404850972524615>**: en este canal puedes hablar con los demás miembros del servidor, de cualquier tema no sensible.\n> .\n> **<#845396662930112533>**: en este canal puedes publicar tus memes, si tus memes tienen buena cantidad de raciones positivas puedes obtener el rol <@&912888572401561620>.\n> .\n> **<#914537165269110804>**: en este canal puedes publicar imágenes o videos del tema que quieras excepto contenido explícito o NSFW.\n> .\n> **<#978791620579299398>**: en este canal puedes hablar con otros miembros de otros servidores gracias al bot <@959204525678424064> el cual une a varios canales de otros servidores en un mismo canal.\n> . **<#834956208112795668>**: este canal es para usar los comandos de los bots que hay en el servidor.\n> .\n> **<#862803602107400232>**: en este canal lo puedes usar para desahogarte insultando, solo en el canal si lo haces en otro canal serás sancionado.\n> .\n> **<#979098277163192400>**: en este canal puedes encontrar imágenes, gifs, vídeos de contenido **NSFW** y tú mismo también puedes publicar dicho contenido.`
                },
                {
                    valor: `categoría-user-x-user`,
                    color: `#D5F204`,
                    miniatura: ``,
                    titulo: `👥 User x user`,
                    descripcion: `Categoría **<#773249398431809587>**: en esta categoría encontrarás canales para hacer join x join que es como decir si te unes me uno, también encontrarás otro tipos de canales.\n\n> **<#826203792788815894>**: en este canal puedes publicar que haces **j4j**.\n> .\n> **<#831677248611418152>**: en este canal puedes publicar **sub x sub** que significa que buscas a alguien que se subscriba a tu canal y tu al suyo.\n> .\n> **<#836447269573099540>**: en este canal puedes publicar **FxF** *(follow por follow)* de una red social.\n> .\n> **<#827296844454690816>**: en este canal puedes encontrar personas que quieran hacer alianzas.`
                },
                {
                    valor: `categoría-entretenimiento`,
                    color: `#AAF204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981984428133/entretenimiento.png`,
                    titulo: `🎮 Entretenimiento`,
                    descripcion: `Categoría **<#834865948837806110>**: en esta categoría encontrarás varios canales en los cuales puedes usar un bot para entretenerte.\n\n> **<#834893418403725342>**: en este canal puedes usar el bot **<@292953664492929025>** que es el bot de economía.\n> .\n> **<#834898232760729680>**: en este canal podrás usar a **<@429457053791158281>** otro bot que tiene una economía pero esta es mundial la cual funciona en cualquier servidor en el que este el bot.\n> .\n> **<#840272810249027604>**: en este canal puedes usar el bot **<@543567770579894272>** es un bot que tienen muchos mini juegos.\n> .\n> **<#838495529046507570>**: en este canal podrás usar a **<@356065937318871041>** un bot que adivina en que personaje famoso estas pensando por medio de preguntas.\n> .\n> **<#866328027892940801>**: en este canal podrás usar a **<@716390085896962058>**, un bot de **Pokemon**.\n> .\n> **<#942980086817239050>**: en este canal podrás usar a **<@715906723982082139>**, un bot de preguntas generales.`
                },
                {
                    valor: `categoría-audio`,
                    color: `#41F204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981263003648/audio.png`,
                    titulo: `🔊 Audio`,
                    descripcion: `Categoría **<#773249398431809588>**: en esta categoría encontrarás canales de voz en los que te puedes reunir con tus amigos para charlar o escuchar música de los bots.\n\n> **<#836671054537424906>**: en este canal puedes poner el nombre la música que quieras escuchar, el bot **<@547905866255433758>** pondrá la música en el canal de voz en el que estás.\n> .\n> **<#773250082552283208>**: este canal es un canal de voz, puedes unirte a el para escuchar música.\n> .\n> **<#828789627082637333>**: este canal es un canal de voz, en el puedes unirte con tus amigos o con un miembro del servidor para hablar.\n> .\n> **<#906925232265265163>**: este canal de voz es para el bot <@830530156048285716> el cual estará reproduciendo **24/7** música.`
                },
                {
                    valor: `categoría-registros`,
                    color: `#0AA105`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971927633757601814/registro.png`,
                    titulo: `📝 Registros`,
                    descripcion: `Categoría **<#881978653452423188>**: en esta categoría se encuentran canales que registran acciones en el servidor.\n\n> **<#833043103048925276>**: en este canal se registra cuando un miembro sube de nivel.\n> .\n> **<#858783283567394826>**: en este canal se registran las sanciones que tienen los miembros.\n> .\n> **<#824462775542743090>**: en este canal se registran los usuarios que han sido invitados por un usuario, la cantidad de usuarios invitados, etc.\n> .\n> **<#964599029927407678>**: en este canal se registra la calificaccion y reseña de cada ticket.`
                },
                {
                    valor: `categoría-soporte`,
                    color: `#05D55A`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925159789350912/soporte.png`,
                    titulo: `🔰 Soporte`,
                    descripcion: `Categoría **<#833120722695487518>**: en esta categoría hay más canales importantes en los que puedes obtener soporte o información.\n\n> **<#830165896743223327>**: en este canal puedes crear un Ticket, **¿Qué es un ticket?** es un canal creado para ti y los miembros de soporte del servidor en donde puedes resolver dudas con ellos, reportar usuario, problemas, pedir ayuda, reclamar un rol, etc.\n> .\n> **<#848992769245577256>**: en este canal esta nuestra plantilla de presentación por si piensas presentar el servidor a un amigo.\n> .\n> **<#840364744228995092>**: este canal es en el que te encuentras ahora, en el podrás obtener información casi de cualquier canal, rol, o sistema del servidor.`
                },
                {
                    valor: `categoría-estadísticas`,
                    color: `#05D5AF`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982215094323/estadisticas.png`,
                    titulo: `📊 Estadísticas`,
                    descripcion: `Categoría **<#823349416882339921>**: en esta categoría encontrarás canales que muestran datos del servidor.\n\n> **<#823349420106973204>**: este canal de voz muestra la cantidad de miembros totales en el servidor.\n> .\n> **<#823349423349301318>**: este canal de voz muestra solo los miembros que no son bots.\n> .\n> **<#823349426264997919>**: este canal de voz muestra en su nombre la cantidad de bots que hay en el servidor.`
                },
                {
                    valor: `roles-exclusivos`,
                    color: `#0590D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971912850186596382/Roles_Exclusivos.png`,
                    titulo: `🏆 Roles exclusivos`,
                    descripcion: `> **<@&865666783217713162>**: al obtener este rol consigues un canal exclusivo en la categoría **<#913490278529261619>** en el cual solo tu lo usaras, podrás publicar contenido cada **4** horas pero solo **1** vez al día con el ping @everyone o @here, podrás gestionar el canal, cambiarle de nombre, editar la descripción, tambien obtendrás un rol personalizado si lo deseas, el rol tendrá un nombre y color personalizado.\n\n> **Para obtener el rol solo hay una forma**\n> **1.** Donar **4** dólares vía [PayPal](https://www.paypal.com/paypalme/srvers).\nUna vez que hayas donado crea un ticket en el canal <#830165896743223327> reclama el rol y los beneficios.\n\n\n> **<@&826197551904325712>**: este rol te da acceso al canal <#826193847943037018> canal en el cual podrás publicar tu promoción cada **6** horas y podrás usar **2** veces a la semana el ping @everyone o @here **Martes** y **Viernes** en tu promoción el día, además que obtendrás un rol personalizado si lo deseas, el rol tendrá un nombre y color personalizado.\n\n> **Para obtener el rol hay 5 formas:**\n> **1. Invitar a **20** miembros al servidor**, para ver la cantidad de invitaciones que has hecho ejecuta el comando de barra diagonal \`\`/información miembro\`\` en el canal <#834956208112795668>, el rol se te será removido cuando los miembros que invitaste se vallan del servidor.\n> **2. Pagar 3 dólares por [PayPal](https://www.paypal.com/paypalme/srvers)**, para hacerlo abre un ticket en <#830165896743223327> o habla con <@717420870267830382>, el rol te durara **2** meses.\n> **3. Comprar el rol en economía**, en el canal <#834893418403725342>.\n> **4. Boostear el servidor o mejorarlo**.\n> **5. Ganarse el rol en un sorteo en el canal** <#826205120173310032>, *no hacemos con frecuencia sorteos de roles*.\nPara resolver cualquier duda o reclamar el rol y los beneficios abre un ticket en el canal <#830165896743223327>.`
                },
                {
                    valor: `roles-personales`,
                    color: `#0551D5`,
                    miniatura: ``,
                    titulo: `🧑 Roles personales`,
                    descripcion: `> **<@&823372926707171358>:** Este rol es el que se te otorga automáticamente al entrar al servidor.\n> **<@&828720340719894579>,<@&828720200924790834>**: Con estos roles determinas tu edad edentro del servidor.\n\n> **<@&828720344869240832>,<@&828720347246624769>**: Con estos roles determinas tu genero dentro del servidor.\n\n> **<@&886331637690953729>, <@&886331642074005545>, <@&886331630690631691>, <@&885005724307054652>, <@&886331626643152906>, <@&886331634272587806>**: Estos roles por ahora no tienen alguna utilidad en el servidor solo son para determinar los videojuegos que te gustan.\nTodos los roles anteriores los puedes obtener en el canal <#823639152922460170>.`
                },
                {
                    valor: `roles-ping`,
                    color: `#4D05D5`,
                    miniatura: `https://media.discordapp.net/attachments/842856076009144381/879941892123533322/notificacion.png?width=480&height=480`,
                    titulo: `🔔 Roles de ping`,
                    descripcion: `> **<@&850932923573338162>**: Este rol te notificará cuando se necesite **revivir el canal <#773404850972524615>**.\n> .\n> **<@&840704358949584926>**: Este rol te notificará cuando haya un nuevo **anuncio** en el canal <#826205120173310032>.\n> .\n> **<@&840704364158910475>**: Este rol te notificará cuando se haya echo una **alianza** con un servidor grande en el canal <#826863938057797633>.\n> .\n> **<@&840704367467954247>**: Este rol te notificará cuando haya un nueva **sugerencia** en el canal <#828300239488024587>.\n> .\n> **<@&840704372911505418>**: Este rol te notificará cuando haya una nueva **encuesta** en el canal <#826205120173310032>.\n> .\n> **<@&840704370387451965>**: Este rol te notificará cuando haya un nuevo **sorteo** en el canal <#826205120173310032>.\n> .\n> **<@&840704375190061076>**: Este rol te notificará cuando este activa alguna **postulación** a algún rol en el canal <#826205120173310032>.\n\nEstos puedes obtener estos roles en el canal <#823639152922460170>.`
                },
                {
                    valor: `roles-nivel`,
                    color: `#9905D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924983066533908/nivel.png`,
                    titulo: `🎖️ Roles de nivel`,
                    descripcion: `> **<@&971515126144442448>\n> <@&971515118837956699>\n> <@&971515112567476354>\n> <@&971515101502902283>\n> <@&891446820851564584>\n> <@&891446815700967434>\n> <@&876274137239265340>\n> <@&876274096990724097>\n> <@&876273903452975134>\n> <@&876273805494988821>\n> <@&838498329650003969>\n> <@&838498326512140329>\n> <@&831671377396367360>\n> <@&831671368776024104>**\n> Estos roles se te otorgan automáticamente conforme aumentes de nivel en el servidor, por ahora no tienen ninguna utilidad ni ventaja solo determinan tu nivel.`
                },
                {
                    valor: `roles-color`,
                    color: `#CC05D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981728563260/colores.png`,
                    titulo: `🌈 Roles de color`,
                    descripcion: `> **<@&825913849504333874>**\n> **<@&825913855392743444>**\n> **<@&825913858446327838>**\n> **<@&825913837944438815>**\n> **<@&823639766226436146>**\n> **<@&823639778926395393>**\n> **<@&825913846571991100>**\n> **<@&823639775499386881>**\n> **<@&825913860992270347>**\n> **<@&825913843645546506>**\n> **<@&823639769300467724>**\n> **<@&825913834803560481>**\n> **<@&825913840981901312>**\n> **<@&825913852654780477>**\n> Estos roles te permiten cambiar el color de tu nombre dentro del servidor solo ve al canal <#823639152922460170> para obtener uno de ellos y cambiar el color de tu nombre.`
                },
                {
                    valor: `roles-economía`,
                    color: `#D50589`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982483546142/economia.png`,
                    titulo: `💸 Roles de economía`,
                    descripcion: `Rol y su paga:\n> **<@&880110963955740742>**: ${emoji.money} **2,000** cada **1** hora.\n> **<@&885005987751297054>**: ${emoji.money} **6,000** cada **1** hora.\n> **<@&880880076072300656>**: ${emoji.money} **18,000** cada **2** horas.\n> **<@&885005729495400448>**: ${emoji.money} **55,000** cada **2** horas.\n> **<@&885304820951580693>**: ${emoji.money} **171,000** cada **3** horas.\n> **<@&885006286809333760>**: ${emoji.money} **533,000** cada **3** horas.\n> **<@&885004466246516756>**: ${emoji.money} **1,726,000** cada **4** horas.\n> **<@&885005037091291166>**: ${emoji.money} **5,695,000** cada **4** horas.\n> **<@&886330270293315624>**: ${emoji.money} **19,135,000** cada **5** horas.\n> **<@&886330276207296652>**: ${emoji.money} **65,441,000** cada **5** horas.\n> **<@&886330280506454057>**: ${emoji.money} **227,734,000** cada **6** horas.\n> **<@&864525011423461376>**: ${emoji.money} **806,178,000** cada **6** horas.\n> **<@&885005727129808906>**: ${emoji.money} **2,902,240,000** cada **7** horas.\n> **<@&880110972365324288>**: ${emoji.money} **8,000,000,000** cada **7** horas.\n> Estos roles de economía los puedes obtener comprando items en la tienda del sistema de economía del bot **<@292953664492929025>** en el canal <#834893418403725342>.`
                },
                {
                    valor: `roles-personal`,
                    color: `#F00505`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925159789350912/soporte.png`,
                    titulo: `👮 Roles del personal`,
                    descripcion: `> Los miembros con el rol **<@&887444598715219999>** son los miembros del personal del servidor, los cuales pueden tener  uno de los siguientes roles que determinan su rango.\n\n> **<@&896039467046023169>**: Los miembros con este rol son los que se encargan exclusivamente de hacer **alianzas** para el servidor.\n\n> **<@&831669132607881236>**: Los miembros que tienen este rol son los que resuelven las dudas de los miembros, ayudan a los **moderadores**, **administradores**, **creadores**, responden **Tickets**, entre otras acciones.\n\n> **<@&773271945894035486>**: Los miembros con este rol mayor mente se encargan de **moderar**, sancionar a miembros que no respetan las reglas, mantener el servidor en orden, etc.\n\n> **<@&847302489732153354>**: Los miembros con este rol se encargan de revisar verificar si todo funciona bien, si los bots funcionan, si los moderadores están realizando las tareas correctamente, si los ayudantes están realizando sus tareas correctamente, brindar **información** a los moderadores, ayudantes y usuarios, realizar acciones de moderadores o de ayudantes, etc.\n\n> **<@&907807597011279923>**: Los miembros con este rol pueden realizar todas las acciones que pueden hacer los miembros con los roles anteriores y tomar decisiones importantes en caso de que no este disponible el dueño.\n\n*Para mas información de como ser un ayudante o cazador de alianzas abre un ticket en <#830165896743223327>.*`
                },
                {
                    valor: `otros-roles`,
                    color: `#F04C05`,
                    miniatura: ``,
                    titulo: `♻️ Otros roles`,
                    descripcion: `> **<@&941731411684122625>**: Este rol es el rol que se le otorga a los miembros con los que hacemos **afiliaciones**.\n> .\n> **<@&895394175481159680>**: Este rol es el rol que se le otorga a los miembros con los que hacemos **alianzas**.\n> .\n> **<@&946139081367240714>**: Este rol se le otorga a los miembros que han echo una sugerencia y su sugerencia a sido **implementada** en el servidor.\n> .\n> **<@&830260561044176896>**: Este rol se le otorga a los miembros que han echo una sugerencia y su sugerencia a sido **aprobada** para ser publicada en el canal <#828300239488024587>.\n> .\n> **<@&830260566861545492>**: Este rol se le otorga a todos los **exstaffs** que tuvieron el rango moderador en adelante.\n> .\n> **<@&830260549098405935>** Este rol se le otorga a los miembros que son enviados a la **cárcel**, por alguna acción mala que han echo.`
                },
                {
                    valor: `bot-servidor`,
                    color: ((_f = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _f === void 0 ? void 0 : _f.displayHexColor) || 'White',
                    miniatura: ((_g = client.user) === null || _g === void 0 ? void 0 : _g.displayAvatarURL({ size: 1024 })) || '',
                    titulo: `🤖 Bot del servidor`,
                    descripcion: `Hola, soy **<@${(_h = client.user) === null || _h === void 0 ? void 0 : _h.id}>** el bot oficial del servidor, creado por <@717420870267830382>, el <t:${Math.floor((((_j = client.user) === null || _j === void 0 ? void 0 : _j.createdAt.valueOf()) || 0) / 1000)}:F> con la finalidad de hacer el trabajo pesado o difícil de los moderadores y administradores, remplazar a otros bots, hacer acciones complejas que otros bots no pondrían.\n*El objetivo de mi creador es seguir mejorándome hasta remplazar la máxima cantidad de bots que pueda.*`
                },
            ];
            infos.forEach((info) => {
                const embInformacion = new discord_js_1.EmbedBuilder()
                    .setThumbnail(info.miniatura || null)
                    .setTitle(info.titulo)
                    .setDescription(info.descripcion)
                    .setColor(info.color);
                if (int.values[0] == "categoría-importante" && info.valor == "categoría-importante") {
                    const embImportante = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **<#936444065426325577>**: en este canal se colocan las plantillas de los servidores con los que hacemos **afiliaciones**, **¿quieres hacer una afiliación?**, antes revisa los requisitos que están en los mensajes fijados del canal, si cumples con los requisitos abre un ticket en <#830165896743223327> y pide la afiliación.\n> .\n> **<#826863938057797633>**: en este canal se colocan las alianzas con otros servidores, **¿quieres hacer una alianza?**, antes revisa los requisitos que están en la descripción del canal, si cumples con los requisitos abre un ticket en <#830165896743223327> y pide la alianza.\n> .\n> **<#828300239488024587>**: en este canal se publican las sugerencias que hacen los miembros sobre el servidor, **¿Quieres hacer una sugerencia?**, la puedes hacer usando el comando de barra diagonal \`\`/sugerir\`\` en el canal <#834956208112795668>, para evitar perderte de cualquier nueva sugerencia ve al canal <#823639152922460170> y obtén el rol <@&840704367467954247> el cual te notificara en cada nueva sugerencia. `)
                        .setColor(info.color);
                    int.reply({ ephemeral: true, embeds: [embInformacion, embImportante] });
                }
                else if (int.values[0] == "categoría-promociónate" && info.valor == "categoría-promociónate") {
                    const embPromocionate = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **<#833750719307579392>**: en este canal puedes publicar todo lo relacionado con **trabajo**, tu estado laborar *(desempleado y buscas trabajo, buscas empleados, tus conocimientos)*, una página o portafolio donde explique a que te dedicas, tus conocimientos, experiencia, etc.\n> .\n> **<#842893188867817562>**: en este canal solo puedes promocionar **bots** ya sean bots de esta plataforma o otras, su enlace de invitación o página del bot.\n> .\n> **<#899328778566783058>**: en este canal solo puedes promocionar contenido **NSFW** o **+18** ya sean servidores de Discord, redes sociales, páginas web, etc.`)
                        .setColor(info.color);
                    int.reply({ ephemeral: true, embeds: [embInformacion, embPromocionate] });
                }
                else if (int.values[0] == "roles-exclusivos" && info.valor == "roles-exclusivos") {
                    const embExclusivos1 = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **<@&826197378229993503>**: este rol te da acceso al canal <#826193730578153472> canal en el cual podrás publicar cualquier tipo de contenido cada **4** horas exceptuando contenido explicito.\n\n> **Para conseguirlo hay **5** formas:**\n> **1. Invitar a **10** miembros al servidor**, para ver la cantidad de invitaciones que has hecho ejecuta el comando de barra diagonal \`\`/información miembro\`\` en el canal <#834956208112795668>, el rol se te será removido cuando los miembros que invitaste se vallan del servidor.\n> **2. Pagar 2 dólares por [PayPal](https://www.paypal.com/paypalme/srvers)**, el rol te durara **2** meses.\n> **3. Comprar el rol en economía**, en el canal <#834893418403725342>.\n> **4. Boostear el servidor o mejorarlo**, el rol sete será removido si eliminas la mejora o cuando caduque.\n> **5. Ganarse el rol en un sorteo en el canal** <#826205120173310032>, *no hacemos con frecuencia sorteos de roles*.\nPara resolver cualquier duda o reclamar el rol abre un ticket en el canal <#830165896743223327>.\n\n\n> **<@&839549487877062698>**: este rol te representa como **YouTuber**, para conseguirlo tienes que tener un canal de **YouTube** tener mínimo **200** subscriptores y tener tu cuenta de **YouTube** enlazada con la de **Discord**.\n> Si tienes todos los anteriores tienes que abrir un **Ticket** en <#830165896743223327> y pídele el rol a un administrador, el confirmará los datos y te dará el rol.\n\n\n> **<@&839549494659252244>**: Este rol te representa como **Streamer** de **Twitch**, para conseguirlo tienes que tener una media de **60** visitas en cada directo no necesariamente en vivo, tener tu cuanta de **Twitch** enlazada con la de **Discord**.\n> Si tienes los requisitos crea un **Ticket** en <#830165896743223327> y pídele el rol a un administrador, el confirmará los datos y te dará el rol.`)
                        .setColor(info.color);
                    const embExclusivos2 = new discord_js_1.EmbedBuilder()
                        .setDescription(`**<@&851577906828148766>**: Este rol por ahora no te da ninguna ventaja dentro del servidor.\n\n> Se consigue invitando al bot <@935707268090056734> a tu servidor para invitarlo ve al perfil del bot en el encontraras un botón para invitarlo en caso de no encontrarlo usa el comando \`\`u!invite\`\` o menciona al bot, para reclamar el rol habré un **ticket** en  <#830165896743223327>, ayudas bastante al creador del bot invitándolo a tu servidor.`)
                        .setColor(info.color);
                    int.reply({ ephemeral: true, embeds: [embInformacion, embExclusivos1, embExclusivos2] });
                }
                else if (info.valor == int.values[0]) {
                    int.reply({ ephemeral: true, embeds: [embInformacion] });
                }
            });
        }
    }
});
exports.interactionEvent = interactionEvent;
