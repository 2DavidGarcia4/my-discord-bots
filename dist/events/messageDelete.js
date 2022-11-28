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
exports.messageDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const models_1 = require("../models");
const messageDeleteEvent = (msgd) => __awaiter(void 0, void 0, void 0, function* () {
    if (msgd.guildId != db_1.botDB.serverId)
        return;
    let dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId), arrayTs = dataTs === null || dataTs === void 0 ? void 0 : dataTs.tickets, ticket = arrayTs === null || arrayTs === void 0 ? void 0 : arrayTs.find(f => f.id == msgd.channelId);
    if ((arrayTs === null || arrayTs === void 0 ? void 0 : arrayTs.some(s => s.id == msgd.channelId)) && ticket.msgCerrarID == msgd.id && !ticket.cerrado) {
        const botonCerrar = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("cerrarTicket")
            .setEmoji("962574398190145566")
            .setLabel("Cerrar ticket")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(false));
        yield msgd.channel.messages.fetch(ticket.msgPrincipalID).then(msgPrincipal => {
            msgPrincipal.edit({ components: [botonCerrar] });
        }).catch(c => console.log(c));
        ticket.msgCerrarID = false;
        yield models_1.ticketsModel.findByIdAndUpdate(db_1.botDB.serverId, { tickets: arrayTs });
    }
    let dataSor = yield models_1.rafflesModel.findById(db_1.botDB.serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.sorteos;
    if (arraySo === null || arraySo === void 0 ? void 0 : arraySo.some(s => s.id == msgd.id)) {
        arraySo.splice(arraySo.findIndex(f => f.id == msgd.id), 1);
        yield models_1.rafflesModel.findByIdAndUpdate(db_1.botDB.serverId, { sorteos: arraySo });
    }
    let dataEnc = yield models_1.surveysModel.findById(db_1.botDB.serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.encuestas;
    if (arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.some(s => s.id == msgd.id)) {
        arrayEn.splice(arrayEn.findIndex(f => f.id == msgd.id), 1);
        yield models_1.surveysModel.findByIdAndUpdate(db_1.botDB.serverId, { encuestas: arrayEn });
    }
});
exports.messageDeleteEvent = messageDeleteEvent;
