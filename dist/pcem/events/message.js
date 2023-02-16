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
exports.messageEvent = exports.textCommands = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const fs_1 = require("fs");
const db_1 = require("../db");
const __1 = require("..");
const utils_1 = require("../utils");
const functions_1 = require("../../shared/functions");
const isDist = __dirname.includes('src') ? 'src' : 'dist';
const svTextCommands = new discord_js_1.Collection();
(0, fs_1.readdirSync)(`./${isDist}/pcem/commands/server/text/`).forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
    const command = require(`../commands/server/text/${file}`);
    const cmdFunction = command[Object.keys(command)[1]];
    const alias = command[Object.keys(command)[2]] || [];
    svTextCommands.set(command.name, { run: cmdFunction, alias });
}));
exports.textCommands = new discord_js_1.Collection();
(0, fs_1.readdirSync)(`./${isDist}/pcem/commands/text/`).forEach((folder) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fs_1.readdirSync)(`./${isDist}/pcem/commands/text/${folder}/`).forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        const command = require(`../commands/text/${folder}/${file}`);
        const cmdFunction = command[Object.keys(command)[1]];
        const alias = command[Object.keys(command)[2]] || [];
        exports.textCommands.set(command.name, { run: cmdFunction, alias });
    }));
}));
const messageEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    const { member } = msg, { prefix, emoji, color, serverId } = db_1.botDB;
    if (msg.guildId == db_1.botDB.serverId) {
        __1.svStatistics.messages++;
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
        if (!((_o = msg.member) === null || _o === void 0 ? void 0 : _o.roles.cache.has('887444598715219999')) && !((_p = msg.member) === null || _p === void 0 ? void 0 : _p.permissions.has('Administrator')) && urlIncludes.some(s => msg.content.includes(s))) {
            const dataBot = yield (0, utils_1.getBotData)(client);
            if (!dataBot)
                return;
            const canalesPerIDs = (_q = msg.guild) === null || _q === void 0 ? void 0 : _q.channels.cache.filter(fc => dataBot.autoModeration.ignoreCategories.includes(fc.parentId || '')).map(mc => mc.id);
            const otrosIDCha = dataBot.autoModeration.ignoreChannels;
            canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.push(...otrosIDCha);
            if (!(canalesPerIDs === null || canalesPerIDs === void 0 ? void 0 : canalesPerIDs.some(s => s == msg.channelId))) {
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
    const commandName = (_u = args.shift()) === null || _u === void 0 ? void 0 : _u.toLowerCase();
    if (commandName) {
        if (msg.guildId == serverId) {
            const svCommand = svTextCommands.get(commandName) || svTextCommands.find(f => f.alias.some(s => s == commandName));
            __1.svStatistics.commands++;
            db_1.botDB.usedCommands++;
            if (svCommand)
                return svCommand.run(msg, client, args);
        }
        else {
            const command = exports.textCommands.get(commandName) || exports.textCommands.find(f => f.alias.some(s => s == commandName));
            __1.svStatistics.commands++;
            db_1.botDB.usedCommands++;
            if (command)
                return command.run(msg, client, args);
        }
    }
});
exports.messageEvent = messageEvent;
