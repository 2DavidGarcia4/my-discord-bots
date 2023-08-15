"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionRemoveEvent = void 0;
const db_1 = require("../db");
const models_1 = require("../../models");
const reactionRemoveEvent = async (reaction, user, client) => {
    const { serverId, emoji } = db_1.botDB;
    if (user.bot && reaction.message.guildId != serverId)
        return;
    //? Sistema de encuestas
    const dataEnc = await models_1.surveysModel.findById(serverId), arrayEn = dataEnc?.surveys;
    if (arrayEn?.filter(f => f.active).some(s => s.id == reaction.message.id) && arrayEn?.find(f => f.id == reaction.message.id)?.options.some(s => s.emoji == reaction.emoji.name)) {
        const encuesta = arrayEn.find(f => f.id == reaction.message.id);
        let totalVotos = 0, tabla = [];
        if (encuesta) {
            for (let c of encuesta.options) {
                const reactionCounts = (reaction.message.reactions.cache.get(c.emoji)?.count || 1);
                totalVotos += reactionCounts - 1;
                c.votes = reactionCounts - 1;
            }
            await models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
            for (let o of encuesta.options) {
                let porcentaje = (o.votes * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = "";
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
        if (sorteo?.participants.some(s => s == user.id)) {
            sorteo.participants.splice(sorteo.participants.findIndex(f => f == user.id), 1);
            await models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
        }
    }
};
exports.reactionRemoveEvent = reactionRemoveEvent;
