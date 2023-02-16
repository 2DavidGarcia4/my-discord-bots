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
exports.deleteCM = exports.deleteCmcb = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("../..");
exports.deleteCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Delete')
    .setNameLocalizations({
    'es-ES': 'Eliminar',
    'en-US': 'Delete'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
const deleteCM = (int) => __awaiter(void 0, void 0, void 0, function* () {
    const { locale, targetMessage } = int, isEnglish = locale == 'en-US' ? true : false;
    const DeleteEb = new discord_js_1.EmbedBuilder()
        .setTitle(isEnglish ? 'Message deleted successfully' : 'Mensaje eliminado correctamente')
        .setColor('Random');
    __1.exemptMessagesIds.push(targetMessage.id);
    targetMessage.delete().then(() => {
        int.reply({ ephemeral: true, embeds: [DeleteEb] });
    }).catch(() => {
        int.reply({ ephemeral: true, content: 'An error has occurred' });
    });
});
exports.deleteCM = deleteCM;
