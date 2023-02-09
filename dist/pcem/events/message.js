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
const messageEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const { member } = msg, { prefix, emoji, color } = db_1.botDB;
    if (msg.guildId == db_1.botDB.serverId) {
        __1.estadisticas.mensajes++;
        //TODO: Sistema de tickets
        let dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId), arrayTs = dataTs === null || dataTs === void 0 ? void 0 : dataTs.tickets, servidor2 = client.guilds.cache.get('949860813915705354');
        if (arrayTs) {
            arrayTs.forEach((objeto) => __awaiter(void 0, void 0, void 0, function* () {
                var _1;
                if (objeto.id == msg.channelId) {
                    if (objeto.publico && ((_1 = msg.member) === null || _1 === void 0 ? void 0 : _1.roles.cache.has('887444598715219999')) && msg.channel.type == discord_js_1.ChannelType.GuildText) {
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
        const urlIncludes = ['https://', 'http://', '.com', 'discord.'];
        if (!((_o = msg.member) === null || _o === void 0 ? void 0 : _o.roles.cache.has('887444598715219999')) && !((_p = msg.member) === null || _p === void 0 ? void 0 : _p.permissions.has('Administrator')) && urlIncludes.some(s => msg.content.includes(s))) {
            const dataBot = yield models_1.botModel.findById((_q = client.user) === null || _q === void 0 ? void 0 : _q.id);
            if (!dataBot)
                return;
            const canalesPerIDs = (_r = msg.guild) === null || _r === void 0 ? void 0 : _r.channels.cache.filter(fc => dataBot.autoModeration.ignoreCategories.includes(fc.parentId || '')).map(mc => mc.id);
            const otrosIDCha = dataBot.autoModeration.ignoreChannels;
            canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.push(...otrosIDCha);
            if (!(canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.some(s => s == msg.channelId))) {
                // console.log('no ignorados')
                const enlaces = [["discord.gg/", "discord.com/invite/"], ["youtube.com", "youtu.be"], ["twitch.tv"], ["tiktok.com", "vm.tiktok.com"], ["twitter.com"], ["instagram.com"]];
                const titulos = ["<a:DiscordLogo:973995348974505984> Auto moderación de enlaces de Discord", "<:youtubelogo:855166340780130354> Auto moderación de enlaces de YouTube", "<:TwitchEmblema:855167274193125396> Auto moderación de enlaces de Twitch", "<:Mamadatok:855167926875979837> Auto moderación de enlaces de TikTok", `<:TwitterLogo:855168545566490664> Auto moderación de enlaces de Twitter`, "<:instagram:855169028376494080> Auto moderación de enlaces de Instagram", "🔗 Auto moderación de enlaces"];
                const descripciones = [` de **Discord**, el canal correcto para publicar un enlace de **Discord** es <#823381769750577163> o <#836315643070251008>`, ` de **YouTube**, el canal correcto para publicar un enlace de **YouTube** es <#823961526297165845> o <#836315643070251008>`, ` de **Twitch**, el canal correcto para publicar un enlace de **Twitch** es <#823381980389310464> o <#836315643070251008>`, ` de **TikTok**, el canal correcto para publicar un enlace de **TikTok** es <#827295990360965153> o <#836315643070251008>`, ` de **Twitter**, el canal correcto para publicar un enlace de **Twitter** es <#823381924344758313> o <#836315643070251008>`, ` de **Instagram**, el canal correcto para publicar un enlace de **Instagram** es <#823382007391584276> o <#836315643070251008>`, `, si quiere hacer promoción hágalo en los canales de la categoría **<#785729364288339978>** como <#836315643070251008>.\nSi esta perdido y necesita ayuda mencione a un <@&831669132607881236>.`];
                const colores = ["#5965F1", "#FE0100", "#6441a5", "#030303", "#1CA1F3", "#ED0D6E", color.negative];
                for (let m in enlaces) {
                    if (enlaces[m].some(s => msg.content.includes(s))) {
                        // console.log('sss')
                        const embWarn = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                            .setTitle(titulos[m])
                            .setDescription(`Lo ciento ${msg.author} en este canal no esta permitido publicar enlaces${descripciones[m]}`)
                            .setColor(colores[m])
                            .setFooter({ text: `🛑 Advertencia por ${(_s = client.user) === null || _s === void 0 ? void 0 : _s.tag}`, iconURL: (_t = client.user) === null || _t === void 0 ? void 0 : _t.displayAvatarURL() })
                            .setTimestamp();
                        setTimeout(() => {
                            msg.delete().catch(c => console.log(c));
                            msg.channel.send({ embeds: [embWarn], content: `<@${msg.author.id}>` }).then(tw => {
                                setTimeout(() => {
                                    tw.delete().catch(c => console.log(c));
                                }, 24000);
                            });
                        }, 600);
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
                                (_u = msg.member) === null || _u === void 0 ? void 0 : _u.timeout(4 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                            }
                            if (autoModMember.advertencias == 4) {
                                (_v = msg.member) === null || _v === void 0 ? void 0 : _v.timeout(8 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                            }
                            if (autoModMember.advertencias == 5) {
                                (_w = msg.member) === null || _w === void 0 ? void 0 : _w.timeout(10 * 60 * 60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                            }
                            if (autoModMember.advertencias == 6) {
                                (_x = msg.member) === null || _x === void 0 ? void 0 : _x.kick(`Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.`);
                            }
                            if (autoModMember.advertencias == 7) {
                                (_y = msg.member) === null || _y === void 0 ? void 0 : _y.ban({ reason: `Por auto moderación de enlaces, el miembro ha enviado ${autoModMember.advertencias} enlaces en canales los cuales no esta permitido.` });
                            }
                        }
                        else {
                            __1.autoModeracion.push({ miembroID: msg.author.id, advertencias: 1 });
                        }
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
    const command = (_z = args.shift()) === null || _z === void 0 ? void 0 : _z.toLowerCase();
    if (command == 'ayuda')
        (0, help_1.helpCommand)(msg, client);
    if (['comandos', 'cmds'].some(s => s == command))
        (0, commands_1.commandsCommand)(msg, client, args);
    if ((_0 = msg.member) === null || _0 === void 0 ? void 0 : _0.permissions.has('Administrator')) {
        if (['addreaction', 'addrc'].some(s => s == command))
            (0, addReaction_1.addReactionCommand)(msg, client, args);
        if (command == 'roles')
            (0, roles_1.rolesCommand)(msg);
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
