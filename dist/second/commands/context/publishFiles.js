"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const functions_1 = require("../../../shared/functions");
const data_1 = require("../../data");
const services_1 = require("../../lib/services");
const PublishFilesCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Publish files')
    .setNameLocalization('es-ES', 'Publicar archivos')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3)
    .toJSON();
class PublishFiles extends __1.ContextCommand {
    constructor() {
        super({
            struct: PublishFilesCmcb,
            guildsIds: [data_1.FrogDb.publishingServerId]
        });
    }
    async execute(int, client) {
        const { guildId, locale } = int, isEnglish = locale == 'en-US';
        const { serverId, publishingServerId, serverIconUrl } = client.data;
        if (guildId != '1028793496674500659')
            return;
        if (!int.isMessageContextMenuCommand())
            return;
        const { targetMessage, channel } = int;
        if (!targetMessage.attachments.size)
            return (0, functions_1.setSlashError)(int, isEnglish ? 'The message does not contain files.' : 'El mensaje no contiene archivos');
        if (channel?.type == discord_js_1.ChannelType.GuildText) {
            const server = client.guilds.cache.get(serverId), channelServer = server?.channels.cache.find(f => f.name == channel.name);
            if (channelServer?.type == discord_js_1.ChannelType.GuildText) {
                const PublishingWebhook = await (0, services_1.getWebhookClientByChannel)(channelServer);
                PublishingWebhook.send({
                    avatarURL: serverIconUrl,
                    username: server?.name,
                    files: targetMessage.attachments.map(at => at)
                }).then(async () => {
                    const s = targetMessage.attachments.size == 1 ? '' : 's';
                    await int.reply({ ephemeral: true, content: `File${s} successfully posted to the ${channelServer} channel.` });
                });
            }
        }
    }
}
exports.default = PublishFiles;
