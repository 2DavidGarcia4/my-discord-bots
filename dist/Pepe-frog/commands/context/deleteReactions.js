"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteReactionsCmcb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../..");
const db_1 = require("../../db");
exports.DeleteReactionsCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Delete reactions')
    .setNameLocalizations({
    'es-ES': 'Eliminar reacciones',
    'en-US': 'Delete reactions'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
class DeleteReactionsContexCommand extends __1.ContextCommand {
    constructor() {
        super(exports.DeleteReactionsCmcb, [db_1.FrogDb.serverId]);
    }
    async execute(int) {
        const { locale } = int, isEnglish = locale == 'en-US' ? true : false;
        if (!int.isMessageContextMenuCommand())
            return;
        const DeleteReactionsEb = new discord_js_1.EmbedBuilder()
            .setTitle(isEnglish ? 'Deleted reactions from this message' : 'Reacciones eliminadas de este mensaje')
            .setColor('Random');
        int.targetMessage.reactions.removeAll().then(() => {
            int.reply({ ephemeral: true, embeds: [DeleteReactionsEb] });
        }).catch(() => {
            int.reply({ ephemeral: true, content: 'An error has occurred' });
        });
    }
}
exports.default = DeleteReactionsContexCommand;
