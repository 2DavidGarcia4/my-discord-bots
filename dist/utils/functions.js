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
exports.selectMultipleRoles = exports.selectRole = exports.promotionLevelNotificationReset = exports.setSlashErrors = exports.setSlashError = exports.setErrors = exports.setError = exports.createEmbedMessage = exports.sendMessageSlash = exports.sendMessageText = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const db_1 = require("../db");
const models_1 = require("../models");
const { color, emoji } = db_1.botDB;
const sendMessageText = (msg, optionsMessage) => {
    setTimeout(() => {
        msg.reply(optionsMessage);
    }, 4000);
};
exports.sendMessageText = sendMessageText;
const sendMessageSlash = (int, optionsMessage) => {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield int.editReply(optionsMessage);
    }), 4000);
};
exports.sendMessageSlash = sendMessageSlash;
const createEmbedMessage = (title, description, color) => {
    return new discord_js_1.EmbedBuilder({ title, description }).setColor(color);
};
exports.createEmbedMessage = createEmbedMessage;
const setError = (msg, description) => {
    msg.channel.sendTyping();
    setTimeout(() => {
        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [(0, exports.createEmbedMessage)(`${emoji.negative} Error`, description, color.negative)] }).then(tnt => setTimeout(() => {
            tnt.delete().catch(() => '');
            msg.delete().catch(() => '');
        }, 20000));
    }, 4000);
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
        yield int.editReply({ embeds: [(0, exports.createEmbedMessage)(`${emoji.negative} Error`, description, color.negative)] });
    }), 4000);
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
const selectRole = (int, value, dictionary, author) => {
    var _a, _b;
    const { locale } = int, inEnglish = locale == 'en-US';
    dictionary.forEach(element => {
        if (author.roles.cache.has(element.rol)) {
            author.roles.remove(element.rol);
            element.status = 'remove';
        }
        else if (element.value == value) {
            author.roles.add(element.rol);
            element.status = 'add';
        }
    });
    const addRoles = dictionary.filter(f => f.status == 'add'), removeRoles = dictionary.filter(f => f.status == 'remove');
    const title = addRoles.length > 0 && removeRoles.length > 0 ? inEnglish ? '🔁 Role reversal' : `🔁 Intercambio de roles` : addRoles.length > 0 ? `${emoji.addition} ${inEnglish ? 'Added role' : 'Rol agregado'}` : `${emoji.subtraction} ${inEnglish ? 'Role removed' : 'Rol eliminado'}`;
    const description = addRoles.length > 0 && removeRoles.length > 0 ? `${inEnglish ? 'You can only have one role of this type therefore I have eliminated you' : 'Solo puedes tener un rol de este tipo por lo tanto te he eliminado'} ${removeRoles.length > 1 ? `${inEnglish ? 'the roles' : 'los roles'} ` + removeRoles.map((m) => `**<@&${m.rol}>**`).join(', ') : `${inEnglish ? 'the rol' : 'el rol'} **<@&${(_a = removeRoles[0]) === null || _a === void 0 ? void 0 : _a.rol}>**`} ${inEnglish ? 'and I have added the role' : 'y te he agregado el rol'} **<@&${(_b = addRoles[0]) === null || _b === void 0 ? void 0 : _b.rol}>** ${inEnglish ? 'which one have you chosen now?' : 'el cual has elegido ahora'}.` : addRoles.length > 0 ? `${inEnglish ? 'The role was added' : 'Se te agrego el rol'} **<@&${addRoles[0].rol}>**.` : `${inEnglish ? 'Your role is removed' : 'Se te elimino el rol'} **<@&${removeRoles[0].rol}>**.`;
    const rolStatusEb = new discord_js_1.EmbedBuilder({ title, description })
        .setColor(addRoles.length > 0 && removeRoles.length > 0 ? color.yellow : addRoles.length > 0 ? color.afirmative : color.negative);
    int.reply({ ephemeral: true, embeds: [rolStatusEb] });
};
exports.selectRole = selectRole;
const selectMultipleRoles = (int, values, dictionary, author) => {
    const { locale } = int, inEnglish = locale == 'en-US';
    values.forEach(value => {
        const element = dictionary.find(f => f.value == value);
        if (element) {
            if (!(author === null || author === void 0 ? void 0 : author.roles.cache.has(element.rol))) {
                author === null || author === void 0 ? void 0 : author.roles.add(element.rol);
                element.status = 'add';
            }
            else {
                author.roles.remove(element.rol);
                element.status = 'remove';
            }
        }
    });
    const addRoles = dictionary.filter(f => f.status == 'add'), removeRoles = dictionary.filter(f => f.status == 'remove');
    const title = addRoles.length > 0 && removeRoles.length > 0 ? `🔁 ${inEnglish ? 'Roles added and removed' : 'Roles agregados y eliminados'}` : addRoles.length > 0 ? `${emoji.addition} ${inEnglish ? 'Added roles' : 'Roles agregados'}` : `${emoji.subtraction} ${inEnglish ? 'Deleted roles' : 'Roles eliminados'}`;
    const rolStatusEb = new discord_js_1.EmbedBuilder({ title })
        .setDescription(`${addRoles.length > 0 ? `${inEnglish ? 'Roles added to you' : 'Roles que se te agregaron'}:\n${addRoles.map((m, i) => `${i + 1}. <@&${m.rol}>`).join('\n')}\n\n` : ''} ${removeRoles.length > 0 ? `${inEnglish ? 'Roles that have been removed' : 'Roles que se te eliminaron'}:\n${removeRoles.map((m, i) => `${i + 1}. <@&${m.rol}>`).join('\n')}` : ''}`)
        .setColor(addRoles.length > 0 && removeRoles.length > 0 ? color.yellow : addRoles.length > 0 ? color.afirmative : color.negative);
    int.reply({ ephemeral: true, embeds: [rolStatusEb] });
};
exports.selectMultipleRoles = selectMultipleRoles;
