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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRemoveEvent = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const __1 = require("..");
const db_1 = require("../db");
const models_1 = require("../models");
const memberRemoveEvent = (gmr, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (gmr.guild.id != db_1.botDB.serverId)
        return;
    __1.estadisticas.salidas++;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id);
    const dataInv = yield models_1.invitesModel.findById(db_1.botDB.serverId), arrayMi = dataInv === null || dataInv === void 0 ? void 0 : dataInv.miembros;
    if (!dataBot)
        return;
    const leaveLog = client.channels.cache.get(dataBot.logs.exit);
    if ((leaveLog === null || leaveLog === void 0 ? void 0 : leaveLog.type) != discord_js_1.ChannelType.GuildText)
        return;
    const leaveLogEb = new discord_js_1.EmbedBuilder();
    if (gmr.user.bot) {
        leaveLogEb
            .setTitle("🤖 Se fue un bot")
            .setThumbnail(gmr.displayAvatarURL())
            .setDescription(`${gmr}\n${gmr.user.tag}\nSeunio: <t:${Math.round((((_b = gmr.joinedAt) === null || _b === void 0 ? void 0 : _b.valueOf()) || 0) / 1000)}:R>`)
            .setColor('Orange')
            .setTimestamp();
    }
    else {
        // if(leaveLog?.type != ChannelType.GuildText) return
        const mbanner = yield client.users.fetch(gmr.id, { force: true });
        leaveLogEb
            .setAuthor({ name: gmr.user.username, iconURL: gmr.user.displayAvatarURL({ size: 2048 }) })
            .setThumbnail(gmr.user.displayAvatarURL())
            .setImage(mbanner.bannerURL({ size: 2048 }) || null)
            .setTitle("📤 Se fue un miembro")
            .setDescription(`Se fue ${gmr} (*no se por quien fue invitado/a*).\n📥 **Seunio:**\n<t:${Math.round((((_c = gmr.joinedAt) === null || _c === void 0 ? void 0 : _c.valueOf()) || 0) / 1000)}:R>`)
            .setColor("#ff0000")
            .setFooter({ text: gmr.guild.name, iconURL: gmr.guild.iconURL() || undefined })
            .setTimestamp();
        if (arrayMi) {
            for (let m of arrayMi) {
                if (m.invitados.some(s => s.id == gmr.user.id)) {
                    const invitado = m.invitados.find(f => f.id == gmr.user.id);
                    if (invitado === null || invitado === void 0 ? void 0 : invitado.miembro) {
                        m.verdaderas--;
                        m.restantes++;
                        invitado.miembro = false;
                        leaveLogEb.data.description = `Se fue ${gmr} *había sido invitado/a por <@${m.id}> quien ahora tiene **${m.verdaderas.toLocaleString()}** ${m.verdaderas == 1 ? "invitación" : "invitaciones"}.*\n📥 **Seunio:**\n<t:${Math.round((((_d = gmr.joinedAt) === null || _d === void 0 ? void 0 : _d.valueOf()) || 0) / 1000)}:R>`;
                    }
                }
            }
        }
        leaveLog.send({ embeds: [leaveLogEb] });
        const miembro = arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.find(f => f.id == gmr.user.id);
        if (miembro) {
            miembro.tiempo = Math.floor(Date.now() + (0, ms_1.default)("30d"));
        }
        yield models_1.invitesModel.findByIdAndUpdate(db_1.botDB.serverId, { miembros: arrayMi });
        // Colaboradores
        let dataCol = yield models_1.collaboratorsModel.findById(db_1.botDB.serverId), arrayCo = dataCol === null || dataCol === void 0 ? void 0 : dataCol.colaboradores;
        if (arrayCo === null || arrayCo === void 0 ? void 0 : arrayCo.some(s => s.id == gmr.id)) {
            arrayCo.splice(arrayCo.findIndex(f => f.id == gmr.id), 1);
            yield models_1.collaboratorsModel.findByIdAndUpdate(db_1.botDB.serverId, { colaboradores: arrayCo });
        }
        // Personal
        let dataPer = yield models_1.personalModel.findById(db_1.botDB.serverId), arrayPr = dataPer === null || dataPer === void 0 ? void 0 : dataPer.personal;
        if (arrayPr === null || arrayPr === void 0 ? void 0 : arrayPr.some(s => s.id == gmr.id)) {
            let persona = arrayPr.find(f => f.id == gmr.id);
            if (persona)
                persona.miembro = false;
            yield models_1.personalModel.findByIdAndUpdate(db_1.botDB.serverId, { personal: arrayPr });
        }
        // PromoNvl
        let dataPrl = yield models_1.promoLevelModel.findById(db_1.botDB.serverId), arrayPl = dataPrl === null || dataPrl === void 0 ? void 0 : dataPrl.miembros;
        if (arrayPl === null || arrayPl === void 0 ? void 0 : arrayPl.some(s => s.id == gmr.id)) {
            arrayPl.splice(arrayPl.findIndex(f => f.id == gmr.id), 1);
            yield models_1.promoLevelModel.findByIdAndUpdate(db_1.botDB.serverId, { miembros: arrayPl });
        }
    }
});
exports.memberRemoveEvent = memberRemoveEvent;
