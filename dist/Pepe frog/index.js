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
exports.exemptMessagesIds = exports.modDb = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
//! Events
const ready_1 = require("./events/ready");
const interactionCreate_1 = require("./events/interactionCreate");
const messageCreate_1 = require("./events/messageCreate");
const roleCreate_1 = require("./events/roleCreate");
const roleUpdate_1 = require("./events/roleUpdate");
const roleDelete_1 = require("./events/roleDelete");
const channelDelete_1 = require("./events/channelDelete");
const channelCreate_1 = require("./events/channelCreate");
const channelUpdate_1 = require("./events/channelUpdate");
const memberAdd_1 = require("./events/memberAdd");
const memberRemove_1 = require("./events/memberRemove");
const messageUpdate_1 = require("./events/messageUpdate");
const messageDelete_1 = require("./events/messageDelete");
const reactionAdd_1 = require("./events/reactionAdd");
exports.modDb = [];
exports.exemptMessagesIds = [];
const Frog = new discord_js_1.Client({ intents: 131071 });
Frog.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    (0, ready_1.readyEvent)(Frog);
}));
Frog.on('messageCreate', (message) => {
    (0, messageCreate_1.messageCreateEvent)(message, Frog);
});
Frog.on('messageUpdate', (oldMessage, newMessage) => {
    (0, messageUpdate_1.messageUpdateEvent)(oldMessage, newMessage, Frog);
});
Frog.on('messageDelete', (message) => {
    (0, messageDelete_1.messageDeleteEvent)(message, Frog);
});
Frog.on('messageReactionAdd', (reaction, user) => {
    (0, reactionAdd_1.reactionAddEvent)(reaction, user);
});
Frog.on('interactionCreate', (interaction) => {
    (0, interactionCreate_1.interactionCreateEvent)(interaction, Frog);
});
Frog.on('roleCreate', (role) => {
    (0, roleCreate_1.roleCreateEvent)(role, Frog);
});
Frog.on('roleUpdate', (oldRole, newRole) => {
    (0, roleUpdate_1.roleUpdateEvent)(oldRole, newRole, Frog);
});
Frog.on('roleDelete', (role) => {
    (0, roleDelete_1.roleDeleteEvent)(role, Frog);
});
Frog.on('channelCreate', (channel) => {
    (0, channelCreate_1.channelCreateEvent)(channel, Frog);
});
Frog.on('channelUpdate', (oldChannel, newChannel) => {
    (0, channelUpdate_1.channelUpdateEvetn)(oldChannel, newChannel, Frog);
});
Frog.on('channelDelete', (channel) => {
    console.log('channel delete');
    (0, channelDelete_1.channelDeleteEvent)(channel, Frog);
});
Frog.on('channelPinsUpdate', (channel) => {
    console.log('holaa');
});
Frog.on('guildMemberAdd', (member) => {
    (0, memberAdd_1.memberAddEvent)(member, Frog);
});
Frog.on('guildMemberRemove', (member) => {
    (0, memberRemove_1.memberRemoveEvent)(member, Frog);
});
Frog.login(config_1.pepeFrog);
