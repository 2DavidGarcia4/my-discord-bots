"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const functions_1 = require("../../../shared/functions");
const models_1 = require("../../../models");
const SaveFilesCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Save files')
    .setNameLocalization('es-ES', 'Guardar archivos')
    .setType(3)
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .toJSON();
class SaveFilesContextCommand extends __1.ContextCommand {
    constructor() {
        super({
            struct: SaveFilesCmcb
        });
    }
    async execute(int, client) {
        if (!int.isMessageContextMenuCommand())
            return;
        const { guild, targetMessage } = int;
        if (!targetMessage.attachments.size)
            return (0, functions_1.setSlashError)(int, 'The message does not contain files');
        await int.deferReply({ ephemeral: true });
        const SavingFilesEb = new discord_js_1.EmbedBuilder()
            .setTitle('🗂️ Saving files...')
            .setColor('Blue');
        await int.editReply({ embeds: [SavingFilesEb] });
        let savedFiles = 0;
        for (const [_, attachment] of targetMessage.attachments) {
            try {
                const file = await models_1.SnackFilesModel.findOne({ fileUrl: attachment.url });
                if (file === null) {
                    await models_1.SnackFilesModel.create({
                        fileUrl: attachment.url,
                        categories: [],
                        size: attachment.size,
                        type: attachment.contentType,
                        width: attachment.width,
                        height: attachment.height
                    });
                    savedFiles++;
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        const SavedFilesEb = new discord_js_1.EmbedBuilder({
            title: `🗂️ ${savedFiles === 0 ? 'No files saved' : 'Saved files'}`,
            description: `${savedFiles}/${targetMessage.attachments.size} saved files.`
        }).setColor('Green');
        await int.editReply({ embeds: [SavedFilesEb] });
    }
}
exports.default = SaveFilesContextCommand;
