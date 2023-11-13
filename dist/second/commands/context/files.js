"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const data_1 = require("../../data");
const functions_1 = require("../../../shared/functions");
const FilesCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Files')
    .setNameLocalization('es-ES', 'Archivos')
    .setType(3)
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .toJSON();
class FilesContextCommand extends __1.ContextCommand {
    constructor() {
        super({
            struct: FilesCmcb,
            guildsIds: [data_1.FrogDb.serverId, data_1.FrogDb.backupServerId, data_1.FrogDb.publishingServerId, '949861760096145438']
        });
    }
    async execute(int, client) {
        if (!int.isMessageContextMenuCommand())
            return;
        const { guild, targetMessage } = int;
        if (!targetMessage.attachments.size)
            return (0, functions_1.setSlashError)(int, 'The message contains no files');
        await int.deferReply({ ephemeral: true });
        const FilesEb = new discord_js_1.EmbedBuilder()
            .setTitle('🗂️ Files')
            .setColor('Blue');
        const embedFields = [];
        targetMessage.attachments.forEach(at => {
            embedFields.push({
                name: `${at.name}`,
                value: `Size: *${(at.size / 1048576).toFixed(3)}*\nDimentions: *${at.width}×${at.height}*\nContent type: ${at.contentType}${at.description ? '\nDescription: ' + at.description : ''}\n[Url](${at.url})`,
                inline: true
            });
        });
        FilesEb.data.fields = embedFields;
        (0, functions_1.sendMessageSlash)(int, { embeds: [FilesEb] });
    }
}
exports.default = FilesContextCommand;
