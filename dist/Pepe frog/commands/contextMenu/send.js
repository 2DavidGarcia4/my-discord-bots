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
exports.sendCM = exports.sendCMCB = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../db");
const functions_1 = require("../../../utils/functions");
exports.sendCMCB = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Send')
    .setNameLocalizations({
    'en-US': 'Send',
    'es-ES': 'Enviar'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
const sendCM = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { locale } = int, isEnglish = locale == 'en-US' ? true : false, serverId = int.guildId == db_1.frogDb.serverId ? db_1.frogDb.principalServerId : db_1.frogDb.serverId;
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
        .setColor(((_b = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    yield int.deferReply({ ephemeral: true });
    if (channel.type == discord_js_1.ChannelType.GuildText)
        channel.send({ files: int.targetMessage.attachments.map(m => m) }).then((sent) => __awaiter(void 0, void 0, void 0, function* () {
            (0, functions_1.sendMessageSlash)(int, { embeds: [SendEb] });
        }));
});
exports.sendCM = sendCM;
