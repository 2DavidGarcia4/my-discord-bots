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
exports.promotionLevelNotificationReset = exports.setSlashErrors = exports.setSlashError = exports.setErrors = exports.setError = exports.createEmbedMessage = exports.sendMessageSlash = exports.sendMessageText = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const db_1 = require("../db");
const models_1 = require("../models");
const sendMessageText = (msg, optionsMessage) => {
    setTimeout(() => {
        msg.reply(optionsMessage);
    }, 500);
};
exports.sendMessageText = sendMessageText;
const sendMessageSlash = (int, optionsMessage) => {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield int.editReply(optionsMessage);
    }), 600);
};
exports.sendMessageSlash = sendMessageSlash;
const createEmbedMessage = (title, description, color) => {
    return new discord_js_1.EmbedBuilder({ title, description }).setColor(color);
};
exports.createEmbedMessage = createEmbedMessage;
const setError = (msg, description) => {
    msg.channel.sendTyping();
    setTimeout(() => {
        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [(0, exports.createEmbedMessage)(`${db_1.botDB.emoji.negative} Error`, description, db_1.botDB.color.negative)] }).then(tnt => setTimeout(() => {
            tnt.delete().catch(() => '');
            msg.delete().catch(() => '');
        }, 20000));
    }, 500);
};
exports.setError = setError;
const setErrors = (msg, descriptionsAndConditions) => {
    let res = false;
    for (const dac of descriptionsAndConditions) {
        if (dac[0]) {
            (0, exports.setError)(msg, typeof dac[1] == 'boolean' ? '' : dac[1]);
            res = true;
            break;
        }
    }
    return res;
};
exports.setErrors = setErrors;
const setSlashError = (int, description) => __awaiter(void 0, void 0, void 0, function* () {
    yield int.deferReply({ ephemeral: true });
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield int.editReply({ embeds: [(0, exports.createEmbedMessage)(`${db_1.botDB.emoji.negative} Error`, description, db_1.botDB.color.negative)] });
    }), 500);
});
exports.setSlashError = setSlashError;
const setSlashErrors = (int, descriptionsAndConditions) => {
    let res = false;
    for (const dac of descriptionsAndConditions) {
        if (dac[0]) {
            (0, exports.setSlashError)(int, typeof dac[1] == 'boolean' ? '' : dac[1]);
            res = true;
            break;
        }
    }
    return res;
};
exports.setSlashErrors = setSlashErrors;
const promotionLevelNotificationReset = (msg, membersPrl, time) => __awaiter(void 0, void 0, void 0, function* () {
    if (membersPrl === null || membersPrl === void 0 ? void 0 : membersPrl.some(s => s.id == msg.author.id)) {
        let miembro = membersPrl.find(f => f.id == msg.author.id);
        if (miembro) {
            miembro.tag = msg.author.tag;
            miembro.tiempo = Math.floor(Date.now() + (0, ms_1.default)(time));
            miembro.notificado = false;
            yield models_1.promoLevelModel.findByIdAndUpdate(db_1.botDB.serverId, { miembros: membersPrl });
        }
    }
    else {
        membersPrl === null || membersPrl === void 0 ? void 0 : membersPrl.push({ id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now() + (0, ms_1.default)(time)), notificado: false });
        yield models_1.promoLevelModel.findByIdAndUpdate(db_1.botDB.serverId, { miembros: membersPrl });
    }
});
exports.promotionLevelNotificationReset = promotionLevelNotificationReset;
