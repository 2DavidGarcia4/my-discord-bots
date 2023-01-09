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
exports.deleteReactionsCM = exports.deleteReactionsCmcb = void 0;
const discord_js_1 = require("discord.js");
exports.deleteReactionsCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Delete reactions')
    .setNameLocalizations({
    'es-ES': 'Eliminar reacciones',
    'en-US': 'Delete reactions'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
const deleteReactionsCM = (int) => __awaiter(void 0, void 0, void 0, function* () {
    const { locale } = int, isEnglish = locale == 'en-US' ? true : false;
    const DeleteReactionsEb = new discord_js_1.EmbedBuilder()
        .setTitle(isEnglish ? 'Deleted reactions from this message' : 'Reacciones eliminadas de este mensaje')
        .setColor('Random');
    int.targetMessage.reactions.removeAll().then(() => {
        int.reply({ ephemeral: true, embeds: [DeleteReactionsEb] });
    }).catch(() => {
        int.reply({ ephemeral: true, content: 'An error has occurred' });
    });
});
exports.deleteReactionsCM = deleteReactionsCM;
