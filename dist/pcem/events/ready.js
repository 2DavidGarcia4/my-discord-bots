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
const ms_1 = __importDefault(require("ms"));
const discord_js_1 = require("discord.js");
const models_1 = require("../models");
const db_1 = require("../db");
const interaction_1 = require("./interaction");
const config_1 = require("../../config");
const utils_1 = require("../utils");
const readyEvent = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!client.user)
        return;
    console.log(`| Estoy listo ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}`);
    const dataBot = yield (0, utils_1.getBotData)(client);
    const servidor = client.guilds.cache.get(db_1.botDB.serverId), readyChannel = client.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.connections) || '');
    const channelSuggestions = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.suggestions) || '828300239488024587');
    const embEncendido = new discord_js_1.EmbedBuilder()
        .setTitle(`${db_1.botDB.emoji.afirmative} Encendido de nuevo.`)
        .setColor(db_1.botDB.color.afirmative)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
    if (!config_1.isDevelopment && (readyChannel === null || readyChannel === void 0 ? void 0 : readyChannel.type) == discord_js_1.ChannelType.GuildText)
        readyChannel.send({ embeds: [embEncendido] });
    // const newModel = new carcelModel({
    //   _id: botDB.serverId,
    //   prisoners: [],
    // })
    // await newModel.save()
    //! Roles principales automaticos
    servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.filter(f => !db_1.botDB.mainRoles.some(s => f.roles.cache.has(s)) && !f.user.bot).map(m => m).forEach((miembro, ps, mapa) => {
        miembro.roles.add(db_1.botDB.mainRoles);
        if (ps + 1 == mapa.length)
            console.log(`Roles principales agregados a ${ps + 1} miembros.`);
    });
    let dataSor = yield models_1.rafflesModel.findById(db_1.botDB.serverId), msgsSorteos = 0;
    if (dataSor && dataSor.raffles.length) {
        for (let s of dataSor.raffles) {
            let canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(s.channelId);
            if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement))
                yield canal.messages.fetch(s.id).then(ts => {
                    msgsSorteos++;
                }).catch(err => {
                    console.log("mensaje de sorteo no encontrado.", err);
                });
        }
        console.log(msgsSorteos == 0 ? "No hay sorteos que cargar." : `Se han cargado ${msgsSorteos} sorteos.`);
    }
    let dataEnc = yield models_1.surveysModel.findById(db_1.botDB.serverId), msgsEncuestas = 0;
    if (dataEnc && dataEnc.surveys.length) {
        for (let e of dataEnc.surveys) {
            let canal = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get(e.channelId);
            if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement)) {
                yield canal.messages.fetch(e.id).then(ts => {
                    msgsEncuestas++;
                }).catch(err => {
                    console.log("mensaje de encuesta no encontrado.", err);
                });
            }
        }
        console.log(msgsEncuestas == 0 ? "No hay encuestas que cargar." : `Se han cargado ${msgsEncuestas} encuestas.`);
    }
    function presencias() {
        var _a, _b, _c;
        const estadosDia = [
            {
                name: db_1.botDB.prefix + "ayuda",
                type: discord_js_1.ActivityType.Listening
            },
            {
                name: "/ayuda",
                type: discord_js_1.ActivityType.Listening
            },
            {
                name: `${client.users.cache.size.toLocaleString()} users.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `moderar con ${(_a = client.users.cache.get('935707268090056734')) === null || _a === void 0 ? void 0 : _a.username}`,
                type: discord_js_1.ActivityType.Playing
            }
        ];
        const estadosNoche = [
            {
                name: `mis sueños.`,
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: `zzz`,
                type: discord_js_1.ActivityType.Playing
            }
        ];
        let tiempo = new Date();
        if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
            (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)]] });
        }
        else {
            (_c = client.user) === null || _c === void 0 ? void 0 : _c.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)]] });
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
        return __awaiter(this, void 0, void 0, function* () {
            const dataBot = yield (0, utils_1.getBotData)(client);
            const dataCrc = yield models_1.carcelModel.findById(db_1.botDB.serverId), tiempoActual = Date.now(), canalRegistro = servidor === null || servidor === void 0 ? void 0 : servidor.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation) || '');
            if (dataCrc && dataCrc.prisoners.length >= 1) {
                for (let d in dataCrc.prisoners) {
                    const miembro = servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.get(dataCrc.prisoners[d].id);
                    const msTime = (0, ms_1.default)(dataCrc.prisoners[d].sentence) || 0;
                    const durante = msTime >= 86400000 ? `**${Math.floor(msTime / 86400000)}** días` : msTime >= 3600000 ? `**${Math.floor(msTime / 3600000)}** horas` : msTime >= 60000 ? `**${Math.floor(msTime / 60000)}** minutos` : `**${Math.floor(msTime / 1000)}** segundos`;
                    const registroSa = new discord_js_1.EmbedBuilder()
                        .setTitle(`${db_1.botDB.emoji.exit} Pricionero liberado`)
                        .setColor(db_1.botDB.color.afirmative)
                        .setTimestamp();
                    if (!miembro) {
                        const user = client.users.cache.get(dataCrc.prisoners[d].id);
                        if (user) {
                            registroSa
                                .setAuthor({ name: user === null || user === void 0 ? void 0 : user.tag, iconURL: user.displayAvatarURL() })
                                .setDescription(`👤 ${user.tag}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisoners[d].reazon}`);
                        }
                        if ((canalRegistro === null || canalRegistro === void 0 ? void 0 : canalRegistro.type) == discord_js_1.ChannelType.GuildText)
                            canalRegistro.send({ embeds: [registroSa] });
                        dataCrc.prisoners.splice(parseInt(d), 1);
                        yield dataCrc.save();
                    }
                    else if (miembro && servidor) {
                        if ((dataCrc.prisoners[d].time + msTime) - tiempoActual <= 0) {
                            const embMDS = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
                                .setTitle(`${db_1.botDB.emoji.afirmative} Has salido de la cárcel`)
                                .setDescription(`⏱ Cumpliste con la condena de ${durante} en la cárcel.`)
                                .setColor(db_1.botDB.color.afirmative)
                                .setFooter({ text: servidor.name, iconURL: servidor.iconURL() || undefined })
                                .setTimestamp();
                            registroSa
                                .setAuthor({ name: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
                                .setDescription(`👤 ${miembro}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisoners[d].reazon}`);
                            miembro.roles.remove('830260549098405935').then(r => {
                                miembro.send({ embeds: [embMDS] }).catch(() => '');
                                if ((canalRegistro === null || canalRegistro === void 0 ? void 0 : canalRegistro.type) == discord_js_1.ChannelType.GuildText)
                                    canalRegistro.send({ embeds: [registroSa] });
                            });
                            dataCrc.prisoners.splice(parseInt(d), 1);
                            yield dataCrc.save();
                        }
                    }
                }
            }
        });
    }
    carcel();
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
    function sorteos() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const dataSor = yield models_1.rafflesModel.findById(db_1.botDB.serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.raffles;
            if (arraySo) {
                for (let s of arraySo) {
                    if (s.active && s.ends < Date.now()) {
                        const channel = client.channels.cache.get(s.channelId);
                        if ((channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildText && (channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildAnnouncement)
                            return;
                        const mensage = (_a = channel === null || channel === void 0 ? void 0 : channel.messages) === null || _a === void 0 ? void 0 : _a.cache.get(s.id);
                        if (mensage) {
                            let miembros = s.participants.filter(f => servidor === null || servidor === void 0 ? void 0 : servidor.members.cache.has(f));
                            let bueltas = 1, ganadoresFinal = [];
                            for (let r = 0; r < bueltas; r++) {
                                let miembroRandom = miembros[Math.floor(Math.random() * miembros.length)];
                                if (s.winners > ganadoresFinal.length) {
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
                                emb.fields[0].value = `*No hubo ganadores ya que nadie participo*\nCreado por: <@${s.authorId}>`;
                                mensage.reply({ content: `Nadie gano el sorteo.` });
                            }
                            else {
                                emb.fields[0].value = `${ganadoresFinal.length == 1 ? `Ganador/a: ${ganadoresFinal.map(m => `<@${m}>`)[0]}` : `Ganadores: ${ganadoresFinal.map(m => `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${s.authorId}>`;
                                mensage.reply({ content: `¡Felicidades ${ganadoresFinal.length == 1 ? `${ganadoresFinal.map(m => `<@${m}>`)[0]} has ganado` : `${ganadoresFinal.map(m => `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!` });
                            }
                            s.active = false;
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
            let dataEnc = yield models_1.surveysModel.findById(db_1.botDB.serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.surveys;
            if (arrayEn) {
                for (const e of arrayEn) {
                    if (e.active && e.ends < Date.now()) {
                        const channel = client.channels.cache.get(e.channelId);
                        if ((channel === null || channel === void 0 ? void 0 : channel.type) != discord_js_1.ChannelType.GuildText)
                            return;
                        const mensage = channel === null || channel === void 0 ? void 0 : channel.messages.cache.get(e.id);
                        if (mensage) {
                            let opcionesOrdenadas = e.options.sort((a, b) => b.votes - a.votes), totalVotos = 0, bueltas = 1, tabla = [];
                            opcionesOrdenadas.map(m => totalVotos += m.votes);
                            for (const o of opcionesOrdenadas) {
                                let porcentaje = (o.votes * 100 / totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = "";
                                for (let i = 0; i < 20; i++) {
                                    if (i < parseInt(porcentaje) / 100 * 20) {
                                        diseño = diseño.concat(carga);
                                    }
                                    else {
                                        diseño = diseño.concat(vacio);
                                    }
                                }
                                tabla.push(`**${bueltas == 1 ? "🥇" : bueltas == 2 ? "🥈" : bueltas == 3 ? "🥉" : `${bueltas}`}.** ${o.emoji} ${o.option} *(${o.votes})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`);
                                bueltas++;
                            }
                            mensage.reactions.cache.forEach(react => react.remove());
                            const embed = mensage.embeds[0];
                            if (embed.data.author)
                                embed.data.author.name = `⏹️ Encuesta finalizada`;
                            embed.fields[0].value = tabla.join("\n\n");
                            embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas[0].option}**\nVotos totales: **${totalVotos}**\nCreada por: <@${e.authorId}>`;
                            mensage.edit({ embeds: [embed], content: '*¡Encuesta finalizada!*' });
                            e.active = false;
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
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        presencias();
        sorteos();
        encuestas();
    }), 60 * 60000);
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        estadisticas();
        carcel();
        vips();
    }), 30 * 60000);
    // console.log(svInteractionCommands.map(m=> m))
    // console.log(interactionCommands.map(m=> m))
    interaction_1.svInteractionCommands === null || interaction_1.svInteractionCommands === void 0 ? void 0 : interaction_1.svInteractionCommands.forEach((command, key) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!((_b = (yield (servidor === null || servidor === void 0 ? void 0 : servidor.commands.fetch()))) === null || _b === void 0 ? void 0 : _b.some(s => s.name == command.struct.name))) {
            servidor === null || servidor === void 0 ? void 0 : servidor.commands.create(command.struct).then((cmd) => {
                console.log(`Comando ${key} creado`);
            }).catch((err) => console.log('Error: ', err));
        }
    }));
    interaction_1.interactionCommands === null || interaction_1.interactionCommands === void 0 ? void 0 : interaction_1.interactionCommands.forEach((command, key) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e;
        if (!((_d = (yield ((_c = client.application) === null || _c === void 0 ? void 0 : _c.commands.fetch()))) === null || _d === void 0 ? void 0 : _d.some(s => s.name == command.struct.name))) {
            (_e = client.application) === null || _e === void 0 ? void 0 : _e.commands.create(command.struct).then((cmd) => {
                console.log(`Comando publico ${key} creado`);
            }).catch((err) => console.log('Error: ', err));
        }
    }));
    // console.log((await servidor?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
    // console.log((await client.application?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
    // const command1 = slashComands.get('clasificaciones')
    // ;(await servidor?.commands.fetch('964578653369409556', {force: true}))?.edit({options: command1?.options}).then(c=> console.log('Comando actualizado'))
    // ;(await servidor?.commands.fetch('941377782930350110', {force: true}))?.delete().then(c=> console.log(`Comando ${c.name} eliminado`))
    //! Public
    // const command = interactionCommands.get('kick')
    // ;(await client.application?.commands.fetch('1075637283841122385', {force: true}))?.edit({options: command?.struct.options}).then(c=> console.log(`Comando publico ${c.name} actualizado`))
    // ;(await client.application?.commands.fetch('1075843451582697513', {force: true}))?.delete().then(c=> console.log(`Comando publico ${c.name} eliminado`))
});
exports.readyEvent = readyEvent;
