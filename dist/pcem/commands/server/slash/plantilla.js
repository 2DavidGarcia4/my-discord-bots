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
exports.plantillaSlashCommand = exports.plantillaScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
exports.plantillaScb = new discord_js_1.SlashCommandBuilder()
    .setName(`plantilla`)
    .setDescription(`📄 Muestra la plantilla del servidor`).toJSON();
const plantillaSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    let invitation = (_b = (yield ((_a = int.guild) === null || _a === void 0 ? void 0 : _a.invites.fetch()))) === null || _b === void 0 ? void 0 : _b.find(f => { var _a; return f.inviterId == ((_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.id); });
    let content = `No hay`;
    const channelTemplate = (_c = int.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.get('848992769245577256');
    yield int.deferReply({ ephemeral: true });
    if ((channelTemplate === null || channelTemplate === void 0 ? void 0 : channelTemplate.type) == discord_js_1.ChannelType.GuildText) {
        let contentTemplate = (_d = (yield channelTemplate.messages.fetch({ limit: 2 })).last()) === null || _d === void 0 ? void 0 : _d.content.split('|').map(m => m.includes('discord.gg/') ? invitation === null || invitation === void 0 ? void 0 : invitation.url : m);
        content = (contentTemplate === null || contentTemplate === void 0 ? void 0 : contentTemplate.join(' ')) || 'No hay';
    }
    const channelInvite = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.channels.cache.get('823343749039259648');
    if (!invitation && (channelInvite === null || channelInvite === void 0 ? void 0 : channelInvite.type) == discord_js_1.ChannelType.GuildText) {
        channelInvite.createInvite({ maxAge: 0, reason: `Para el comando de barra diagonal /plantilla.` }).then(inv => invitation = inv);
    }
    (0, functions_1.sendMessageSlash)(int, { content });
});
exports.plantillaSlashCommand = plantillaSlashCommand;
