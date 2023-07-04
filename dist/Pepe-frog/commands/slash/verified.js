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
const functions_1 = require("../../utils/functions");
const functions_2 = require("../../../shared/functions");
const db_1 = require("../../db");
const VerifiedScb = new discord_js_1.SlashCommandBuilder()
    .setName('verified')
    .setNameLocalization('es-ES', 'verificada')
    .setDescription('✅ Provides information about a verified woman.')
    .setDescriptionLocalization('es-ES', '✅ Proporciona información sobre una mujer verificada.')
    .addUserOption(verified => verified.setName('user')
    .setNameLocalization('es-ES', 'usuario')
    .setDescription('👩 Verified user')
    .setDescriptionLocalization('es-ES', '👩 Usuario verificado')
    .setRequired(false)).toJSON();
function verifiedSlashCommand(int, client) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { guild, user, options, locale } = int, isEnglish = locale == 'en-US';
        const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
        const userOption = options.getUser('user');
        if ((!(author === null || author === void 0 ? void 0 : author.roles.cache.has(db_1.FrogDb.roles.verified))) && !userOption)
            return (0, functions_2.setSlashError)(int, isEnglish ?
                `You are not verified, provide a verified woman to see her information.` :
                `No eres verificada, proporciona a una mujer verificada para ver su información.`);
        const verifiedMember = userOption ? guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userOption.id) : author;
        if (userOption && (0, functions_2.setSlashErrors)(int, [
            [
                Boolean(!verifiedMember),
                isEnglish ? `The provided member *(${userOption.username})* is not found on the server` : `El usuario proporcinado *(${userOption.username})* no se encuentra en el servidor`
            ],
            [
                Boolean(!(verifiedMember === null || verifiedMember === void 0 ? void 0 : verifiedMember.roles.cache.has(db_1.FrogDb.roles.verified))),
                isEnglish ? `The proposed member *(${userOption.username})* is not a verified member` : `El miembro propocionado *(${userOption.username})* no es un miembro verificado`
            ]
        ]))
            return;
        const VerifiedEb = new discord_js_1.EmbedBuilder()
            .setTitle('ℹ️ ' + (isEnglish ?
            'Verified information' :
            'Información verificada'));
        if (verifiedMember) {
            const verifiedsData = yield (0, functions_1.getVerifiedsData)(client);
            const verifiedData = verifiedsData === null || verifiedsData === void 0 ? void 0 : verifiedsData.find(f => f.id == verifiedMember.id);
            if (!verifiedData)
                return (0, functions_2.setSlashError)(int, isEnglish ?
                    `No verified member data found *(${verifiedMember.user.username})*` :
                    `No se encontraron datos del miembro verificado *(${verifiedMember.user.username})*`);
            yield int.deferReply({ ephemeral: true });
            VerifiedEb
                .setColor(verifiedMember.displayHexColor || ((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White')
                .setFields({
                name: '📅 ' + (isEnglish ? 'Verified at' : 'Verificada en') + ':',
                value: `<t:${(0, functions_1.transformTime)(verifiedData.verifiedAt)}:R>`,
                inline: true
            }, {
                name: '📁 ' + (isEnglish ? 'Channel:' : 'Canal') + ':',
                value: verifiedData.channelHidden && !(author === null || author === void 0 ? void 0 : author.permissions.has('ManageGuild')) ? isEnglish ? '*Hidden channel*' : 'Canal oculto' : `<#${verifiedData.channelId}>`,
                inline: true
            }, {
                name: '👀 ' + (isEnglish ? 'Viewable content' : 'Contenido visible') + ':',
                value: verifiedData.contentHidden ? '*❌*' : '✅',
                inline: true
            }, {
                name: '👁️ ' + (isEnglish ? 'Viewable channel' : 'Canal visible') + ':',
                value: verifiedData.channelHidden ? '*❌*' : '✅',
                inline: true
            });
            if (verifiedMember.id != user.id) {
                VerifiedEb
                    .setDescription(isEnglish ?
                    `Information about ${verifiedMember}` :
                    `Información sobre ${verifiedMember}`);
                if ((author === null || author === void 0 ? void 0 : author.permissions.has('ManageGuild')) && VerifiedEb.data.fields) {
                    VerifiedEb.data.fields = [
                        ...VerifiedEb.data.fields,
                        {
                            name: '📣 ' + (isEnglish ? `Ping available` : `Ping disponible`) + ':',
                            value: verifiedData.ping ? '✅' : '*❌*',
                            inline: true
                        },
                        {
                            name: '🔔 ' + (isEnglish ? 'Use of ping' : 'Uso de ping') + ':',
                            value: verifiedData.pinedAt ? `<t:${(0, functions_1.transformTime)(verifiedData.pinedAt)}:R>` : '*' + (isEnglish ? 'not yet used' : 'aún no utilizado') + '*',
                            inline: true
                        },
                        {
                            name: '📢 ' + (isEnglish ? 'Last mention' : 'Última mención') + ':',
                            value: verifiedData.lastMentionAt ? `<t:${(0, functions_1.transformTime)(verifiedData.lastMentionAt)}:R>` : '*' + (isEnglish ? 'no mentions yet' : 'aún sin menciones') + '*',
                            inline: true
                        },
                        {
                            name: '🎯 ' + (isEnglish ? 'Last activity' : 'Última actividad') + ':',
                            value: verifiedData.lastActivityAt ? `<t:${(0, functions_1.transformTime)(verifiedData.lastActivityAt)}:R>` : '*' + (isEnglish ? 'without activity' : 'sin actividad') + '*',
                            inline: true
                        },
                    ];
                }
            }
            else if (VerifiedEb.data.fields) {
                VerifiedEb.data.fields = [
                    ...VerifiedEb.data.fields,
                    {
                        name: '📣 ' + (isEnglish ? `Ping available` : `Ping disponible`) + ': ' + (verifiedData.ping ? '✅' : '*❌*'),
                        value: (isEnglish ? 'Available' : 'Disponible') + ` <t:${(0, functions_1.transformTime)(Date.now() + db_1.FrogDb.verifiedsCooldown)}:R>`,
                        inline: true
                    }
                ];
            }
        }
        (0, functions_2.sendMessageSlash)(int, { embeds: [VerifiedEb] });
    });
}
exports.default = {
    Command: VerifiedScb,
    run: verifiedSlashCommand
};
