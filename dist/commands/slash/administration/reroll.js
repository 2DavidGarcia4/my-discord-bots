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
exports.rerollSlashCommand = exports.rerollScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.rerollScb = new discord_js_1.SlashCommandBuilder()
    .setName(`reroll`)
    .setDescription(`🔁 Vuelve a elegir el o los ganadores de un sorteo.`)
    .addStringOption(id => id.setName(`id`)
    .setDescription(`🆔 ID del mensaje del sorteo.`)
    .setRequired(true)).toJSON();
const rerollSlashCommand = (int) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild, user, options } = int, { serverId, emoji } = db_1.botDB;
    const dataSor = yield models_1.rafflesModel.findById(serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.sorteos, messageId = options.getString("id", true);
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(isNaN(Number(messageId))),
            `La ID del sorteo *(${messageId})* no es valida ya que contiene caracteres no numéricos.`
        ],
        [
            Boolean(!(arraySo === null || arraySo === void 0 ? void 0 : arraySo.some(s => s.id == messageId))),
            `La ID que proporcionaste *(${messageId})* no coincide con la ID de ningún sorteo en el servidor.`
        ],
        [
            Boolean(arraySo === null || arraySo === void 0 ? void 0 : arraySo.filter(f => f.activo).some(s => s.id == messageId)),
            `La ID que proporcionaste *(${messageId})* no coincide con la de ningún sorteo finalizado pero si con la de un sorteo aun activo, solo se pueden volver a elegir el o los ganadores de un sorteo que ya haya finalizado.`
        ]
    ]))
        return;
    const raffle = arraySo === null || arraySo === void 0 ? void 0 : arraySo.find(f => f.id == messageId), channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((raffle === null || raffle === void 0 ? void 0 : raffle.canalID) || ''), message = (channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText ? channel.messages.cache.get(messageId) : undefined;
    const participants = raffle === null || raffle === void 0 ? void 0 : raffle.participantes.filter(f => guild === null || guild === void 0 ? void 0 : guild.members.cache.has(f));
    let bueltas = 1, ganadoresFinal = [];
    if (raffle && participants) {
        for (let r = 0; r < bueltas; r++) {
            let miembroRandom = participants[Math.floor(Math.random() * participants.length)];
            if ((raffle === null || raffle === void 0 ? void 0 : raffle.ganadores) > ganadoresFinal.length && !ganadoresFinal.some(s => s == miembroRandom)) {
                ganadoresFinal.push(participants[Math.floor(Math.random() * participants.length)]);
                bueltas++;
            }
        }
    }
    if (ganadoresFinal.length == 0)
        return (0, functions_1.setSlashError)(int, `No se puede volver a elegir uno o mas ganadores de un sorteo en el cual nadie participo.`);
    if (message) {
        const emb = message.embeds[0];
        if (emb.data.author)
            emb.data.author.name = "Sorteo finalizado";
        emb.fields[0].value = `${ganadoresFinal.length == 1 ? `Ganador/a: ${ganadoresFinal.map(m => `<@${m}>`)[0]}` : `Ganadores: ${ganadoresFinal.map(m => `<@${m}>`).join(", ")}`}\nParticipantes: **${participants === null || participants === void 0 ? void 0 : participants.length}**\nCreado por: <@${raffle === null || raffle === void 0 ? void 0 : raffle.autorID}>`;
        message.edit({ embeds: [emb] });
        message.reply({ content: `¡Felicidades ${ganadoresFinal.length == 1 ? `${ganadoresFinal.map(m => `<@${m}>`)[0]} has ganado` : `${ganadoresFinal.map(m => `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!\n*Comando reroll utilizado por ${int.user.tag}*` });
    }
    const embReroll = new discord_js_1.EmbedBuilder()
        .setTitle(`Reroll echo`)
        .setDescription(`Se ha vuelto a seleccionar ${(raffle === null || raffle === void 0 ? void 0 : raffle.ganadores) == 1 ? "el ganador " : "los ganadores"} del sorteo que esta en ${(channel === null || channel === void 0 ? void 0 : channel.id) == int.channelId ? `este canal` : `el canal <#${channel === null || channel === void 0 ? void 0 : channel.id}>`}.`)
        .setColor("#00ff00");
    int.reply({ ephemeral: true, embeds: [embReroll] });
});
exports.rerollSlashCommand = rerollSlashCommand;
