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
exports.moveSlashCommand = exports.moveScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../utils/functions");
exports.moveScb = new discord_js_1.SlashCommandBuilder()
    .setName('move')
    .setNameLocalizations({
    'es-ES': 'mover',
    'en-US': 'move'
})
    .setDescription('Move items from a message to another channel.')
    .setDescriptionLocalizations({
    'es-ES': 'Mover elementos de un mensaje a otro canal.',
    'en-US': 'Move items from a message to another channel.'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .addSubcommand(file => file.setName('file')
    .setNameLocalizations({
    'es-ES': 'archivo',
    'en-US': 'file'
})
    .setDescription('📂 Move files from one channel to another.')
    .setDescriptionLocalizations({
    'es-ES': '📂 Mover archivos de un canal a otro.',
    'en-US': '📂 Move files from one channel to another.'
})
    .addStringOption(id => id.setName('id')
    .setDescription('🆔 Id of the message that has the file')
    .setDescriptionLocalizations({
    'es-ES': '🆔 Id del mensaje que tiene el archivo',
    'en-US': '🆔 Id of the message that has the file'
})
    .setRequired(true))
    .addChannelOption(channel => channel.setName('channel')
    .setNameLocalizations({
    'es-ES': 'canal',
    'en-US': 'channel'
})
    .setDescription('🪧 Channel where the file will be sent.')
    .setDescriptionLocalizations({
    'es-ES': '🪧 Canal en donde se enviará el archivo.',
    'en-US': '🪧 Channel where the file will be sent.'
})
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setRequired(true))).toJSON();
const moveSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { options } = int, subCommand = options.getSubcommand(true);
    if (subCommand == 'file') {
        const messageId = options.getString('id', true), channel = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(options.getChannel('channel', true).id);
        if (isNaN(Number(messageId)))
            return (0, functions_1.setSlashError)(int, 'La id del mensaje no es numérica.');
        if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText) {
            (_b = int.channel) === null || _b === void 0 ? void 0 : _b.messages.fetch(messageId).then((msg) => __awaiter(void 0, void 0, void 0, function* () {
                var _c, _d;
                if (!msg.attachments.size)
                    return (0, functions_1.setSlashError)(int, 'El mensaje no tiene archivos.');
                yield int.deferReply({ ephemeral: true });
                channel.send({ files: msg.attachments.map(m => m) });
                const MoveEb = new discord_js_1.EmbedBuilder()
                    .setTitle('Files movidos')
                    .setDescription(`Los archivos de mensaje se han movido al canal ${channel}.`)
                    .setColor(((_d = (_c = int.guild) === null || _c === void 0 ? void 0 : _c.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White');
                (0, functions_1.sendMessageSlash)(int, { embeds: [MoveEb] });
            }));
        }
    }
});
exports.moveSlashCommand = moveSlashCommand;
