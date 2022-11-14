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
const functions_1 = require("../utils/functions");
const eval_1 = require("../commands/text/eval");
const messageEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    const { prefix, emoji, color } = db_1.botDB;
    if (msg.guildId == db_1.botDB.serverId) {
        __1.estadisticas.mensajes++;
        //TODO: Sistema de tickets
        let dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId), arrayTs = dataTs === null || dataTs === void 0 ? void 0 : dataTs.tickets, servidor2 = client.guilds.cache.get('949860813915705354');
        if (arrayTs) {
            arrayTs.forEach((objeto) => __awaiter(void 0, void 0, void 0, function* () {
                var _7;
                if (objeto.id == msg.channelId) {
                    if (objeto.publico && ((_7 = msg.member) === null || _7 === void 0 ? void 0 : _7.roles.cache.has('887444598715219999')) && msg.channel.type == discord_js_1.ChannelType.GuildText) {
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
        //TODO: Colaboradores
        let dataCol = yield models_1.collaboratorsModel.findById(db_1.botDB.serverId), arrayCo = dataCol === null || dataCol === void 0 ? void 0 : dataCol.colaboradores;
        if (dataCol === null || dataCol === void 0 ? void 0 : dataCol.colaboradores.filter(f => f.colaborador).some(s => s.canalID == msg.channelId)) {
            let miembroCo = arrayCo === null || arrayCo === void 0 ? void 0 : arrayCo.find(f => f.canalID == msg.channelId);
            if (msg.mentions.everyone && (miembroCo === null || miembroCo === void 0 ? void 0 : miembroCo.id) == msg.author.id && msg.channel.type == discord_js_1.ChannelType.GuildText) {
                msg.channel.permissionOverwrites.edit(msg.author.id, { 'MentionEveryone': false, });
                miembroCo.tiempo = Date.now() + (0, ms_1.default)("1d");
                miembroCo.notificado = false;
                yield models_1.collaboratorsModel.findByIdAndUpdate(db_1.botDB.serverId, { colaboradores: arrayCo });
            }
        }
        //TODO: Sistema VIP
        if (msg.channelId == '826193847943037018' && msg.channel.type == discord_js_1.ChannelType.GuildText && msg.mentions.everyone && ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has('826197551904325712')) && !((_b = msg.member) === null || _b === void 0 ? void 0 : _b.permissions.has('Administrator'))) {
            msg.channel.permissionOverwrites.edit(msg.author.id, { 'MentionEveryone': false, });
        }
        //TODO: PromoNvl
        if (msg.channelId == '977427047343325284' && msg.channel.type == discord_js_1.ChannelType.GuildText) {
            if (db_1.botDB.levelRoles.some(s => { var _a; return (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has(s); })) {
                let dataPrl = yield models_1.promoLevelModel.findById(db_1.botDB.serverId), arrayPl = dataPrl === null || dataPrl === void 0 ? void 0 : dataPrl.miembros;
                msg.channel.permissionOverwrites.edit(msg.author.id, { 'SendMessages': false, });
                let rolIndex = 0;
                for (let i = 8; i > 0; i--) {
                    if ((_c = msg.member) === null || _c === void 0 ? void 0 : _c.roles.cache.has(db_1.botDB.levelRoles[rolIndex])) {
                        (0, functions_1.promotionLevelNotificationReset)(msg, arrayPl, i + 'd');
                    }
                    rolIndex++;
                }
                if ((_d = msg.member) === null || _d === void 0 ? void 0 : _d.roles.cache.has(db_1.botDB.levelRoles.find((f, i) => i == 8) || '')) {
                    (0, functions_1.promotionLevelNotificationReset)(msg, arrayPl, '12h');
                }
                if (db_1.botDB.levelRoles.slice(9).some(s => { var _a; return (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.has(s); })) {
                    (0, functions_1.promotionLevelNotificationReset)(msg, arrayPl, '6h');
                }
            }
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
                .setColor(((_e = msg.member) === null || _e === void 0 ? void 0 : _e.displayHexColor) || 'White');
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
        if (msg.content.match(`^<@!?${(_f = client.user) === null || _f === void 0 ? void 0 : _f.id}>( |)$`)) {
            msg.channel.sendTyping();
            const embedMen = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
                .setThumbnail(((_g = client.user) === null || _g === void 0 ? void 0 : _g.displayAvatarURL()) || null)
                .setTitle(`Soy ${(_h = client.user) === null || _h === void 0 ? void 0 : _h.username}`)
                .setDescription(`**El bot de ${(_j = msg.guild) === null || _j === void 0 ? void 0 : _j.name}**, ¿necesitas información o ayuda?`)
                .addFields({ name: `${emoji.information} **Información**`, value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>." }, { name: `${emoji.staff} **Soporte**`, value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento." })
                .setColor(((_l = (_k = msg.guild) === null || _k === void 0 ? void 0 : _k.members.me) === null || _l === void 0 ? void 0 : _l.displayHexColor) || 'White')
                .setFooter({ text: ((_m = msg.guild) === null || _m === void 0 ? void 0 : _m.name) || 'undefined', iconURL: ((_o = msg.guild) === null || _o === void 0 ? void 0 : _o.iconURL()) || undefined })
                .setTimestamp();
            (0, functions_1.sendMessageText)(msg, { embeds: [embedMen] });
        }
        //* Auto moderación -----------------------------
        if (!((_p = msg.member) === null || _p === void 0 ? void 0 : _p.roles.cache.has('887444598715219999')) && !((_q = msg.member) === null || _q === void 0 ? void 0 : _q.permissions.has('Administrator'))) {
            const dataBot = yield models_1.botModel.findById((_r = client.user) === null || _r === void 0 ? void 0 : _r.id);
            if (!dataBot)
                return;
            const canalesPerIDs = (_s = msg.guild) === null || _s === void 0 ? void 0 : _s.channels.cache.filter(fc => dataBot.autoModeration.ignoreCategories.includes(fc.parentId || '')).map(mc => mc.id);
            const otrosIDCha = dataBot.autoModeration.ignoreChannels;
            canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.push(...otrosIDCha);
            if (msg.content == "p.canalesModerados") {
                if (((_t = msg.guild) === null || _t === void 0 ? void 0 : _t.ownerId) == msg.author.id && canalesPerIDs) {
                    let tabla = [];
                    for (let i = 0; i < canalesPerIDs.length; i++) {
                        tabla.push(`**${i + 1} .** <#${(_v = (_u = msg.guild) === null || _u === void 0 ? void 0 : _u.channels.cache.get(canalesPerIDs[i])) === null || _v === void 0 ? void 0 : _v.id}>`);
                    }
                    const embChaMod = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                        .setDescription(`Hay un total de **${canalesPerIDs.length}** canales que tienen des activada la auto moderación de enlaces.\n\n${tabla.join("\n")}`)
                        .setColor(((_x = (_w = msg.guild) === null || _w === void 0 ? void 0 : _w.members.me) === null || _x === void 0 ? void 0 : _x.displayHexColor) || 'White')
                        .setTimestamp();
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embChaMod] });
                }
            }
            if (!(canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.some(s => s == msg.channelId))) {
                let enlaces = [{ urls: ["discord.gg/", "discord.com/invite/"] }, { urls: ["youtube.com", "youtu.be"] }, { urls: ["twitch.tv"] }, { urls: ["tiktok.com", "vm.tiktok.com"] }, { urls: ["twitter.com"] }, { urls: ["instagram.com"] }, { urls: ["https:", "http:", ".com"] }];
                let titulos = ["<a:DiscordLogo:973995348974505984> Auto moderación de enlaces de Discord", "<:youtubelogo:855166340780130354> Auto moderación de enlaces de YouTube", "<:TwitchEmblema:855167274193125396> Auto moderación de enlaces de Twitch", "<:Mamadatok:855167926875979837> Auto moderación de enlaces de TikTok", `<:TwitterLogo:855168545566490664> Auto moderación de enlaces de Twitter`, "<:instagram:855169028376494080> Auto moderación de enlaces de Instagram", "🔗 Auto moderación de enlaces"];
                let descripciones = [` de **Discord**, el canal correcto para publicar un enlace de **Discord** es <#823381769750577163> o <#836315643070251008>`, ` de **YouTube**, el canal correcto para publicar un enlace de **YouTube** es <#823961526297165845> o <#836315643070251008>`, ` de **Twitch**, el canal correcto para publicar un enlace de **Twitch** es <#823381980389310464> o <#836315643070251008>`, ` de **TikTok**, el canal correcto para publicar un enlace de **TikTok** es <#827295990360965153> o <#836315643070251008>`, ` de **Twitter**, el canal correcto para publicar un enlace de **Twitter** es <#823381924344758313> o <#836315643070251008>`, ` de **Instagram**, el canal correcto para publicar un enlace de **Instagram** es <#823382007391584276> o <#836315643070251008>`, `, si quiere hacer promoción hágalo en los canales de la categoría **<#785729364288339978>** como <#836315643070251008>.\nSi esta perdido y necesita ayuda mencione a un <@&831669132607881236>.`];
                let colores = ["#5965F1", "#FE0100", "#6441a5", "#030303", "#1CA1F3", "#ED0D6E", color.negative];
                for (const m in enlaces) {
                    let count = 0;
                    if (enlaces[m].urls.some(s => msg.content.includes(s)) && count == 0) {
                        count++;
                        const embWarn = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                            .setTitle(titulos[m])
                            .setDescription(`Lo ciento ${msg.author} en este canal no esta permitido publicar enlaces${descripciones[m]}`)
                            .setColor(colores[m])
                            .setFooter({ text: `🛑 Advertencia por ${(_y = client.user) === null || _y === void 0 ? void 0 : _y.tag}`, iconURL: (_z = client.user) === null || _z === void 0 ? void 0 : _z.displayAvatarURL() })
                            .setTimestamp();
                        setTimeout(() => {
                            msg.delete().catch(c => console.log(c));
                            msg.channel.send({ embeds: [embWarn], content: `<@${msg.author.id}>` }).then(tw => {
                                setTimeout(() => {
                                    tw.delete().catch(c => console.log(c));
                                }, 24000);
                            });
                        }, 800);
                        if (__1.autoModeracion.some(s => s.miembroID == msg.author.id)) {
                            const autoModMember = __1.autoModeracion.find(f => f.miembroID == msg.author.id);
                            if (autoModMember) {
                                autoModMember.advertencias++;
                                if (autoModMember.advertencias >= 2) {
                                    const embAdvertenciaMD = new discord_js_1.EmbedBuilder()
                                        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                                        .setTitle(`🔗 Auto moderación de enlaces`)
                                        .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
                                        .setColor(color.negative);
                                    msg.author.send({ embeds: [embAdvertenciaMD] }).catch(() => '');
                                }
                                if (autoModMember.advertencias == 3) {
                                    (_0 = msg.member) === null || _0 === void 0 ? void 0 : _0.timeout(4 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                }
                                if (autoModMember.advertencias == 4) {
                                    (_1 = msg.member) === null || _1 === void 0 ? void 0 : _1.timeout(8 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                }
                                if (autoModMember.advertencias == 5) {
                                    (_2 = msg.member) === null || _2 === void 0 ? void 0 : _2.timeout(10 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                }
                                if (autoModMember.advertencias == 6) {
                                    (_3 = msg.member) === null || _3 === void 0 ? void 0 : _3.kick(`Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                }
                                if (autoModMember.advertencias == 7) {
                                    (_4 = msg.member) === null || _4 === void 0 ? void 0 : _4.ban({ reason: `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.` });
                                }
                            }
                        }
                        else {
                            __1.autoModeracion.push({ miembroID: msg.author.id, advertencias: 1 });
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            let canales = [
                { id: "823381769750577163", color: "#5965F1", urls: ["discord.gg/", "discord.com/invite/"], titulo: `${emoji.discord} Auto moderación de enlaces de Discord`, descripcion: `Este canal no es el correcto para publicar enlaces de **Discord**, puedes publicar enlaces de Discord en su canal <#823381769750577163> o <#836315643070251008>.` },
                { id: "823961526297165845", color: "#FE0100", urls: ["youtube.com", "youtu.be"], titulo: `${emoji.youTube} Auto moderación de enlaces de YouTube`, descripcion: `Este canal no es el correcto para publicar enlaces de **YouTube**, puedes publicar enlaces de YouTube en su canal <#823961526297165845> o <#836315643070251008>.` },
                { id: "823381980389310464", color: "#6441a5", urls: ["twitch.tv"], titulo: `${emoji.twitch} Auto moderación de enlaces de Twitch`, descripcion: `Este canal no es el correcto para publicar enlaces de **Twitch**, puedes publicar enlaces de Twitch en su canal <#823381980389310464> o <#836315643070251008>.` },
                { id: "823382007391584276", color: "#ED0D6E", urls: ["instagram.com"], titulo: `${emoji.instagram} Auto moderación de enlaces de Instagram`, descripcion: `Este canal no es el correcto para publicar enlaces de **Instagram**, puedes publicar enlaces de Instagram en su canal <#823382007391584276> o <#836315643070251008>.` },
                { id: "827295990360965153", color: "#030303", urls: ["tiktok.com", "vm.tiktok.com"], titulo: `${emoji.tickTock} Auto moderación de enlaces de TikTok`, descripcion: `Este canal no es el correcto para publicar enlaces de **TikTok**, puedes publicar enlaces de TikTok en su canal <#827295990360965153> o <#836315643070251008>.` },
                { id: "823381924344758313", color: "#1CA1F3", urls: ["twitter.com"], titulo: `${emoji.twitter} Auto moderación de enlaces de Twitter`, descripcion: `Este canal no es el correcto para publicar enlaces de **Twitter**, puedes publicar enlaces de Twitter en su canal <#823381924344758313> o <#836315643070251008>.` },
            ];
            if (canales.some(s => s.id == msg.channelId) && ["https://", "www", ".com"].some(s => msg.content.includes(s))) {
                let canal = canales.find(f => f.id == msg.channelId);
                if (!(canal === null || canal === void 0 ? void 0 : canal.urls.some(s => msg.content.includes(s)))) {
                    canales.forEach((valorCh, psCh) => {
                        var _a, _b, _c, _d, _e, _f, _g;
                        if (valorCh.urls.some(s => msg.content.includes(s))) {
                            const embAdvertencia = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                                .setTitle(valorCh.titulo)
                                .setDescription(valorCh.descripcion)
                                .setColor(valorCh.color)
                                .setFooter({ text: ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.name) || 'undefined', iconURL: ((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.iconURL()) || undefined });
                            setTimeout(() => {
                                msg.delete().catch(c => console.log(c));
                                msg.channel.send({ embeds: [embAdvertencia], content: `<@${msg.author.id}>` }).then(tw => {
                                    setTimeout(() => {
                                        tw.delete().catch(c => console.log(c));
                                    }, 20000);
                                });
                            }, 800);
                            if (__1.autoModeracion.some(s => s.miembroID == msg.author.id)) {
                                const autoModMember = __1.autoModeracion.find(f => f.miembroID == msg.author.id);
                                if (autoModMember) {
                                    autoModMember.advertencias++;
                                    if (autoModMember.advertencias >= 2) {
                                        const embAdvertenciaMD = new discord_js_1.EmbedBuilder()
                                            .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                                            .setTitle(`🔗 Auto moderación de enlaces`)
                                            .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
                                            .setColor(color.negative);
                                        msg.author.send({ embeds: [embAdvertenciaMD] }).catch(c => console.log(c));
                                    }
                                    if (autoModMember.advertencias == 3) {
                                        (_c = msg.member) === null || _c === void 0 ? void 0 : _c.timeout(4 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                    }
                                    if (autoModMember.advertencias == 4) {
                                        (_d = msg.member) === null || _d === void 0 ? void 0 : _d.timeout(8 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                    }
                                    if (autoModMember.advertencias == 5) {
                                        (_e = msg.member) === null || _e === void 0 ? void 0 : _e.timeout(10 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                    }
                                    if (autoModMember.advertencias == 6) {
                                        (_f = msg.member) === null || _f === void 0 ? void 0 : _f.kick(`Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                                    }
                                    if (autoModMember.advertencias == 7) {
                                        (_g = msg.member) === null || _g === void 0 ? void 0 : _g.ban({ reason: `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.` });
                                    }
                                }
                            }
                            else {
                                __1.autoModeracion.push({ miembroID: msg.author.id, advertencias: 1 });
                            }
                        }
                    });
                }
            }
        }
    }
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = (_5 = args.shift()) === null || _5 === void 0 ? void 0 : _5.toLowerCase();
    if (command == 'ayuda')
        (0, help_1.helpCommand)(msg, client);
    if (['comandos', 'cmds'].some(s => s == command))
        (0, commands_1.commandsCommand)(msg, client, args);
    if ((_6 = msg.member) === null || _6 === void 0 ? void 0 : _6.permissions.has('Administrator')) {
        if (['addreaction', 'addrc'].some(s => s == command))
            (0, addReaction_1.addReactionCommand)(msg, client, args);
        if (command == 'roles')
            (0, roles_1.rolesCommand)(msg, client);
        if (command == 'ticket')
            (0, ticket_1.ticketCommand)(msg);
        if (command == 'informacion')
            (0, information_1.informationCommand)(msg);
    }
    if (db_1.botDB.owners.some(s => s == msg.author.id)) {
        if (['eval', 'ev'].some(s => s == command))
            (0, eval_1.evalCommand)(msg, client, args.join(' '));
    }
});
exports.messageEvent = messageEvent;
