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
exports.reactionAddEvent = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const reactionAddEvent = (reaction, user, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { serverId, emoji } = db_1.botDB;
    if (reaction.message.guildId != serverId || user.bot)
        return;
    //? Sistema de encuestas
    let dataEnc = yield models_1.surveysModel.findById(serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.encuestas;
    if ((arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.filter(f => f.activa).some(s => s.id == reaction.message.id)) && ((_a = arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.find(f => f.id == reaction.message.id)) === null || _a === void 0 ? void 0 : _a.opciones.some(s => s.emoji == reaction.emoji.name))) {
        const encuesta = arrayEn.find(f => f.id == reaction.message.id);
        let totalVotos = 0, tabla = [];
        encuesta === null || encuesta === void 0 ? void 0 : encuesta.opciones.filter(f => f.emoji != reaction.emoji.name).map(m => { var _a; return (_a = reaction.message.reactions.cache.get(m.emoji)) === null || _a === void 0 ? void 0 : _a.users.remove(user.id); });
        if (encuesta) {
            for (let c of encuesta.opciones) {
                const reactionCounts = (((_b = reaction.message.reactions.cache.get(c.emoji)) === null || _b === void 0 ? void 0 : _b.count) || 2);
                if (c.emoji != reaction.emoji.name && ((_c = reaction.message.reactions.cache.get(c.emoji)) === null || _c === void 0 ? void 0 : _c.users.cache.has(user.id))) {
                    totalVotos += reactionCounts - 2;
                    c.votos = reactionCounts - 2;
                }
                else {
                    totalVotos += reactionCounts - 1;
                    c.votos = reactionCounts - 1;
                }
            }
            yield models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
            for (let o of encuesta.opciones) {
                const porcentaje = (o.votos * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ";
                let diseño = "";
                for (let i = 0; i < 20; i++) {
                    if (i < parseInt(porcentaje) / 100 * 20)
                        diseño = diseño.concat(carga);
                    else
                        diseño = diseño.concat(vacio);
                }
                tabla.push(`${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`);
            }
        }
        const embed = reaction.message.embeds[0];
        embed.fields[0].value = tabla.join("\n\n");
        reaction.message.edit({ embeds: [embed] });
    }
    //? Sistema de sorteos
    const dataSor = yield models_1.rafflesModel.findById(serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.sorteos;
    if ((arraySo === null || arraySo === void 0 ? void 0 : arraySo.filter(f => f.activo).some(s => s.id == reaction.message.id)) && reaction.emoji.id == (dataSor === null || dataSor === void 0 ? void 0 : dataSor.datos.emojiID)) {
        const sorteo = arraySo === null || arraySo === void 0 ? void 0 : arraySo.find(f => f.id == reaction.message.id);
        if (!(sorteo === null || sorteo === void 0 ? void 0 : sorteo.participantes.some(s => s == user.id))) {
            sorteo === null || sorteo === void 0 ? void 0 : sorteo.participantes.push(user.id);
            yield models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
        }
    }
    //? Sistema de tickets
    // const starsEmojis = [{id: "963478022369980517", reaccion: false}, {id: "963478099578728448", reaccion: false}, {id: "963478146089377872", reaccion: false}, {id: "963478173562052628", reaccion: false}, {id: "963478195498254387", reaccion: false}]
    // const dataTs = await ticketsModel.findById(serverId), arrayTs = dataTs?.tickets, arrayMs = dataTs?.miembros
    // arrayTs?.forEach(async (ticket) => {
    //   if(starsEmojis.some(e=> e.id == reaction.emoji.id) && ticket.msgValoracionID == reaction.message.id){
    //     if(user.id == ticket.miembroID){
    //       reaction.message.reactions.cache.map(m=> m).forEach((tsReaction, ps) =>{
    //         if(tsReaction.users.cache.some(s=> s.id == ticket.miembroID) && !starsEmojis.find(f=> f.id == tsReaction.emoji.id)?.reaccion){
    //           const starEmoji = starsEmojis.find(f=>f.id == tsReaction.emoji.id)
    //           starEmoji && (starEmoji.reaccion = true)
    //         }
    //       })
    //       arrayMs?.forEach((objetoMs) => {
    //         if(objetoMs.id == user.id){
    //           objetoMs.reseñas.forEach((objRes) => {
    //             if(objRes.ticketID == ticket.id){
    //               if(starsEmojis.filter(f=> f.reaccion).length==1){
    //                 objRes.starsEmojis = starsEmojis.findIndex(f=> f.reaccion)+1
    //               }else{
    //                 objRes.starsEmojis = starsEmojis.filter(f=> f.reaccion).length
    //               }
    //             }
    //           })
    //         }
    //       })
    //       if(!ticket.valoracion) ticket.valoracion = true
    //       await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs, miembros: arrayMs})
    //     }else reaction.users.remove(user.id)
    //   }
    // })
    //? sistema de sugerencias
    const dataSug = yield models_1.suggestionsModel.findById(serverId), msgsSug = dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes;
    msgsSug === null || msgsSug === void 0 ? void 0 : msgsSug.forEach((msgSug) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        if (msgSug.id == reaction.message.id) {
            if (reaction.emoji.id == "946826193032851516") {
                (_d = reaction.message.reactions.cache.get("946826212960010251")) === null || _d === void 0 ? void 0 : _d.users.remove(user.id);
                let positivas = (reaction.count || 1) - 1, negativas = msgSug.negativas, totales = positivas + negativas;
                let porcentajePositivo = (positivas * 100 / totales).toFixed(2);
                let porcentajeNegativo = (negativas * 100 / totales).toFixed(2);
                let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = "";
                for (let i = 0; i < 20; i++) {
                    if (i < parseInt(porcentajePositivo) / 100 * 20) {
                        diseñoPositivo = diseñoPositivo.concat(carga);
                    }
                    else {
                        diseñoPositivo = diseñoPositivo.concat(vacio);
                    }
                    if (i < parseInt(porcentajeNegativo) / 100 * 20) {
                        diseñoNegativo = diseñoNegativo.concat(carga);
                    }
                    else {
                        diseñoNegativo = diseñoNegativo.concat(vacio);
                    }
                }
                const fileName = `📊 Votos: **${totales}**`;
                const fileDescription = `${emoji.like} ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n${emoji.dislike} ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`;
                if (reaction.message.embeds[0].fields.length <= 0) {
                    const embed = reaction.message.embeds[0];
                    embed.fields.push({
                        name: fileName,
                        value: fileDescription
                    });
                    reaction.message.edit({ embeds: [embed] });
                }
                else {
                    const embed = reaction.message.embeds[0];
                    embed.fields[0].name = fileName;
                    embed.fields[0].value = fileDescription;
                    reaction.message.edit({ embeds: [embed] });
                }
                msgSug.positivas = positivas;
                msgSug.negativas = negativas;
                yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: msgsSug });
            }
            if (reaction.emoji.id == "946826212960010251") {
                (_e = reaction.message.reactions.cache.get("946826193032851516")) === null || _e === void 0 ? void 0 : _e.users.remove(user.id);
                let positivas = msgSug.positivas, negativas = (reaction.count || 1) - 1, totales = positivas + negativas;
                let porcentajePositivo = String(positivas * 100 / totales).slice(0, 5);
                let porcentajeNegativo = String(negativas * 100 / totales).slice(0, 5);
                let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = "";
                for (let i = 0; i < 20; i++) {
                    if (i < Number(porcentajePositivo) / 100 * 20) {
                        diseñoPositivo = diseñoPositivo.concat(carga);
                    }
                    else {
                        diseñoPositivo = diseñoPositivo.concat(vacio);
                    }
                    if (i < Number(porcentajeNegativo) / 100 * 20) {
                        diseñoNegativo = diseñoNegativo.concat(carga);
                    }
                    else {
                        diseñoNegativo = diseñoNegativo.concat(vacio);
                    }
                }
                const fileName = `📊 Votos: **${totales}**`;
                const fileDescription = `${emoji.like} ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n${emoji.dislike} ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`;
                if (reaction.message.embeds[0].fields.length <= 0) {
                    const embed = reaction.message.embeds[0];
                    embed.fields.push({
                        name: fileName,
                        value: fileDescription
                    });
                    reaction.message.edit({ embeds: [embed] });
                }
                else {
                    const embed = reaction.message.embeds[0];
                    embed.fields[0].name = fileName;
                    embed.fields[0].value = fileDescription;
                    reaction.message.edit({ embeds: [embed] });
                }
                msgSug.positivas = positivas;
                msgSug.negativas = negativas;
                yield models_1.suggestionsModel.findByIdAndUpdate(serverId, { mensajes: msgsSug });
            }
        }
    }));
});
exports.reactionAddEvent = reactionAddEvent;
