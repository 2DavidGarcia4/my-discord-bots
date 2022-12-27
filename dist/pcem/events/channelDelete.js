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
exports.channelDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const models_1 = require("../models");
const channelDeleteEvent = (cd, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (cd.type == discord_js_1.ChannelType.DM)
        return;
    if (cd.guildId != db_1.botDB.serverId)
        return;
    const dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId), arrayTs = dataTs === null || dataTs === void 0 ? void 0 : dataTs.tickets, objetoDs = dataTs === null || dataTs === void 0 ? void 0 : dataTs.datos, servidor2 = client.guilds.cache.get('949860813915705354');
    const descripcion = cd.type == discord_js_1.ChannelType.GuildText ? (_a = cd.topic) === null || _a === void 0 ? void 0 : _a.split(' ') : '', numberTicket = (_b = cd.name.match(/(\d+)/g)) === null || _b === void 0 ? void 0 : _b.pop();
    if ((dataTs === null || dataTs === void 0 ? void 0 : dataTs.tickets.some(s => s.id == cd.id)) && servidor2 && descripcion) {
        descripcion[0] = db_1.botDB.emoji.negative;
        let ticket = arrayTs === null || arrayTs === void 0 ? void 0 : arrayTs.find(f => f.id == cd.id), canalesCategoria = servidor2.channels.cache.filter(f => f.parentId == objetoDs.categoriaID), categoria = servidor2.channels.cache.get(objetoDs.categoriaID);
        if (canalesCategoria.size == 50) {
            servidor2.channels.create({ name: `📚 Grupo de tickets ${Number((_c = categoria === null || categoria === void 0 ? void 0 : categoria.name.match(/(\d+)/g)) === null || _c === void 0 ? void 0 : _c.pop()) + 1}`, type: discord_js_1.ChannelType.GuildDirectory }).then((newCategory) => __awaiter(void 0, void 0, void 0, function* () {
                var _e;
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    if ((categoria === null || categoria === void 0 ? void 0 : categoria.type) == discord_js_1.ChannelType.GuildCategory)
                        newCategory.edit({ position: categoria === null || categoria === void 0 ? void 0 : categoria.position });
                }), 4000);
                yield models_1.ticketsModel.findByIdAndUpdate(db_1.botDB.serverId, { datos: objetoDs, tickets: arrayTs });
                (_e = servidor2.channels.cache.get(ticket.copiaID)) === null || _e === void 0 ? void 0 : _e.edit({ name: `『🔒』ticket ${numberTicket} eliminado`, parent: objetoDs.categoriaID, position: 0, topic: `${descripcion.join(" ").replace(".", " ").concat(" *eliminado*.")}` });
            }));
        }
        else {
            (_d = servidor2.channels.cache.get(ticket.copiaID)) === null || _d === void 0 ? void 0 : _d.edit({ name: `『🔒』ticket ${numberTicket} eliminado`, parent: objetoDs.categoriaID, topic: `${descripcion.join(" ").replace(".", " ").concat(" *eliminado*.")}` }).then((tc) => __awaiter(void 0, void 0, void 0, function* () {
                var _f;
                const numTicket = Number((_f = tc.name.match(/(\d+)/g)) === null || _f === void 0 ? void 0 : _f.pop());
                let posicion = servidor2.channels.cache.filter(f => { var _a; return f.parentId == objetoDs.categoriaID && Number((_a = f.name.match(/(\d+)/g)) === null || _a === void 0 ? void 0 : _a.pop()) < numTicket; }).map(m => {
                    var _a;
                    const positionCat = m.type == discord_js_1.ChannelType.GuildCategory ? m.position : 1;
                    return Object({ pos: positionCat, num: Number((_a = m.name.match(/(\d+)/g)) === null || _a === void 0 ? void 0 : _a.pop()) });
                }).sort((a, b) => a.num - b.num).pop().pos;
                setTimeout(() => {
                    tc.edit({ position: posicion });
                }, 4000);
            }));
        }
        arrayTs === null || arrayTs === void 0 ? void 0 : arrayTs.splice(arrayTs === null || arrayTs === void 0 ? void 0 : arrayTs.findIndex(f => f.id == cd.id), 1);
        yield models_1.ticketsModel.findByIdAndUpdate(db_1.botDB.serverId, { datos: objetoDs, tickets: arrayTs });
    }
});
exports.channelDeleteEvent = channelDeleteEvent;
