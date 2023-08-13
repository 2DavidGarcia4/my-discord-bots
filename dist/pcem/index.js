"use strict";
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
const Bot = new discord_js_1.Client({ intents: 131071 });
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
Bot.on('ready', async () => {
    (0, ready_1.readyEvent)(Bot);
});
Bot.on('messageCreate', async (message) => {
    (0, message_1.messageEvent)(message, Bot);
});
Bot.on('messageDelete', (message) => {
    (0, messageDelete_1.messageDeleteEvent)(message, Bot);
});
Bot.on('messageUpdate', (oldMessage, newMessage) => {
    (0, messageUpdate_1.messageUpdateEvent)(oldMessage, newMessage, Bot);
});
Bot.on('interactionCreate', (interaction) => {
    (0, interaction_1.interactionEvent)(interaction, Bot);
});
Bot.on('guildMemberAdd', (member) => {
    (0, memberAdd_1.memberAddEvent)(member, Bot);
});
Bot.on('guildMemberRemove', (member) => {
    (0, memberRemove_1.memberRemoveEvent)(member, Bot);
});
Bot.on('guildCreate', (guild) => {
    (0, guildCreate_1.guildCreateEvent)(guild, Bot);
});
Bot.on('guildDelete', (guild) => {
    (0, guildDelete_1.guildDeleteEvent)(guild, Bot);
});
Bot.on('guildBanAdd', (ban) => {
    (0, banAdd_1.banAddEvent)(ban, Bot);
});
Bot.on('guildBanRemove', (ban) => {
    (0, banRemove_1.banRemoveEvent)(ban, Bot);
});
Bot.on('channelDelete', (channel) => {
    (0, channelDelete_1.channelDeleteEvent)(channel, Bot);
});
Bot.on('inviteCreate', (invite) => {
    (0, invitationCreate_1.invitationCreateEvent)(invite, Bot);
});
Bot.on('inviteDelete', (invite) => {
    (0, invitationDelete_1.invitationDeleteEvent)(invite, Bot);
});
Bot.on('messageReactionAdd', (reaction, user) => {
    (0, reactionAdd_1.reactionAddEvent)(reaction, user, Bot);
});
Bot.on('messageReactionRemove', (reaction, user) => {
    (0, reactionRemove_1.reactionRemoveEvent)(reaction, user, Bot);
});
//! Errors events
Bot.on("shardError", async (err) => {
    const dataBot = await (0, utils_1.getBotData)(Bot), channelLog = Bot.channels.cache.get(dataBot?.logs.errors || '');
    console.log(err);
    const embErr = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.negative} Ocurrió un error`)
        .setDescription(`\`\`\`js\n${err.name}\n\n${err.message}\n\n${err.stack}\`\`\``)
        .setColor(db_1.botDB.color.negative)
        .setTimestamp();
    if ((!config_1.isDevelopment) && channelLog?.type == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embErr] });
});
process.on("unhandledRejection", async (err) => {
    const dataBot = await (0, utils_1.getBotData)(Bot), channelLog = Bot.channels.cache.get(dataBot?.logs.errors || '');
    console.log(err);
    const embErr = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.negative} Ocurrió un error`)
        .setDescription(`\`\`\`js\n${err}\`\`\``)
        .setColor(db_1.botDB.color.negative)
        .setTimestamp();
    if ((!config_1.isDevelopment) && channelLog?.type == discord_js_1.ChannelType.GuildText)
        channelLog.send({ embeds: [embErr] });
});
Bot.login(config_1.tokenBot);
