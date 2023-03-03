"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = exports.commandsCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const message_1 = require("../../../events/message");
const utils_1 = require("../../../utils");
exports.name = 'commands';
const commandsCommand = (msg, client) => {
    const { member, guild, } = msg;
    msg.channel.sendTyping();
    const CommandsEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${(member === null || member === void 0 ? void 0 : member.nickname) || (member === null || member === void 0 ? void 0 : member.user.username)}`, iconURL: member === null || member === void 0 ? void 0 : member.user.displayAvatarURL() })
        .setTitle(`📄 Comandos`)
        .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.\n\n${message_1.textCommands.map((m, name) => `\`\`${name}\`\``).join(', ')}`)
        .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
        .setColor((0, utils_1.getEmbedColor)(msg.guild))
        .setTimestamp();
    (0, functions_1.sendMessageText)(msg, { embeds: [CommandsEb] });
};
exports.commandsCommand = commandsCommand;
exports.alias = ['cmds', 'comandos'];
