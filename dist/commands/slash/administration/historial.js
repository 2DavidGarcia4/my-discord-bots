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
exports.historialSlashCommand = exports.historialSmb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.historialSmb = new discord_js_1.SlashCommandBuilder()
    .setName(`historial`)
    .setDescription(`🗒️ Historial, DX`)
    .addSubcommand(colaboradores => colaboradores.setName(`colaboradores`).setDescription(`💎 Muestra una lista de todos los colaboradores actuales y los antiguos.`))
    .addSubcommand(personal => personal.setName(`personal`).setDescription(`🦺 Muestra tu historial o el de un miembro del personal.`)
    .addUserOption(miembro => miembro.setName(`miembro`).setDescription(`👮 Miembro del personal del servidor a ver su historial.`).setRequired(false))).toJSON();
const historialSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { options, guild, user } = int, subCommand = options.getSubcommand(true), author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id), { emoji, serverId } = db_1.botDB;
    if (subCommand == "colaboradores") {
        __1.estadisticas.comandos++;
        let dataCol = yield models_1.collaboratorsModel.findById(serverId), bueltas = 1, tabla = [];
        if (!dataCol)
            return;
        for (let c of dataCol.colaboradores.filter(f => guild === null || guild === void 0 ? void 0 : guild.members.cache.get(f.id))) {
            let miembro = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(c.id);
            if (miembro) {
                if (c.colaborador) {
                    tabla.push(`**${bueltas}.** [${miembro.user.tag}](${miembro.displayAvatarURL({ size: 2048 })}) - es colaborador desde <t:${Math.floor(c.fecha / 1000)}:R>\n**ID:** ${c.id}`);
                }
                else {
                    tabla.push(`**${bueltas}.** [${miembro.user.tag}](${miembro.displayAvatarURL({ size: 2048 })}) - *era colaborador <t:${Math.floor(c.fecha / 1000)}:R>*\n**ID:** ${c.id}`);
                }
            }
            bueltas++;
        }
        yield int.deferReply();
        let allPages = 0;
        if (String(tabla.length).slice(-1) == '0') {
            allPages = Math.floor(tabla.length / 10);
        }
        else {
            allPages = Math.floor(tabla.length / 10 + 1);
        }
        let start = 0, end = 10, page = 1, descripcion = `Hay un total de **${tabla.length.toLocaleString()}** ${tabla.length <= 1 ? "colaborador." : "colaboradores."}\n\n`;
        const collaboratorsEb = new discord_js_1.EmbedBuilder()
            .setTitle(`💎 Historial de los colaboradores`)
            .setColor(((_b = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
            .setFooter({ text: `Pagina ${page}/${allPages}`, iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
            .setTimestamp();
        if (tabla.length <= 10) {
            collaboratorsEb
                .setDescription(descripcion + tabla.slice(start, end).join("\n\n"));
            (0, functions_1.sendMessageSlash)(int, { embeds: [collaboratorsEb] });
        }
        else {
            collaboratorsEb
                .setDescription(descripcion + tabla.slice(start, end).join("\n\n"));
            const collaboratorsArb = new discord_js_1.ActionRowBuilder()
                .addComponents([
                new discord_js_1.ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel("Anterior")
                    .setEmoji(emoji.leftArrow)
                    .setStyle(discord_js_1.ButtonStyle.Secondary),
                new discord_js_1.ButtonBuilder()
                    .setCustomId('next')
                    .setLabel("Siguiente")
                    .setEmoji(emoji.rightArrow)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
            ]).toJSON();
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const collaboratorsMessage = yield int.editReply({ embeds: [collaboratorsEb], components: [collaboratorsArb] }), { components } = collaboratorsArb;
                const collaboratorsCollector = collaboratorsMessage.createMessageComponentCollector({ filter: f => f.user.id == user.id, time: allPages * 60000 });
                collaboratorsCollector.on('collect', (btn) => __awaiter(void 0, void 0, void 0, function* () {
                    var _d, _e;
                    if (btn.customId == 'previous') {
                        if (end - 10 <= 10) {
                            components[0].style = discord_js_1.ButtonStyle.Secondary;
                            components[0].disabled = true;
                            components[1].disabled = false;
                            components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        else {
                            components[0].style = discord_js_1.ButtonStyle.Primary;
                            components[0].disabled = false;
                            components[1].disabled = false;
                            components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start -= 10, end -= 10, page--;
                        collaboratorsEb
                            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${page}/${allPages}`, iconURL: ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.iconURL()) || undefined });
                        btn.update({ embeds: [collaboratorsEb], components: [collaboratorsArb] });
                    }
                    if (btn.customId == 'next') {
                        if (end + 10 >= tabla.length) {
                            components[0].style = discord_js_1.ButtonStyle.Primary;
                            components[0].disabled = false;
                            components[1].disabled = true;
                            components[1].style = discord_js_1.ButtonStyle.Secondary;
                        }
                        else {
                            components[0].style = discord_js_1.ButtonStyle.Primary;
                            components[0].disabled = false;
                            components[1].disabled = false;
                            components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start -= 10, end -= 10, page--;
                        collaboratorsEb
                            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${page}/${allPages}`, iconURL: ((_e = int.guild) === null || _e === void 0 ? void 0 : _e.iconURL()) || undefined });
                        btn.update({ embeds: [collaboratorsEb], components: [collaboratorsArb] });
                    }
                }));
                collaboratorsCollector.on('end', (asd) => {
                    int.editReply({ embeds: [collaboratorsEb], components: [] });
                });
            }), 600);
        }
    }
    if (subCommand == 'personal') {
        let dataPer = yield models_1.personalModel.findById(serverId), memberOption = options.getUser('miembro'), member = memberOption ? guild === null || guild === void 0 ? void 0 : guild.members.cache.get(memberOption.id || '') : undefined;
        if (!dataPer)
            return;
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(member && member.user.bot),
                `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser miembro del personal del servidor.`
            ],
            [
                Boolean(member && !dataPer.personal.some(s => s.id == (member === null || member === void 0 ? void 0 : member.id))),
                `El miembro que has proporcionado *(${member})* no es miembro del personal del servidor o no esta registrado en el sistema.`
            ],
            [
                !member && !dataPer.personal.some(s => s.id == int.user.id),
                `No eres miembro del personal del servidor o no estas registrado en el sistema.`
            ]
        ]))
            return;
        yield int.deferReply();
        let bueltas = 1, tabla = [];
        let persona = dataPer.personal.find(f => f.id == (member ? member.id : int.user.id));
        if (!persona)
            return;
        for (let h of persona.historial) {
            tabla.push(`> **${bueltas}.** <t:${Math.floor(h.fecha / 1000)}:F> *(<t:${Math.floor(h.fecha / 1000)}:R>)*\n> ${h.accion}`);
            bueltas++;
        }
        let allPages = 0;
        if (String(tabla.length).slice(-1) == '0') {
            allPages = Math.floor(tabla.length / 10);
        }
        else {
            allPages = Math.floor(tabla.length / 10 + 1);
        }
        let start = 0, end = 10, page = 1, descripcion = member ? member.id == int.user.id ? `Tu historial ${member}\n\n` : `Historial de ${member}\n\n` : `Tu historial ${int.user}\n\n`, footerURL = member ? member.id == int.user.id ? guild === null || guild === void 0 ? void 0 : guild.iconURL() : member === null || member === void 0 ? void 0 : member.displayAvatarURL() : int.user.displayAvatarURL();
        const staffEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || user.username, iconURL: user.displayAvatarURL() })
            .setTitle(`🦺 Historial del personal`)
            .setColor(((_c = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White')
            .setFooter({ text: `Pagina ${page}/${allPages}`, iconURL: footerURL || undefined })
            .setTimestamp();
        if (tabla.length <= 10) {
            staffEb
                .setDescription(descripcion + tabla.slice(start, end).join("\n\n"));
            (0, functions_1.sendMessageSlash)(int, { embeds: [staffEb] });
        }
        else {
            const staffArb = new discord_js_1.ActionRowBuilder()
                .addComponents([
                new discord_js_1.ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel("Anterior")
                    .setEmoji(emoji.leftArrow)
                    .setStyle(discord_js_1.ButtonStyle.Secondary),
                new discord_js_1.ButtonBuilder()
                    .setCustomId('next')
                    .setLabel("Siguiente")
                    .setEmoji(emoji.rightArrow)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
            ]).toJSON();
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const staffMessage = yield int.editReply({ embeds: [staffEb], components: [staffArb] }), { components } = staffArb;
                const staffCollector = staffMessage.createMessageComponentCollector({ time: allPages * 60000 });
                staffCollector.on('collect', btn => {
                    var _a, _b;
                    if (btn.customId == 'previous') {
                        if (end - 10 <= 10) {
                            components[0].style = discord_js_1.ButtonStyle.Secondary;
                            components[0].disabled = true;
                            components[1].disabled = false;
                            components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        else {
                            components[0].style = discord_js_1.ButtonStyle.Primary;
                            components[0].disabled = false;
                            components[1].disabled = false;
                            components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start -= 10, end -= 10, page--;
                        staffEb
                            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${page}/${allPages}`, iconURL: ((_a = int.guild) === null || _a === void 0 ? void 0 : _a.iconURL()) || undefined });
                        btn.update({ embeds: [staffEb], components: [staffArb] });
                    }
                    if (btn.customId == 'next') {
                        if (end + 10 >= tabla.length) {
                            components[0].style = discord_js_1.ButtonStyle.Primary;
                            components[0].disabled = false;
                            components[1].disabled = true;
                            components[1].style = discord_js_1.ButtonStyle.Secondary;
                        }
                        else {
                            components[0].style = discord_js_1.ButtonStyle.Primary;
                            components[0].disabled = false;
                            components[1].disabled = false;
                            components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start += 10, end += 10, page++;
                        staffEb
                            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${page}/${allPages}`, iconURL: ((_b = int.guild) === null || _b === void 0 ? void 0 : _b.iconURL()) || undefined });
                        btn.update({ embeds: [staffEb], components: [staffArb] });
                    }
                });
                staffCollector.on('end', () => {
                    int.editReply({ embeds: [staffEb], components: [] });
                });
            }), 400);
        }
    }
});
exports.historialSlashCommand = historialSlashCommand;
