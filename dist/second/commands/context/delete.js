"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCmcb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const data_1 = require("../../data");
exports.DeleteCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Delete')
    .setNameLocalizations({
    'es-ES': 'Eliminar',
    'en-US': 'Delete'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
class DeleteContextCommand extends __1.ContextCommand {
    constructor() {
        super({
            struct: exports.DeleteCmcb,
            guildsIds: [data_1.FrogDb.serverId]
        });
    }
    async execute(int, client) {
        if (!int.isMessageContextMenuCommand())
            return;
        const { guild, locale, targetMessage } = int, isEnglish = locale == 'en-US' ? true : false;
        const DeleteEb = new discord_js_1.EmbedBuilder()
            .setTitle(isEnglish ? 'Message deleted successfully' : 'Mensaje eliminado correctamente')
            .setColor(guild?.members.me?.displayHexColor || 'White');
        client.exemptMessagesIds.push(targetMessage.id);
        targetMessage.delete().then(() => {
            int.reply({ ephemeral: true, embeds: [DeleteEb] });
        }).catch(() => {
            int.reply({ ephemeral: true, content: 'An error has occurred' });
        });
    }
}
exports.default = DeleteContextCommand;
