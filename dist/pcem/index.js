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
exports.addDataMarcar = exports.addUserIdCoolSug = exports.coolSugerencias = exports.sistemMarcar = exports.cooldowns = exports.exemptMessagesIds = exports.autoModeration = exports.svStatistics = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("./db");
const config_1 = require("../config");
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
const utils_1 = require("./utils");
const guildDelete_1 = require("./events/guildDelete");
const guildCreate_1 = require("./events/guildCreate");
const PCEM = new discord_js_1.Client({ intents: 131071 });
exports.svStatistics = { joins: 0, leaves: 0, messages: 0, commands: 0 }, exports.autoModeration = [{ memberId: "717420870267830382", warnings: 0 }];
exports.exemptMessagesIds = [];
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
PCEM.on('guildCreate', (guild) => {
    (0, guildCreate_1.guildCreateEvent)(guild, PCEM);
});
PCEM.on('guildDelete', (guild) => {
    (0, guildDelete_1.guildDeleteEvent)(guild, PCEM);
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
    const dataBot = yield (0, utils_1.getBotData)(PCEM), channelLog = PCEM.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.errors) || '');
    console.log(err);
    const embErr = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.negative} Ocurrió un error`)
        .setDescription(`\`\`\`js\n${err.name}\n\n${err.message}\n\n${err.stack}\`\`\``)
        .setColor(db_1.botDB.color.negative)
        .setTimestamp();
    if ((!config_1.isDevelopment) && (channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embErr] });
}));
process.on("unhandledRejection", (err) => __awaiter(void 0, void 0, void 0, function* () {
    const dataBot = yield (0, utils_1.getBotData)(PCEM), channelLog = PCEM.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.errors) || '');
    console.log(err);
    const embErr = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.negative} Ocurrió un error`)
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setColor(db_1.botDB.color.negative)
        .setTimestamp();
    if ((!config_1.isDevelopment) && (channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embErr] });
}));
PCEM.login(config_1.tokenBot);
