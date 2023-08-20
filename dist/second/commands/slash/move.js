"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../shared/functions");
const __1 = require("../../..");
const data_1 = require("../../data");
const MoveScb = new discord_js_1.SlashCommandBuilder()
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
class MoveSlashCommand extends __1.SlashCommand {
    constructor() {
        super({
            struct: MoveScb,
            guildsIds: [data_1.FrogDb.serverId, data_1.FrogDb.backupServerId, data_1.FrogDb.publishingServerId]
        });
    }
    async execute(int) {
        const { options } = int, subCommand = options.getSubcommand(true);
        if (subCommand == 'file') {
            const messageId = options.getString('id', true), channel = int.guild?.channels.cache.get(options.getChannel('channel', true).id);
            if (isNaN(Number(messageId)))
                return (0, functions_1.setSlashError)(int, 'La id del mensaje no es numérica.');
            if (channel?.type == discord_js_1.ChannelType.GuildText) {
                int.channel?.messages.fetch(messageId).then(async (msg) => {
                    if (!msg.attachments.size)
                        return (0, functions_1.setSlashError)(int, 'El mensaje no tiene archivos.');
                    await int.deferReply({ ephemeral: true });
                    channel.send({ files: msg.attachments.map(m => m) });
                    const MoveEb = new discord_js_1.EmbedBuilder()
                        .setTitle('Files movidos')
                        .setDescription(`Los archivos de mensaje se han movido al canal ${channel}.`)
                        .setColor(int.guild?.members.me?.displayHexColor || 'White');
                    (0, functions_1.sendMessageSlash)(int, { embeds: [MoveEb] });
                });
            }
        }
    }
}
exports.default = MoveSlashCommand;
