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
exports.addDataMarcar = exports.addUserIdCoolSug = exports.coolSugerencias = exports.sistemMarcar = exports.cooldowns = exports.autoModeracion = exports.estadisticas = void 0;
const discord_js_1 = require("discord.js");
const colors_1 = __importDefault(require("colors"));
const db_1 = require("./db");
const models_1 = require("./models");
const config_1 = require("./config");
const ready_1 = require("./events/ready");
const message_1 = require("./events/message");
const interaction_1 = require("./events/interaction");
const messageDelete_1 = require("./events/messageDelete");
const banAdd_1 = require("./events/banAdd");
const banRemove_1 = require("./events/banRemove");
const channelDelete_1 = require("./events/channelDelete");
const memberAdd_1 = require("./events/memberAdd");
const memberRemove_1 = require("./events/memberRemove");
const invitationCreate_1 = require("./events/invitationCreate");
const invitationDelete_1 = require("./events/invitationDelete");
const reactionAdd_1 = require("./events/reactionAdd");
const reactionRemove_1 = require("./events/reactionRemove");
const messageUpdate_1 = require("./events/messageUpdate");
colors_1.default;
const PCEM = new discord_js_1.Client({ intents: 131071 });
exports.estadisticas = { entradas: 0, salidas: 0, mensajes: 0, comandos: 0 }, exports.autoModeracion = [{ miembroID: "717420870267830382", advertencias: 0 }];
exports.cooldowns = new Map();
exports.sistemMarcar = [], exports.coolSugerencias = [];
const addUserIdCoolSug = (id) => {
    exports.coolSugerencias.push(id);
};
exports.addUserIdCoolSug = addUserIdCoolSug;
const addDataMarcar = (data) => exports.sistemMarcar.push(data);
exports.addDataMarcar = addDataMarcar;
PCEM.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    (0, ready_1.readyEvent)(PCEM);
}));
PCEM.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    (0, message_1.messageEvent)(message, PCEM);
}));
PCEM.on('messageDelete', (message) => {
    (0, messageDelete_1.messageDeleteEvent)(message, PCEM);
});
PCEM.on('messageUpdate', (oldMessage, newMessage) => {
    (0, messageUpdate_1.messageUpdateEvent)(oldMessage, newMessage, PCEM);
});
PCEM.on('interactionCreate', (interaction) => {
    (0, interaction_1.interactionEvent)(interaction, PCEM);
});
PCEM.on('guildMemberAdd', (member) => {
    (0, memberAdd_1.memberAddEvent)(member, PCEM);
});
PCEM.on('guildMemberRemove', (member) => {
    (0, memberRemove_1.memberRemoveEvent)(member, PCEM);
});
PCEM.on('guildBanAdd', (ban) => {
    (0, banAdd_1.banAddEvent)(ban, PCEM);
});
PCEM.on('guildBanRemove', (ban) => {
    (0, banRemove_1.banRemoveEvent)(ban, PCEM);
});
PCEM.on('channelDelete', (channel) => {
    (0, channelDelete_1.channelDeleteEvent)(channel, PCEM);
});
PCEM.on('inviteCreate', (invite) => {
    (0, invitationCreate_1.invitationCreateEvent)(invite, PCEM);
});
PCEM.on('inviteDelete', (invite) => {
    (0, invitationDelete_1.invitationDeleteEvent)(invite, PCEM);
});
PCEM.on('messageReactionAdd', (reaction, user) => {
    (0, reactionAdd_1.reactionAddEvent)(reaction, user, PCEM);
});
PCEM.on('messageReactionRemove', (reaction, user) => {
    (0, reactionRemove_1.reactionRemoveEvent)(reaction, user, PCEM);
});
//! Errors events
PCEM.on("shardError", (err) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const dataBot = yield models_1.botModel.findById((_a = PCEM.user) === null || _a === void 0 ? void 0 : _a.id), channelLog = PCEM.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.errors) || '');
    console.log(err);
    const embErr = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.negative} Ocurrió un error`)
        .setDescription(`\`\`\`js\n${err.name}\n\n${err.message}\n\n${err.stack}\`\`\``)
        .setColor(db_1.botDB.color.negative)
        .setTimestamp();
    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embErr] });
}));
process.on("unhandledRejection", (err) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const dataBot = yield models_1.botModel.findById((_b = PCEM.user) === null || _b === void 0 ? void 0 : _b.id), channelLog = PCEM.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.errors) || '');
    console.log(err);
    const embErr = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.negative} Ocurrió un error`)
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setColor(db_1.botDB.color.negative)
        .setTimestamp();
    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embErr] });
}));
PCEM.login(config_1.tokenBot);
