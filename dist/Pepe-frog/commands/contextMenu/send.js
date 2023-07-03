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
const discord_js_1 = require("discord.js");
const db_1 = require("../../db");
const functions_1 = require("../../../shared/functions");
const SendCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Send')
    .setNameLocalizations({
    'en-US': 'Send',
    'es-ES': 'Enviar'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
function sendCM(int, client) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { locale, guild } = int, isEnglish = locale == 'en-US' ? true : false, serverId = int.guildId == db_1.FrogDb.serverId ? db_1.FrogDb.principalServerId : db_1.FrogDb.serverId;
        const server = client.guilds.cache.get(serverId);
        if (!int.targetMessage.attachments.size)
            return (0, functions_1.setSlashError)(int, isEnglish ? 'This message no content images or files.' : 'Este mensaje no contiene imágenes ni archivos.');
        const channel = server === null || server === void 0 ? void 0 : server.channels.cache.find(f => {
            var _a;
            if (((_a = int.channel) === null || _a === void 0 ? void 0 : _a.type) == discord_js_1.ChannelType.GuildText) {
                return f.name == int.channel.name;
            }
            return false;
        });
        if (!channel)
            return (0, functions_1.setSlashError)(int, isEnglish ? "I couldn't find a channel similar to this on the other server." : 'No he podido encontrar un canal similar a éste en el otro servidor');
        const SendEb = new discord_js_1.EmbedBuilder()
            .setTitle(isEnglish ? 'Command execution has been successful' : 'La ejecución del comando ha sido exitosa')
            .setDescription(isEnglish ? `The files have been sent to the channel ${channel}` : `Los archivos se ha enviado al canal **${channel}**.`)
            .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White');
        yield int.deferReply({ ephemeral: true });
        if (channel.type == discord_js_1.ChannelType.GuildText)
            channel.send({ files: int.targetMessage.attachments.map(m => m) }).then((sent) => __awaiter(this, void 0, void 0, function* () {
                (0, functions_1.sendMessageSlash)(int, { embeds: [SendEb] });
            }));
    });
}
exports.default = {
    Command: SendCmcb,
    run: sendCM
};
