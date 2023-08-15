"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionAddEvent = void 0;
const db_1 = require("../db");
const models_1 = require("../../models");
const reactionAddEvent = async (reaction, user, client) => {
    const { serverId, emoji } = db_1.botDB;
    if (reaction.message.guildId != serverId || user.bot)
        return;
    //? Sistema de encuestas
    let dataEnc = await models_1.surveysModel.findById(serverId), arrayEn = dataEnc?.surveys;
    if (arrayEn?.filter(f => f.active).some(s => s.id == reaction.message.id) && arrayEn?.find(f => f.id == reaction.message.id)?.options.some(s => s.emoji == reaction.emoji.name)) {
        const encuesta = arrayEn.find(f => f.id == reaction.message.id);
        let totalVotos = 0, tabla = [];
        encuesta?.options.filter(f => f.emoji != reaction.emoji.name).map(m => reaction.message.reactions.cache.get(m.emoji)?.users.remove(user.id));
        if (encuesta) {
            for (let c of encuesta.options) {
                const reactionCounts = (reaction.message.reactions.cache.get(c.emoji)?.count || 2);
                if (c.emoji != reaction.emoji.name && reaction.message.reactions.cache.get(c.emoji)?.users.cache.has(user.id)) {
                    totalVotos += reactionCounts - 2;
                    c.votes = reactionCounts - 2;
                }
                else {
                    totalVotos += reactionCounts - 1;
                    c.votes = reactionCounts - 1;
                }
            }
            await models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
            for (let o of encuesta.options) {
                const porcentaje = (o.votes * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ";
                let diseño = "";
                for (let i = 0; i < 20; i++) {
                    if (i < parseInt(porcentaje) / 100 * 20)
                        diseño = diseño.concat(carga);
                    else
                        diseño = diseño.concat(vacio);
                }
                tabla.push(`${o.emoji} ${o.option} *(${o.votes})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`);
            }
        }
        const embed = reaction.message.embeds[0];
        embed.fields[0].value = tabla.join("\n\n");
        reaction.message.edit({ embeds: [embed] });
    }
    //? Sistema de sorteos
    const dataSor = await models_1.rafflesModel.findById(serverId), arraySo = dataSor?.raffles;
    if (arraySo?.filter(f => f.active).some(s => s.id == reaction.message.id) && reaction.emoji.id == dataSor?.data.emojiId) {
        const sorteo = arraySo?.find(f => f.id == reaction.message.id);
        if (!sorteo?.participants.some(s => s == user.id)) {
            sorteo?.participants.push(user.id);
            await models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
        }
    }
};
exports.reactionAddEvent = reactionAddEvent;
