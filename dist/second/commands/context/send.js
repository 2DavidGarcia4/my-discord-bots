"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data_1 = require("../../data");
const functions_1 = require("../../../shared/functions");
const __1 = require("../../..");
const SendCmcb = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Send')
    .setNameLocalizations({
    'en-US': 'Send',
    'es-ES': 'Enviar'
})
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setType(3).toJSON();
class SendContextCommand extends __1.ContextCommand {
    constructor() {
        super({
            struct: SendCmcb,
            guildsIds: [data_1.FrogDb.backupServerId]
        });
    }
    async execute(int, client) {
        const { locale, guild } = int, isEnglish = locale == 'en-US' ? true : false, serverId = int.guildId == data_1.FrogDb.serverId ? data_1.FrogDb.backupServerId : data_1.FrogDb.serverId;
        const server = client.guilds.cache.get(serverId);
        if (!int.isMessageContextMenuCommand())
            return;
        if (!int.targetMessage.attachments.size)
            return (0, functions_1.setSlashError)(int, isEnglish ? 'This message no content images or files.' : 'Este mensaje no contiene imágenes ni archivos.');
        const channel = server?.channels.cache.find(f => {
            if (int.channel?.type == discord_js_1.ChannelType.GuildText) {
                return f.name == int.channel.name;
            }
            return false;
        });
        if (!channel)
            return (0, functions_1.setSlashError)(int, isEnglish ? "I couldn't find a channel similar to this on the other server." : 'No he podido encontrar un canal similar a éste en el otro servidor');
        const SendEb = new discord_js_1.EmbedBuilder()
            .setTitle(isEnglish ? 'Command execution has been successful' : 'La ejecución del comando ha sido exitosa')
            .setDescription(isEnglish ? `The files have been sent to the channel ${channel}` : `Los archivos se ha enviado al canal **${channel}**.`)
            .setColor(guild?.members.me?.displayHexColor || 'White');
        await int.deferReply({ ephemeral: true });
        if (channel.type == discord_js_1.ChannelType.GuildText)
            channel.send({ files: int.targetMessage.attachments.map(m => m) }).then(async (sent) => {
                (0, functions_1.sendMessageSlash)(int, { embeds: [SendEb] });
            });
    }
}
exports.default = SendContextCommand;
