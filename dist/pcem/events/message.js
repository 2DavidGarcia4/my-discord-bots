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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageEvent = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const models_1 = require("../models");
const db_1 = require("../db");
const help_1 = require("../commands/text/help");
const commands_1 = require("../commands/text/commands");
const addReaction_1 = require("../commands/text/addReaction");
const roles_1 = require("../commands/text/roles");
const ticket_1 = require("../commands/text/ticket");
const information_1 = require("../commands/text/information");
const __1 = require("..");
const functions_1 = require("../../utils/functions");
const eval_1 = require("../commands/text/eval");
const utils_1 = require("../utils");
const reglas_1 = require("../commands/text/reglas");
const messageEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    const { member } = msg, { prefix, emoji, color } = db_1.botDB;
    if (msg.guildId == db_1.botDB.serverId) {
        __1.estadisticas.mensajes++;
        //TODO: Sistema de tickets
        let dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId), arrayTs = dataTs === null || dataTs === void 0 ? void 0 : dataTs.tickets, servidor2 = client.guilds.cache.get('949860813915705354');
        if (arrayTs) {
            arrayTs.forEach((objeto) => __awaiter(void 0, void 0, void 0, function* () {
                var _w;
                if (objeto.id == msg.channelId) {
                    if (objeto.publico && ((_w = msg.member) === null || _w === void 0 ? void 0 : _w.roles.cache.has('887444598715219999')) && msg.channel.type == discord_js_1.ChannelType.GuildText) {
                        objeto.publico = false;
                        objeto.personalID = msg.author.id;
                        yield models_1.ticketsModel.findByIdAndUpdate(db_1.botDB.serverId, { tickets: arrayTs });
                        msg.channel.permissionOverwrites.edit(msg.author.id, { 'ViewChannel': true, 'SendMessages': true });
                        msg.channel.permissionOverwrites.delete('773271945894035486');
                        msg.channel.permissionOverwrites.delete('831669132607881236');
                    }
                    if (msg.content.length == 0 && msg.embeds.length == 0 && msg.components.length == 0 && msg.attachments.size == 0)
                        return;
                    const channelServer2 = servidor2 === null || servidor2 === void 0 ? void 0 : servidor2.channels.cache.get(objeto.copiaID);
                    if ((channelServer2 === null || channelServer2 === void 0 ? void 0 : channelServer2.type) == discord_js_1.ChannelType.GuildText) {
                        let webhook = (yield channelServer2.fetchWebhooks()).map(w => w.url);
                        const webhookCl = new discord_js_1.WebhookClient({ url: webhook[0] });
                        const contentWebhook = {
                            username: msg.author.username,
                            avatarURL: msg.author.displayAvatarURL(),
                            content: msg.content || undefined,
                            embeds: msg.embeds,
                            components: msg.components,
                            files: msg.attachments.map(a => a)
                        };
                        webhookCl.send(contentWebhook);
                    }
                }
            }));
        }
        if (msg.author.bot)
            return;
        //TODO: Roles de timpo
        if (member) {
            const tiempo = Math.floor(Date.now() - Number((_a = member.joinedAt) === null || _a === void 0 ? void 0 : _a.valueOf()));
            const tiempos = [
                { condicion: tiempo >= (0, ms_1.default)("30d") && tiempo < (0, ms_1.default)("60d"), rol: "975068365032947792" },
                { condicion: tiempo >= (0, ms_1.default)("60d") && tiempo < (0, ms_1.default)("90d"), rol: "975068396406329434" },
                { condicion: tiempo >= (0, ms_1.default)("90d") && tiempo < (0, ms_1.default)("120d"), rol: "975068402576154654" },
                { condicion: tiempo >= (0, ms_1.default)("120d") && tiempo < (0, ms_1.default)("150d"), rol: "975068408464949298" },
                { condicion: tiempo >= (0, ms_1.default)("150d") && tiempo < (0, ms_1.default)("180d"), rol: "975068418850050098" },
                { condicion: tiempo >= (0, ms_1.default)("180d") && tiempo < (0, ms_1.default)("210d"), rol: "975068424466214922" },
                { condicion: tiempo >= (0, ms_1.default)("210d") && tiempo < (0, ms_1.default)("240d"), rol: "975068413816868894" },
                { condicion: tiempo >= (0, ms_1.default)("240d") && tiempo < (0, ms_1.default)("270d"), rol: "975068429834915850" },
                { condicion: tiempo >= (0, ms_1.default)("270d") && tiempo < (0, ms_1.default)("300d"), rol: "975068435434319903" },
                { condicion: tiempo >= (0, ms_1.default)("300d") && tiempo < (0, ms_1.default)("330d"), rol: "975068435832770581" },
                { condicion: tiempo >= (0, ms_1.default)("330d") && tiempo < (0, ms_1.default)("360d"), rol: "975068441650274314" },
                { condicion: tiempo >= (0, ms_1.default)("360d") && tiempo < (0, ms_1.default)("547d"), rol: "975068449015480402" },
                { condicion: tiempo >= (0, ms_1.default)("547d") && tiempo < (0, ms_1.default)("730d"), rol: "975068458045825024" },
                { condicion: tiempo >= (0, ms_1.default)("730d"), rol: "975068463687139349" },
            ];
            const option = tiempos.find(f => f.condicion);
            if (option)
                member.roles.add(option === null || option === void 0 ? void 0 : option.rol);
            tiempos.forEach(time => {
                if (member.roles.cache.has(time.rol) && time.rol != (option === null || option === void 0 ? void 0 : option.rol)) {
                    member.roles.remove(time.rol);
                }
            });
        }
        //TODO: Sistema VIP
        if (msg.channelId == '826193847943037018' && msg.channel.type == discord_js_1.ChannelType.GuildText && msg.mentions.everyone && ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.cache.has('826197551904325712')) && !((_c = msg.member) === null || _c === void 0 ? void 0 : _c.permissions.has('Administrator'))) {
            msg.channel.permissionOverwrites.edit(msg.author.id, { 'MentionEveryone': false, });
        }
        //TODO: Auto emojis memes
        if (msg.channelId == '845396662930112533') {
            let mci = msg.content;
            if (msg.attachments.size >= 1 || mci.includes(".png") || mci.includes(".jpg") || mci.includes(".mp4")) {
                msg.react('😂');
                msg.react('938907043014770780');
                msg.react('939974041593319486');
            }
        }
        //TODO: General channel
        if (msg.channelId == "773404850972524615") {
            //? Boost/mejoras
            const newBoostEb = new discord_js_1.EmbedBuilder()
                .setTitle(`${db_1.botDB.emoji.animateBoost} Nueva mejora`)
                .setColor(((_d = msg.member) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White');
            if (msg.type == discord_js_1.MessageType.GuildBoost) {
                msg.channel.sendTyping();
                newBoostEb
                    .setDescription(`**Gracias** ${msg.author} por la mejora, reclama tus recompensas abriendo un ticket en <#830165896743223327>.`);
                setTimeout(() => {
                    msg.channel.send({ embeds: [newBoostEb], content: `<@${msg.author.id}>` }).then(mb => {
                        mb.pin(`${msg.author.tag} ha boosteado el servidor.`);
                    });
                }, 500);
            }
            if (msg.type == discord_js_1.MessageType.GuildBoostTier1) {
                msg.channel.sendTyping();
                newBoostEb
                    .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **1**, reclama tus recompensas abriendo un ticket en <#830165896743223327>.`);
                setTimeout(() => {
                    msg.channel.send({ embeds: [newBoostEb], content: `<@${msg.author.id}>` }).then(mb => {
                        mb.pin(`${msg.author.tag} ha boosteado el servidor y por su boost llegamos al nivel 1.`);
                    });
                }, 500);
            }
            if (msg.type == discord_js_1.MessageType.GuildBoostTier2) {
                msg.channel.sendTyping();
                newBoostEb
                    .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **2** reclama tus recompensas abriendo un ticket en <#830165896743223327>.`);
                setTimeout(() => {
                    msg.channel.send({ embeds: [newBoostEb], content: `<@${msg.author.id}>` }).then(mb => {
                        mb.pin(`${msg.author.tag} ha boosteado el servidor y por su boost llegamos al nivel 2.`);
                    });
                }, 500);
            }
            if (msg.type == discord_js_1.MessageType.GuildBoostTier3) {
                msg.channel.sendTyping();
                newBoostEb
                    .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **3** reclama tus recompensas abriendo un ticket en <#830165896743223327>.`);
                setTimeout(() => {
                    msg.channel.send({ embeds: [newBoostEb], content: `<@${msg.author.id}>` }).then(mb => {
                        mb.pin(`${msg.author.tag} ha boosteado el servidor y por su boost llegamos al nivel 3.`);
                    });
                }, 500);
            }
            //? Respuestas aleatorias
            let cantidad = Math.floor(Math.random() * (100 - 1) + 1);
            if (msg.content.toLowerCase() == "hola" && cantidad >= 30 && cantidad <= 60) {
                msg.channel.sendTyping();
                setTimeout(() => {
                    msg.reply("Hola");
                }, 600);
            }
            let xds = ["xd", "jaja", "jajaja", "sjsjs", "jsjs", "jiji", "XD", "Xd", "xD"];
            if (xds.some(s => s == msg.content.toLowerCase()) && cantidad >= 30 && cantidad <= 60) {
                msg.channel.sendTyping();
                setTimeout(() => {
                    msg.channel.send(xds[Math.floor(Math.random() * xds.length)]);
                }, 600);
            }
        }
        //TODO: Mensaje por mención
        if (msg.content.match(`^<@!?${(_e = client.user) === null || _e === void 0 ? void 0 : _e.id}>( |)$`)) {
            msg.channel.sendTyping();
            const embedMen = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
                .setThumbnail(((_f = client.user) === null || _f === void 0 ? void 0 : _f.displayAvatarURL()) || null)
                .setTitle(`Soy ${(_g = client.user) === null || _g === void 0 ? void 0 : _g.username}`)
                .setDescription(`**El bot de ${(_h = msg.guild) === null || _h === void 0 ? void 0 : _h.name}**, ¿necesitas información o ayuda?`)
                .addFields({ name: `${emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." })
                .setColor(((_k = (_j = msg.guild) === null || _j === void 0 ? void 0 : _j.members.me) === null || _k === void 0 ? void 0 : _k.displayHexColor) || 'White')
                .setFooter({ text: ((_l = msg.guild) === null || _l === void 0 ? void 0 : _l.name) || 'undefined', iconURL: ((_m = msg.guild) === null || _m === void 0 ? void 0 : _m.iconURL()) || undefined })
                .setTimestamp();
            (0, functions_1.sendMessageText)(msg, { embeds: [embedMen] });
        }
        //* Auto moderación -----------------------------
        const discordDomains = ["discord.gg/", "discord.com/invite/"];
        const urlIncludes = ['https://', 'http://', '.com', 'discord.'];
        // && !msg.member?.permissions.has('Administrator')
        if (!((_o = msg.member) === null || _o === void 0 ? void 0 : _o.roles.cache.has('887444598715219999')) && urlIncludes.some(s => msg.content.includes(s))) {
            const dataBot = yield models_1.botModel.findById((_p = client.user) === null || _p === void 0 ? void 0 : _p.id);
            if (!dataBot)
                return;
            const canalesPerIDs = (_q = msg.guild) === null || _q === void 0 ? void 0 : _q.channels.cache.filter(fc => dataBot.autoModeration.ignoreCategories.includes(fc.parentId || '')).map(mc => mc.id);
            const otrosIDCha = dataBot.autoModeration.ignoreChannels;
            canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.push(...otrosIDCha);
            if (!(canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.some(s => s == msg.channelId))) {
                console.log('aaa');
                let urls = msg.content.split(/ +/g).map(m => m.split('\n')).flat().filter(f => urlIncludes.some(s => f.includes(s)));
                const UrlWarningEb = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                    .setTitle(`🔗 Auto moderación de enlaces`)
                    .setDescription(`En este canal no están permitidos los enlaces, hay otros canales que si los permiten pero no todo tipo de enlaces.\n\n*Lee la descripción de cada canal, normalmente contiene información de que esta permitido en el canal o puedes preguntarle a un administrador o moderador*`)
                    .setColor(color.negative)
                    .setFooter({ text: ((_r = msg.guild) === null || _r === void 0 ? void 0 : _r.name) || 'undefined', iconURL: ((_s = msg.guild) === null || _s === void 0 ? void 0 : _s.iconURL()) || undefined });
                if (urls.every(e => discordDomains.some(s => e.includes(s)))) {
                    for (let url of urls) {
                        console.log(url);
                        let invitation = yield client.fetchInvite(url);
                        if (!(((_t = invitation.guild) === null || _t === void 0 ? void 0 : _t.id) == msg.guildId)) {
                            msg.reply({ embeds: [UrlWarningEb], content: `<@${msg.author.id}>` }).then(te => {
                                __1.exemptMessagesIds.push(te.id);
                                setTimeout(() => msg.delete().catch(), 300);
                                setTimeout(() => {
                                    te.delete().catch();
                                }, 25000);
                            });
                            const autoModMember = __1.autoModeration.find(f => f.memberId == msg.author.id);
                            if (autoModMember) {
                                autoModMember.warnings++;
                                (0, utils_1.moderationSanction)(msg, autoModMember);
                            }
                            else {
                                __1.autoModeration.push({ memberId: msg.author.id, warnings: 1 });
                            }
                            return;
                        }
                    }
                }
                else {
                    msg.reply({ embeds: [UrlWarningEb], content: `<@${msg.author.id}>` }).then(te => {
                        __1.exemptMessagesIds.push(te.id);
                        setTimeout(() => msg.delete().catch(), 300);
                        setTimeout(() => {
                            te.delete().catch();
                        }, 25000);
                    });
                    const autoModMember = __1.autoModeration.find(f => f.memberId == msg.author.id);
                    if (autoModMember) {
                        autoModMember.warnings++;
                        (0, utils_1.moderationSanction)(msg, autoModMember);
                    }
                    else {
                        __1.autoModeration.push({ memberId: msg.author.id, warnings: 1 });
                    }
                    return;
                }
            }
        }
    }
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = (_u = args.shift()) === null || _u === void 0 ? void 0 : _u.toLowerCase();
    if (command == 'ayuda')
        (0, help_1.helpCommand)(msg, client);
    if (['comandos', 'cmds'].some(s => s == command))
        (0, commands_1.commandsCommand)(msg, client, args);
    if ((_v = msg.member) === null || _v === void 0 ? void 0 : _v.permissions.has('Administrator')) {
        if (['addreaction', 'addrc'].some(s => s == command))
            (0, addReaction_1.addReactionCommand)(msg, client, args);
        if (command == 'roles')
            (0, roles_1.rolesCommand)(msg);
        if (command == 'ticket')
            (0, ticket_1.ticketCommand)(msg);
        if (command == 'informacion')
            (0, information_1.informationCommand)(msg);
        if (command == 'rules')
            (0, reglas_1.rulesCommand)(msg, client);
    }
    if (db_1.botDB.owners.some(s => s == msg.author.id)) {
        if (['eval', 'ev'].some(s => s == command))
            (0, eval_1.evalCommand)(msg, client, args.join(' '));
    }
});
exports.messageEvent = messageEvent;
