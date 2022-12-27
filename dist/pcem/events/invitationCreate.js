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
exports.invitationCreateEvent = void 0;
const db_1 = require("../db");
const models_1 = require("../models");
const invitationCreateEvent = (invite, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { serverId } = db_1.botDB;
    if (((_a = invite.guild) === null || _a === void 0 ? void 0 : _a.id) != serverId)
        return;
    const dataInv = yield models_1.invitesModel.findById(serverId), arrayMi = dataInv === null || dataInv === void 0 ? void 0 : dataInv.miembros;
    const miembro = arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.find(f => f.id == invite.inviterId);
    if (miembro) {
        miembro.codes.push({ code: invite.code, usos: 0 });
    }
    else {
        arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.push({ id: invite.inviterId || '', tag: ((_b = client.users.cache.get(invite.inviterId || '')) === null || _b === void 0 ? void 0 : _b.tag) || '', verdaderas: 0, totales: 0, restantes: 0, falsas: 0, tiempo: null, codes: [{ code: invite.code, usos: 0 }], invitados: [] });
    }
    yield models_1.invitesModel.findByIdAndUpdate(serverId, { miembros: arrayMi });
});
exports.invitationCreateEvent = invitationCreateEvent;
