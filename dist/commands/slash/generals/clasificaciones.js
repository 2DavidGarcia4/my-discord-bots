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
exports.clasificacionesSlashCommand = exports.clasificacionesScb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.clasificacionesScb = new discord_js_1.SlashCommandBuilder()
    .setName('clasificaciones')
    .setDescription(`📑 Accede a las clasificaciones de los sistemas del bot.`)
    .addSubcommand(sub1 => sub1.setName(`alianzas`).setDescription(`🤝 Muestra una tabla de clasificaciones de todos los miembros que han echo alianzas.`))
    .addSubcommand(sub2 => sub2.setName(`tickets`).setDescription(`🎫 Muestra una tabla de clasificaciones de todos los miembros que han creado tickets.`)).toJSON();
const clasificacionesSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { options, user, guild } = int, subCommand = options.getSubcommand(true);
    if (subCommand == 'alianzas') {
        const dataAli = yield models_1.alliancesModel.findById(db_1.botDB.serverId);
        let ordenado = dataAli === null || dataAli === void 0 ? void 0 : dataAli.miembros.sort((a, b) => b.cantidad - a.cantidad), topC = [];
        yield int.deferReply();
        __1.estadisticas.comandos++;
        if (!dataAli || !ordenado)
            return;
        dataAli.miembros.forEach((valor, ps) => {
            let usuario = client.users.cache.get(valor.id);
            if (usuario) {
                if (usuario.id == int.user.id) {
                    topC.push(`**${ps == 0 ? "🥇" : ps == 1 ? "🥈" : ps == 2 ? "🥉" : ps + 1}. [${usuario.tag}](${usuario.displayAvatarURL({ size: 4096 })}) - ${(valor.cantidad).toLocaleString()}**\n**ID: ${usuario.id}**`);
                }
                else {
                    topC.push(`**${ps == 0 ? "🥇" : ps == 1 ? "🥈" : ps == 2 ? "🥉" : ps + 1}.** [${usuario.tag}](${usuario.displayAvatarURL({ size: 4096 })}) - **${(valor.cantidad).toLocaleString()}**\n**ID:** ${usuario.id}`);
                }
            }
        });
        let allPages = 0;
        if (ordenado && String(ordenado.length).slice(-1) == '0') {
            allPages = Math.floor(ordenado.length / 10);
        }
        else {
            allPages = Math.floor(ordenado.length / 10 + 1);
        }
        let start = 0, end = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta" : "miembros que están"} en la tabla.\n\n`;
        const alliancesEb = new discord_js_1.EmbedBuilder()
            .setTitle(`🤝 Tabla de clasificaciones del sistema de alianzas`)
            .setColor(((_b = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
            .setTimestamp();
        if (ordenado.length <= 10) {
            alliancesEb
                .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: ((_c = int.guild) === null || _c === void 0 ? void 0 : _c.iconURL()) || undefined });
            (0, functions_1.sendMessageSlash)(int, { embeds: [alliancesEb] });
        }
        else {
            alliancesEb
                .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.iconURL()) || undefined });
            const alliancesButtons = new discord_js_1.ActionRowBuilder()
                .addComponents([
                new discord_js_1.ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel("Anterior")
                    .setEmoji(db_1.botDB.emoji.leftArrow)
                    .setStyle(discord_js_1.ButtonStyle.Secondary),
                new discord_js_1.ButtonBuilder()
                    .setCustomId('next')
                    .setLabel("Siguiente")
                    .setEmoji(db_1.botDB.emoji.rightArrow)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
            ]).toJSON();
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const alliansesMessage = yield int.editReply({ embeds: [alliancesEb], components: [alliancesButtons] });
                const alliancesCollection = alliansesMessage.createMessageComponentCollector({ time: allPages * 60000 });
                alliancesCollection.on('collect', (btn) => __awaiter(void 0, void 0, void 0, function* () {
                    var _k, _l;
                    if (btn.customId == 'previous') {
                        if (end - 10 <= 10) {
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Secondary;
                            alliancesButtons.components[0].disabled = true;
                            alliancesButtons.components[1].disabled = false;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        else {
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                            alliancesButtons.components[0].disabled = false;
                            alliancesButtons.components[1].disabled = false;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start -= 10, end -= 10, pagina--;
                        alliancesEb
                            .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: ((_k = int.guild) === null || _k === void 0 ? void 0 : _k.iconURL()) || undefined });
                        yield btn.update({ embeds: [alliancesEb], components: [alliancesButtons] });
                    }
                    if (btn.customId == 'next') {
                        if (end + 10 >= topC.length) {
                            alliancesButtons.components[0].disabled = false;
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Secondary;
                            alliancesButtons.components[1].disabled = true;
                        }
                        else {
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                            alliancesButtons.components[0].disabled = false;
                            alliancesButtons.components[1].disabled = false;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start += 10, end += 10, pagina++;
                        alliancesEb
                            .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: ((_l = int.guild) === null || _l === void 0 ? void 0 : _l.iconURL()) || undefined });
                        yield btn.update({ embeds: [alliancesEb], components: [alliancesButtons] });
                    }
                }));
                alliancesCollection.on("end", () => {
                    int.editReply({ embeds: [alliancesEb], components: [] });
                });
            }), 600);
        }
    }
    if (subCommand == 'tickets') {
        const dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId), ordenado = dataTs === null || dataTs === void 0 ? void 0 : dataTs.miembros.sort((a, b) => b.ticketsCreados - a.ticketsCreados), topTs = [];
        let cantidadDereseñas = 0, allPages = 0;
        yield int.deferReply();
        __1.estadisticas.comandos++;
        if (!dataTs || !ordenado)
            return;
        for (const i in ordenado) {
            let reseñas = ordenado[i].reseñas.filter((f) => f.reseña != false).length;
            cantidadDereseñas += reseñas;
            let miembro = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get(ordenado[i].id);
            if (miembro) {
                if (miembro.id == int.user.id) {
                    topTs.push(`**${Number(i) + 1}. [${miembro.user.tag}](${miembro.displayAvatarURL({ size: 4096 })})**\n**ID:** ${miembro.id}\nTickets: **${ordenado[i].ticketsCreados.toLocaleString()}**\nReseñas: **${reseñas.toLocaleString()}**`);
                }
                else {
                    topTs.push(`**${Number(i) + 1}.** [${miembro.user.tag}](${miembro.displayAvatarURL({ size: 4096 })})\n**ID:** ${miembro.id}\nTickets: **${ordenado[i].ticketsCreados.toLocaleString()}**\nReseñas: **${reseñas.toLocaleString()}**`);
                }
            }
        }
        if (ordenado && String(ordenado.length).slice(-1) == '0') {
            allPages = Math.floor(ordenado.length / 10);
        }
        else {
            allPages = Math.floor(ordenado.length / 10 + 1);
        }
        let start = 0, end = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta" : "miembros que están"} en la tabla y **${cantidadDereseñas}** reseñas.\n\n`;
        const ticketsEb = new discord_js_1.EmbedBuilder()
            .setTitle(`${db_1.botDB.emoji.ticket} Tabla de clasificaciones del sistema de tickets`)
            .setColor(((_g = (_f = int.guild) === null || _f === void 0 ? void 0 : _f.members.me) === null || _g === void 0 ? void 0 : _g.displayHexColor) || 'White')
            .setTimestamp();
        if (ordenado.length <= 10) {
            ticketsEb
                .setDescription(descripcion + topTs.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: ((_h = int.guild) === null || _h === void 0 ? void 0 : _h.iconURL()) || undefined });
            (0, functions_1.sendMessageSlash)(int, { embeds: [ticketsEb] });
        }
        else {
            ticketsEb
                .setDescription(descripcion + topTs.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: ((_j = int.guild) === null || _j === void 0 ? void 0 : _j.iconURL()) || undefined });
            const ticketsButtons = new discord_js_1.ActionRowBuilder()
                .addComponents([
                new discord_js_1.ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel("Anterior")
                    .setEmoji(db_1.botDB.emoji.leftArrow)
                    .setStyle(discord_js_1.ButtonStyle.Secondary),
                new discord_js_1.ButtonBuilder()
                    .setCustomId('next')
                    .setLabel("Siguiente")
                    .setEmoji(db_1.botDB.emoji.rightArrow)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
            ]).toJSON();
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const alliansesMessage = yield int.editReply({ embeds: [ticketsEb], components: [ticketsButtons] }), { components } = ticketsButtons;
                const alliancesCollection = alliansesMessage.createMessageComponentCollector({ time: allPages * 60000 });
                alliancesCollection.on('collect', (btn) => __awaiter(void 0, void 0, void 0, function* () {
                    var _m, _o;
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
                        start -= 10, end -= 10, pagina--;
                        ticketsEb
                            .setDescription(descripcion + topTs.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: ((_m = int.guild) === null || _m === void 0 ? void 0 : _m.iconURL()) || undefined });
                        yield btn.update({ embeds: [ticketsEb], components: [ticketsButtons] });
                    }
                    if (btn.customId == 'next') {
                        if (end + 10 >= topTs.length) {
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
                        start += 10, end += 10, pagina++;
                        ticketsEb
                            .setDescription(descripcion + topTs.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: ((_o = int.guild) === null || _o === void 0 ? void 0 : _o.iconURL()) || undefined });
                        yield btn.update({ embeds: [ticketsEb], components: [ticketsButtons] });
                    }
                }));
                alliancesCollection.on("end", () => {
                    int.editReply({ embeds: [ticketsEb], components: [] });
                });
            }), 600);
        }
    }
});
exports.clasificacionesSlashCommand = clasificacionesSlashCommand;
