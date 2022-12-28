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
exports.readyEvent = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const colors_1 = __importDefault(require("colors"));
const models_1 = require("../models");
const db_1 = require("../db");
const interaction_1 = require("./interaction");
const config_1 = require("../../config");
colors_1.default;
const readyEvent = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!client.user)
        return;
    console.log(`Estoy listo ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}`.rainbow.italic);
    const dataBot = yield models_1.botModel.findById(client.user.id);
    const servidor = client.guilds.cache.get(db_1.botDB.serverId), readyChannel = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.connections) || '');
    const channelSuggestions = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.suggestions) || '828300239488024587');
    const embEncendido = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.afirmative} Encendido de nuevo.`)
        .setColor(db_1.botDB.color.afirmative)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
    if (!config_1.isDevelopment && (readyChannel === null || readyChannel === void 0 ? void 0 : readyChannel.type) == discord_js_1.ChannelType.GuildText)
        readyChannel.send({ embeds: [embEncendido] });
    //! Roles principales automaticos
    servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.filter(f => !db_1.botDB.mainRoles.some(s => f.roles.cache.has(s)) && !f.user.bot).map(m => m).forEach((miembro, ps, mapa) => {
        miembro.roles.add(db_1.botDB.mainRoles);
        if (ps + 1 == mapa.length)
            console.log(`Roles principales agregados a ${ps + 1} miembros.`.blue.italic);
    });
    let dataSug = yield models_1.suggestionsModel.findById(db_1.botDB.serverId), mensajesCargados = 0;
    if (dataSug) {
        for (let i in dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes) {
            if ((channelSuggestions === null || channelSuggestions === void 0 ? void 0 : channelSuggestions.type) == discord_js_1.ChannelType.GuildText && (dataSug === null || dataSug === void 0 ? void 0 : dataSug.mensajes[i].id.length) > 2) {
                yield (channelSuggestions === null || channelSuggestions === void 0 ? void 0 : channelSuggestions.messages.fetch(dataSug.mensajes[i].id).then(tc => {
                    mensajesCargados++;
                }).catch(err => {
                    console.log("mensaje del sistema de sugerencias no encontrado.".red, err);
                }));
            }
        }
        console.log(`Se han cargado ${mensajesCargados} mensajes del sistema de sugerencias`.yellow.italic);
    }
    let dataTs = yield models_1.ticketsModel.findById(db_1.botDB.serverId);
    if (dataTs) {
        dataTs.tickets.forEach((objeto) => __awaiter(void 0, void 0, void 0, function* () {
            if (objeto.msgValoracionID != false) {
                const channel = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(objeto.id);
                if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText)
                    yield channel.messages.fetch(objeto.msgValoracionID).then(msgTC => {
                        console.log("Mensaje de valoración cargado.".green);
                    });
            }
        }));
    }
    let dataSor = yield models_1.rafflesModel.findById(db_1.botDB.serverId), msgsSorteos = 0;
    if (dataSor) {
        for (let s of dataSor.sorteos) {
            let canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(s.canalID);
            if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement))
                yield canal.messages.fetch(s.id).then(ts => {
                    msgsSorteos++;
                }).catch(err => {
                    console.log("mensaje de sorteo no encontrado.".red, err);
                });
        }
        console.log(msgsSorteos == 0 ? "No hay sorteos que cargar.".magenta.italic : `Se han cargado ${msgsSorteos} sorteos.`.yellow.italic);
    }
    let dataEnc = yield models_1.surveysModel.findById(db_1.botDB.serverId), msgsEncuestas = 0;
    if (dataEnc) {
        for (let e of dataEnc.encuestas) {
            let canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(e.canalID);
            if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement)) {
                yield canal.messages.fetch(e.id).then(ts => {
                    msgsEncuestas++;
                }).catch(err => {
                    console.log("mensaje de encuesta no encontrado.", err);
                });
            }
        }
        console.log(msgsEncuestas == 0 ? "No hay encuestas que cargar.".magenta.italic : `Se han cargado ${msgsEncuestas} encuestas.`.yellow.italic);
    }
    function presencias() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const estadosDia = [
            {
                name: "p.ayuda",
                type: discord_js_1.ActivityType.Listening
            },
            {
                name: "/ayuda",
                type: discord_js_1.ActivityType.Listening
            },
            {
                name: `${(_a = client.guilds.cache.get(db_1.botDB.serverId)) === null || _a === void 0 ? void 0 : _a.members.cache.filter(mf => !mf.user.bot).size.toLocaleString()} miembros.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `${(_b = client.guilds.cache.get(db_1.botDB.serverId)) === null || _b === void 0 ? void 0 : _b.channels.cache.filter(ct => ct.type === discord_js_1.ChannelType.GuildCategory).size} categorías.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `${(_c = client.guilds.cache.get(db_1.botDB.serverId)) === null || _c === void 0 ? void 0 : _c.members.cache.filter(bf => bf.user.bot).size} Bots.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `${(_d = client.guilds.cache.get(db_1.botDB.serverId)) === null || _d === void 0 ? void 0 : _d.channels.cache.filter(ft => ft.type === discord_js_1.ChannelType.GuildText).size} canales.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `${(_e = client.guilds.cache.get(db_1.botDB.serverId)) === null || _e === void 0 ? void 0 : _e.channels.cache.filter(ft => ft.type === discord_js_1.ChannelType.GuildVoice).size} canales de voz.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `sus promociones`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `moderar con ${(_f = client.users.cache.get('935707268090056734')) === null || _f === void 0 ? void 0 : _f.username}`,
                type: discord_js_1.ActivityType.Playing
            }
        ];
        const estadosNoche = [
            {
                name: `mis sueños, estoy durmiendo.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `a los miembros y durmiendo.`,
                type: discord_js_1.ActivityType.Listening
            }
        ];
        let tiempo = new Date();
        if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
            (_g = client.user) === null || _g === void 0 ? void 0 : _g.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)]] });
        }
        else {
            (_h = client.user) === null || _h === void 0 ? void 0 : _h.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)]] });
        }
    }
    presencias();
    function estadisticas() {
        const server = client.guilds.cache.get(db_1.botDB.serverId), todosG = server === null || server === void 0 ? void 0 : server.memberCount, online = server === null || server === void 0 ? void 0 : server.members.cache.filter(f => { var _a, _b, _c; return ((_a = f.presence) === null || _a === void 0 ? void 0 : _a.status) == 'dnd' || ((_b = f.presence) === null || _b === void 0 ? void 0 : _b.status) == 'idle' || ((_c = f.presence) === null || _c === void 0 ? void 0 : _c.status) == 'online'; }).size, cantBots = server === null || server === void 0 ? void 0 : server.members.cache.filter(fb => fb.user.bot).size;
        const canalTodos = client.channels.cache.get('823349420106973204');
        const canalMiembros = client.channels.cache.get('823349423349301318');
        const canalBots = client.channels.cache.get('823349426264997919');
        if ((canalTodos === null || canalTodos === void 0 ? void 0 : canalTodos.type) != discord_js_1.ChannelType.GuildVoice)
            return;
        if ((canalMiembros === null || canalMiembros === void 0 ? void 0 : canalMiembros.type) != discord_js_1.ChannelType.GuildVoice)
            return;
        if ((canalBots === null || canalBots === void 0 ? void 0 : canalBots.type) != discord_js_1.ChannelType.GuildVoice)
            return;
        if (canalTodos.name != `『👥』Todos: ${todosG === null || todosG === void 0 ? void 0 : todosG.toLocaleString()}`) {
            canalTodos.edit({ name: `『👥』Todos: ${todosG === null || todosG === void 0 ? void 0 : todosG.toLocaleString()}` });
        }
        if (canalMiembros.name != `『🟢』En linea: ${online === null || online === void 0 ? void 0 : online.toLocaleString()}`) {
            canalMiembros.edit({ name: `『🟢』En linea: ${online === null || online === void 0 ? void 0 : online.toLocaleString()}` });
        }
        if (canalBots.name != `『🤖』Bots: ${cantBots === null || cantBots === void 0 ? void 0 : cantBots.toLocaleString()}`) {
            canalBots.edit({ name: `『🤖』Bots: ${cantBots === null || cantBots === void 0 ? void 0 : cantBots.toLocaleString()}` });
        }
    }
    estadisticas();
    function carcel() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id);
            const dataCrc = yield models_1.carcelModel.findById((_b = client.user) === null || _b === void 0 ? void 0 : _b.id), tiempoActual = Date.now(), canalRegistro = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
            if (dataCrc && dataCrc.prisioneros.length >= 1) {
                for (let d in dataCrc.prisioneros) {
                    const miembro = servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.get(dataCrc.prisioneros[d].id);
                    const msTime = (0, ms_1.default)(dataCrc.prisioneros[d].condena) || 0;
                    const durante = msTime >= 86400000 ? `**${Math.floor(msTime / 86400000)}** días` : msTime >= 3600000 ? `**${Math.floor(msTime / 3600000)}** horas` : msTime >= 60000 ? `**${Math.floor(msTime / 60000)}** minutos` : `**${Math.floor(msTime / 1000)}** segundos`;
                    const registroSa = new discord_js_1.EmbedBuilder()
                        .setTitle(`${db_1.botDB.emoji.exit} Pricionero liberado`)
                        .setColor(db_1.botDB.color.afirmative)
                        .setTimestamp();
                    if (!miembro) {
                        const user = client.users.cache.get(dataCrc.prisioneros[d].id);
                        if (user) {
                            registroSa
                                .setAuthor({ name: user === null || user === void 0 ? void 0 : user.tag, iconURL: user.displayAvatarURL() })
                                .setDescription(`👤 ${user.tag}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisioneros[d].razon}`);
                        }
                        if ((canalRegistro === null || canalRegistro === void 0 ? void 0 : canalRegistro.type) == discord_js_1.ChannelType.GuildText)
                            canalRegistro.send({ embeds: [registroSa] });
                        dataCrc.prisioneros.splice(parseInt(d), 1);
                        yield dataCrc.save();
                    }
                    else if (miembro && servidor) {
                        if ((dataCrc.prisioneros[d].tiempo + msTime) - tiempoActual <= 0) {
                            const embMDS = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
                                .setTitle(`${db_1.botDB.emoji.afirmative} Has salido de la cárcel`)
                                .setDescription(`⏱ Cumpliste con la condena de ${durante} en la cárcel.`)
                                .setColor(db_1.botDB.color.afirmative)
                                .setFooter({ text: servidor.name, iconURL: servidor.iconURL() || undefined })
                                .setTimestamp();
                            registroSa
                                .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
                                .setDescription(`👤 ${miembro}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisioneros[d].razon}`);
                            miembro.roles.remove('830260549098405935').then(r => {
                                miembro.send({ embeds: [embMDS] }).catch(() => '');
                                if ((canalRegistro === null || canalRegistro === void 0 ? void 0 : canalRegistro.type) == discord_js_1.ChannelType.GuildText)
                                    canalRegistro.send({ embeds: [registroSa] });
                            });
                            dataCrc.prisioneros.splice(parseInt(d), 1);
                            yield dataCrc.save();
                        }
                    }
                }
            }
        });
    }
    carcel();
    function colaboradores() {
        return __awaiter(this, void 0, void 0, function* () {
            let dataCol = yield models_1.collaboratorsModel.findById(db_1.botDB.serverId), arrayCo = dataCol === null || dataCol === void 0 ? void 0 : dataCol.colaboradores;
            arrayCo === null || arrayCo === void 0 ? void 0 : arrayCo.filter(f => f.colaborador).forEach((col, ps) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                let canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(col.canalID), colaborador = client.users.cache.get(col.id);
                if (!canal || !colaborador)
                    return;
                if (canal.type != discord_js_1.ChannelType.GuildText)
                    return;
                if (!(colaborador === null || colaborador === void 0 ? void 0 : colaborador.dmChannel)) {
                    colaborador === null || colaborador === void 0 ? void 0 : colaborador.createDM();
                }
                const embNotificaccion = new discord_js_1.EmbedBuilder()
                    .setTitle(`🔔 Notificación`)
                    .setDescription(`${colaborador} ya puedes utilizar @everyone o @here en tu canal ${canal}.`)
                    .setColor(((_a = servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.get(col.id)) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'Random')
                    .setFooter({ text: `¡Gracias por ser colaborador del servidor.!`, iconURL: (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL() });
                const boton = new discord_js_1.ActionRowBuilder()
                    .addComponents([
                    new discord_js_1.ButtonBuilder()
                        .setCustomId("eliminarMsgMD")
                        .setEmoji(db_1.botDB.emoji.negative)
                        .setLabel("Eliminar mensaje")
                        .setStyle(discord_js_1.ButtonStyle.Danger)
                ]);
                if (col.tiempo == false) {
                    if (!col.notificado) {
                        colaborador === null || colaborador === void 0 ? void 0 : colaborador.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c);
                        col.notificado = true;
                    }
                    if (canal && canal.type == discord_js_1.ChannelType.GuildText && !((_c = canal.permissionsFor(col.id)) === null || _c === void 0 ? void 0 : _c.has('MentionEveryone'))) {
                        canal.permissionOverwrites.edit(col.id, { 'MentionEveryone': true, });
                    }
                }
                else {
                    if (col.tiempo <= Date.now()) {
                        if (!col.notificado) {
                            colaborador === null || colaborador === void 0 ? void 0 : colaborador.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c);
                            col.notificado = true;
                            col.tiempo = false;
                        }
                        else {
                            col.tiempo = false;
                        }
                        if (!((_d = canal.permissionsFor(col.id)) === null || _d === void 0 ? void 0 : _d.has("MentionEveryone"))) {
                            canal.permissionOverwrites.edit(col.id, { "MentionEveryone": true, });
                        }
                    }
                    else {
                        if ((_e = canal.permissionsFor(col.id)) === null || _e === void 0 ? void 0 : _e.has("MentionEveryone")) {
                            canal.permissionOverwrites.edit(col.id, { "MentionEveryone": false, });
                        }
                    }
                }
            }));
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield models_1.collaboratorsModel.findByIdAndUpdate(db_1.botDB.serverId, { colaboradores: arrayCo });
            }), 2000);
        });
    }
    colaboradores();
    function vips() {
        var _a, _b;
        let tiempo = new Date(), canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get("826193847943037018");
        if (!canal)
            return;
        if (canal.type != discord_js_1.ChannelType.GuildText)
            return;
        if (!((_a = canal.permissionsFor("826197551904325712")) === null || _a === void 0 ? void 0 : _a.has('MentionEveryone')) && [2, 5].some(s => s == tiempo.getDay())) {
            canal.permissionOverwrites.edit("826197551904325712", { "MentionEveryone": true, });
        }
        else {
            if (((_b = canal.permissionsFor("826197551904325712")) === null || _b === void 0 ? void 0 : _b.has("MentionEveryone")) && ![2, 5].some(s => s == tiempo.getDay())) {
                canal.permissionOverwrites.edit("826197551904325712", { "MentionEveryone": false, });
            }
            servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.filter(f => !f.user.bot && f.roles.cache.has("826197551904325712")).forEach((miembro) => {
                var _a;
                if (!miembro.permissions.has('Administrator') && !((_a = canal === null || canal === void 0 ? void 0 : canal.permissionsFor(miembro.id)) === null || _a === void 0 ? void 0 : _a.has("MentionEveryone")) && (canal === null || canal === void 0 ? void 0 : canal.type) == discord_js_1.ChannelType.GuildText) {
                    canal === null || canal === void 0 ? void 0 : canal.permissionOverwrites.delete(miembro.id);
                }
            });
        }
    }
    vips();
    function invitaciones() {
        return __awaiter(this, void 0, void 0, function* () {
            let dataInv = yield models_1.invitesModel.findById(db_1.botDB.serverId), arrayMi = dataInv === null || dataInv === void 0 ? void 0 : dataInv.miembros;
            if (!arrayMi)
                return;
            for (const mm of arrayMi) {
                for (const u of mm.invitados) {
                    yield client.users.fetch(u.id, { force: true }).catch(ci => {
                        mm.restantes != 0 ? mm.restantes-- : "";
                        mm.falsas++;
                        mm.invitados.splice(mm.invitados.findIndex(f => f.id == u.id), 1);
                    }).then(c => c);
                }
            }
            for (const m of arrayMi) {
                yield client.users.fetch(m.id, { force: true }).then((usuario) => __awaiter(this, void 0, void 0, function* () {
                    if (!(servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.some(s => s.id == usuario.id))) {
                        if (m.tiempo != undefined && m.tiempo <= Date.now()) {
                            arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.splice(arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.findIndex(f => f.id == m.id), 1);
                        }
                        else {
                            m.tiempo = Math.floor(Date.now() + (0, ms_1.default)("30d"));
                        }
                    }
                })).catch(cus => {
                    arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.splice(arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.findIndex(f => f.id == m.id), 1);
                });
            }
            yield (servidor === null || servidor === void 0 ? void 0 : servidor.invites.fetch().then((invites) => __awaiter(this, void 0, void 0, function* () {
                for (const invi of invites.map(i => i)) {
                    if (arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.some(s => s.id == invi.inviterId)) {
                        let miembro = arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.find(f => f.id == invi.inviterId);
                        if (miembro === null || miembro === void 0 ? void 0 : miembro.codes.some(s => s.code == invi.code)) {
                            let code = miembro === null || miembro === void 0 ? void 0 : miembro.codes.find(f => f.code == invi.code);
                            if (code && code.usos != invi.uses) {
                                code.usos = invi.uses || 0;
                            }
                        }
                        else {
                            miembro === null || miembro === void 0 ? void 0 : miembro.codes.push({ code: invi.code, usos: invi.uses || 0 });
                        }
                    }
                    else if (invi.inviterId) {
                        yield client.users.fetch(invi.inviterId, { force: true }).then(usuario => {
                            var _a;
                            if (servidor.members.cache.some(s => s.id == invi.inviterId)) {
                                arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.push({ id: invi.inviterId || 'undefinde', tag: ((_a = invi.inviter) === null || _a === void 0 ? void 0 : _a.tag) || 'undefinde', verdaderas: 0, totales: 0, restantes: 0, falsas: 0, tiempo: null, codes: [{ code: invi.code, usos: invi.uses || 0 }], invitados: [] });
                            }
                        }).catch(c => c);
                    }
                }
                let tiempoFor2 = Date.now();
                if (arrayMi) {
                    for (const mi of arrayMi) {
                        let tiempoForAdentro = Date.now();
                        let codigos = mi.codes.filter(f => !invites.some(s => s.code == f.code));
                        for (const c of codigos)
                            mi.codes.splice(mi.codes.findIndex(f => f.code == c.code), 1);
                    }
                }
            })).catch(c => c));
            yield models_1.invitesModel.findByIdAndUpdate(db_1.botDB.serverId, { miembros: arrayMi });
        });
    }
    invitaciones();
    function sorteos() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const dataSor = yield models_1.rafflesModel.findById(db_1.botDB.serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.sorteos;
            if (arraySo) {
                for (let s of arraySo) {
                    if (s.activo && s.finaliza < Date.now()) {
                        const channel = client.channels.cache.get(s.canalID);
                        if ((channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildText && (channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildAnnouncement)
                            return;
                        const mensage = (_a = channel === null || channel === void 0 ? void 0 : channel.messages) === null || _a === void 0 ? void 0 : _a.cache.get(s.id);
                        if (mensage) {
                            let miembros = s.participantes.filter(f => servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.has(f));
                            let bueltas = 1, ganadoresFinal = [];
                            for (let r = 0; r < bueltas; r++) {
                                let miembroRandom = miembros[Math.floor(Math.random() * miembros.length)];
                                if (s.ganadores > ganadoresFinal.length) {
                                    if (!ganadoresFinal.some(s => s == miembroRandom)) {
                                        ganadoresFinal.push(miembros[Math.floor(Math.random() * miembros.length)]);
                                    }
                                    bueltas++;
                                }
                            }
                            const emb = mensage.embeds[0];
                            if ((_b = emb.data.author) === null || _b === void 0 ? void 0 : _b.name)
                                emb.data.author.name = "⏹️ Sorteo finalizado";
                            if (ganadoresFinal.length == 0) {
                                emb.fields[0].value = `*No hubo ganadores ya que nadie participo*\nCreado por: <@${s.autorID}>`;
                                mensage.reply({ content: `Nadie gano el sorteo.` });
                            }
                            else {
                                emb.fields[0].value = `${ganadoresFinal.length == 1 ? `Ganador/a: ${ganadoresFinal.map(m => `<@${m}>`)[0]}` : `Ganadores: ${ganadoresFinal.map(m => `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${s.autorID}>`;
                                mensage.reply({ content: `¡Felicidades ${ganadoresFinal.length == 1 ? `${ganadoresFinal.map(m => `<@${m}>`)[0]} has ganado` : `${ganadoresFinal.map(m => `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!` });
                            }
                            s.activo = false;
                            mensage.edit({ embeds: [emb], content: `*¡Sorteo finalizado!*` });
                            yield models_1.rafflesModel.findByIdAndUpdate(db_1.botDB.serverId, { sorteos: arraySo });
                        }
                    }
                }
            }
        });
    }
    sorteos();
    function encuestas() {
        return __awaiter(this, void 0, void 0, function* () {
            let dataEnc = yield models_1.surveysModel.findById(db_1.botDB.serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.encuestas;
            if (arrayEn) {
                for (const e of arrayEn) {
                    if (e.activa && e.finaliza < Date.now()) {
                        const channel = client.channels.cache.get(e.canalID);
                        if ((channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildText)
                            return;
                        const mensage = channel === null || channel === void 0 ? void 0 : channel.messages.cache.get(e.id);
                        if (mensage) {
                            let opcionesOrdenadas = e.opciones.sort((a, b) => b.votos - a.votos), totalVotos = 0, bueltas = 1, tabla = [];
                            opcionesOrdenadas.map(m => totalVotos += m.votos);
                            for (const o of opcionesOrdenadas) {
                                let porcentaje = (o.votos * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = "";
                                for (let i = 0; i < 20; i++) {
                                    if (i < parseInt(porcentaje) / 100 * 20) {
                                        diseño = diseño.concat(carga);
                                    }
                                    else {
                                        diseño = diseño.concat(vacio);
                                    }
                                }
                                tabla.push(`**${bueltas == 1 ? "🥇" : bueltas == 2 ? "🥈" : bueltas == 3 ? "🥉" : `${bueltas}`}.** ${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`);
                                bueltas++;
                            }
                            mensage.reactions.cache.forEach(react => react.remove());
                            const embed = mensage.embeds[0];
                            if (embed.data.author)
                                embed.data.author.name = `⏹️ Encuesta finalizada`;
                            embed.fields[0].value = tabla.join("\n\n");
                            embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas[0].opcion}**\nVotos totales: **${totalVotos}**\nCreada por: <@${e.autorID}>`;
                            mensage.edit({ embeds: [embed], content: '*¡Encuesta finalizada!*' });
                            e.activa = false;
                            yield models_1.surveysModel.findByIdAndUpdate(db_1.botDB.serverId, { encuestas: arrayEn });
                        }
                    }
                }
            }
        });
    }
    encuestas();
    function mensajesTemporales() {
        const canales = ["826205120173310032", "823639152922460170", "828300239488024587"];
        canales.forEach(m => {
            const channel = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(m);
            if (channel && channel.type == discord_js_1.ChannelType.GuildText) {
                channel === null || channel === void 0 ? void 0 : channel.send(`***${db_1.botDB.emoji.cat} ¡Hola!***`).then(tms => setTimeout(() => { tms.delete(); }, 2000));
            }
        });
    }
    // mensajesTemporales()
    function promoNvl() {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPrl = yield models_1.promoLevelModel.findById(db_1.botDB.serverId), arrayPl = dataPrl === null || dataPrl === void 0 ? void 0 : dataPrl.miembros, canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get((dataPrl === null || dataPrl === void 0 ? void 0 : dataPrl.datos.canalID) || '');
            if (arrayPl && (canal === null || canal === void 0 ? void 0 : canal.type) == discord_js_1.ChannelType.GuildText) {
                arrayPl.filter(f => servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.has(f.id)).forEach((miembro) => {
                    var _a, _b, _c, _d, _e;
                    const usuario = client.users.cache.get(miembro.id);
                    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.dmChannel))
                        usuario === null || usuario === void 0 ? void 0 : usuario.createDM();
                    const embNotificaccion = new discord_js_1.EmbedBuilder()
                        .setTitle(`🔔 Notificación`)
                        .setDescription(`${usuario} ya puedes publicar contenido en ${canal}.`)
                        .setColor(((_a = servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.get(miembro.id)) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'Random')
                        .setFooter({ text: `Si no quieres ser notificado bloquéame`, iconURL: (_b = client.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL() });
                    const boton = new discord_js_1.ActionRowBuilder()
                        .addComponents([
                        new discord_js_1.ButtonBuilder()
                            .setCustomId("eliminarMsgMD")
                            .setEmoji(db_1.botDB.emoji.negative)
                            .setLabel("Eliminar mensaje")
                            .setStyle(discord_js_1.ButtonStyle.Danger)
                    ]);
                    if (!miembro.tiempo) {
                        if (!miembro.notificado) {
                            miembro.notificado = true;
                            usuario === null || usuario === void 0 ? void 0 : usuario.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c);
                        }
                        if ((usuario === null || usuario === void 0 ? void 0 : usuario.id) && !((_c = canal === null || canal === void 0 ? void 0 : canal.permissionsFor(usuario === null || usuario === void 0 ? void 0 : usuario.id)) === null || _c === void 0 ? void 0 : _c.has('SendMessages')) && (canal === null || canal === void 0 ? void 0 : canal.type) == discord_js_1.ChannelType.GuildText) {
                            canal === null || canal === void 0 ? void 0 : canal.permissionOverwrites.edit(usuario === null || usuario === void 0 ? void 0 : usuario.id, { "SendMessages": true, });
                        }
                    }
                    else if ((canal === null || canal === void 0 ? void 0 : canal.type) == discord_js_1.ChannelType.GuildText && (usuario === null || usuario === void 0 ? void 0 : usuario.id)) {
                        if (miembro.tiempo <= Date.now()) {
                            if (!miembro.notificado) {
                                miembro.notificado = true;
                                usuario === null || usuario === void 0 ? void 0 : usuario.send({ embeds: [embNotificaccion], components: [boton] }).catch(c => c);
                            }
                            miembro.tiempo = null;
                            if (!((_d = canal === null || canal === void 0 ? void 0 : canal.permissionsFor(miembro.id)) === null || _d === void 0 ? void 0 : _d.has("SendMessages"))) {
                                canal.permissionOverwrites.edit(usuario.id, { "SendMessages": true, });
                            }
                        }
                        else {
                            if ((_e = canal.permissionsFor(miembro.id)) === null || _e === void 0 ? void 0 : _e.has("SendMessages")) {
                                canal.permissionOverwrites.edit(usuario.id, { "SendMessages": false, });
                            }
                        }
                    }
                });
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield models_1.promoLevelModel.findByIdAndUpdate(db_1.botDB.serverId, { miembros: arrayPl });
            }), 6000);
        });
    }
    promoNvl();
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        presencias();
        colaboradores();
        sorteos();
        encuestas();
    }), 60 * 60000);
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        estadisticas();
        carcel();
        vips();
        promoNvl();
    }), 30 * 60000);
    interaction_1.slashComands === null || interaction_1.slashComands === void 0 ? void 0 : interaction_1.slashComands.forEach((command, position) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!((_b = (yield (servidor === null || servidor === void 0 ? void 0 : servidor.commands.fetch()))) === null || _b === void 0 ? void 0 : _b.some(s => s.name == command.name))) {
            servidor === null || servidor === void 0 ? void 0 : servidor.commands.create(command).then((cmd) => {
                console.log(`Comando ${cmd.name} creado | posicion: ${position}`.cyan.italic);
            }).catch((err) => console.log('Error: ', err));
        }
    }));
    // console.log((await servidor?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
    // const command = slashComands.get('encarcelar')
    // ;(await servidor?.commands.fetch('972168438321651752', {force: true}))?.edit({defaultMemberPermissions: 'ManageMessages'}).then(c=> console.log('Comando actualizado'))
    // ;(await servidor?.commands.fetch('961732766112841768', {force: true}))?.delete().then(c=> console.log('Comando eliminado'))
});
exports.readyEvent = readyEvent;
