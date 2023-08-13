"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantillaSlashCommand = exports.plantillaScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
exports.plantillaScb = new discord_js_1.SlashCommandBuilder()
    .setName(`plantilla`)
    .setDescription(`📄 Muestra la plantilla del servidor`).toJSON();
const plantillaSlashCommand = async (int, client) => {
    let invitation = (await int.guild?.invites.fetch())?.find(f => f.inviterId == client?.user?.id);
    let content = `No hay`;
    const channelTemplate = int.guild?.channels.cache.get('848992769245577256');
    await int.deferReply({ ephemeral: true });
    if (channelTemplate?.type == discord_js_1.ChannelType.GuildText) {
        let contentTemplate = (await channelTemplate.messages.fetch({ limit: 2 })).last()?.content.split('|').map(m => m.includes('discord.gg/') ? invitation?.url : m);
        content = contentTemplate?.join(' ') || 'No hay';
    }
    const channelInvite = int.guild?.channels.cache.get('823343749039259648');
    if (!invitation && channelInvite?.type == discord_js_1.ChannelType.GuildText) {
        channelInvite.createInvite({ maxAge: 0, reason: `Para el comando de barra diagonal /plantilla.` }).then(inv => invitation = inv);
    }
    (0, functions_1.sendMessageSlash)(int, { content });
};
exports.plantillaSlashCommand = plantillaSlashCommand;
