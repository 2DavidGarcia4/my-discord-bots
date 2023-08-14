"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
const db_1 = require("../../db");
const functions_1 = require("../../../shared/functions");
const services_1 = require("../../lib/services");
const notion_1 = require("../../lib/notion");
const PublishFilesScb = new discord_js_1.SlashCommandBuilder()
    .setName('publish-files')
    .setNameLocalization('es-ES', 'publicar-archivos')
    .setDescription('🗃️ Publish files to main server')
    .setDescriptionLocalization('es-ES', '🗃️ Pública archivos al servidor principal')
    .addStringOption(first => first.setName('first')
    .setNameLocalization('es-ES', 'primer')
    .setDescription('🆔 First message ID')
    .setDescriptionLocalization('es-ES', '🆔 ID del primer mensaje')
    .setRequired(true))
    .addIntegerOption(limit => limit.setName('limit')
    .setNameLocalization('es-ES', 'límite')
    .setDescription('💣 Message limit to targets')
    .setDescriptionLocalization('es-ES', '💣 Límite de mensajes a objetivos')
    .setMinValue(2)
    .setMaxValue(100)
    .setRequired(false))
    .toJSON();
class PublishFilesSlashCommand extends __1.SlashCommand {
    constructor() {
        super(PublishFilesScb, [db_1.FrogDb.publishingServerId]);
    }
    async execute(int, client) {
        const { channel, options } = int;
        const { serverId, serverIconUrl } = client.data;
        const firstMessageId = options.getString('first', true), limit = options.getInteger('limit');
        if (channel?.type != discord_js_1.ChannelType.GuildText)
            return (0, functions_1.setSlashError)(int, `The channel is not type text.`);
        const snackServer = client.getGuildById(serverId), snackChannel = snackServer?.channels.cache.find(f => f.name == channel.name);
        if (snackChannel?.type != discord_js_1.ChannelType.GuildText)
            return (0, functions_1.setSlashError)(int, 'The main server channel is not type text.');
        const { roles } = await (0, notion_1.getSnackData)();
        const PublishingWebhook = await (0, services_1.getWebhookClientByChannel)(snackChannel);
        const messages = (await channel.messages.fetch({ limit: 50 })).map(m => m);
        const firstMessageIndex = messages.findIndex(f => f.id == firstMessageId);
        const lastFileIndex = limit ? firstMessageIndex - limit + 1 : 0;
        const files = firstMessageIndex + 1 - lastFileIndex;
        const PublishFilesEb = new discord_js_1.EmbedBuilder()
            .setTitle('Publishing files...')
            .setColor('Blue');
        await int.reply({ ephemeral: true, embeds: [PublishFilesEb] }).then(async (intR) => {
            for (let i = firstMessageIndex; i >= lastFileIndex; i--) {
                const message = messages[i];
                // console.log({i})
                await PublishingWebhook.send({
                    avatarURL: serverIconUrl,
                    username: snackServer?.name,
                    files: message.attachments.map(at => at)
                });
                message.react('☑️');
                const submitFiles = firstMessageIndex - i + 1;
                PublishFilesEb.setDescription(`<a:loop:964162886865944617> ${submitFiles}/${files} files`);
                await intR.edit({
                    embeds: [PublishFilesEb]
                });
            }
            PublishFilesEb
                .setTitle('✅ Published files')
                .setDescription(`**${files}** files have been posted to the channel ${snackChannel}.`)
                .setColor('Green');
            await intR.edit({ embeds: [PublishFilesEb] });
            PublishingWebhook.send({
                avatarURL: serverIconUrl,
                username: snackServer?.name,
                content: `**¡Nuevo contenido!\nNew content!**\n<@&${roles.content}>`
            });
        });
    }
}
exports.default = PublishFilesSlashCommand;
