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
exports.crearSlashCommand = exports.crearScb = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.crearScb = new discord_js_1.SlashCommandBuilder()
    .setName("crear")
    .setDescription(`¡Crea!`)
    .addSubcommand(alianza => alianza.setName(`alianza`)
    .setDescription(`🤝 !Crea una alianza¡.`)
    .addBooleanOption(ping => ping.setName("notificación").setDescription(`🔔 Notifica a los miembros que tienen el rol de alianza.`).setRequired(true))
    .addUserOption(us => us.setName("aliado").setDescription("🧑 Proporciona el aliado (el miembro con el que has creado la alianza).").setRequired(false)))
    .addSubcommand(colaborador => colaborador.setName(`colaborador`)
    .setDescription(`💎 Crea un canal para el colaborador y le agrega el rol.`)
    .addUserOption(usuario => usuario.setName(`colaborador`).setDescription(`🧑 El nuevo colaborador.`).setRequired(true))
    .addStringOption(nombre => nombre.setName(`nombre`).setDescription(`🔖 Nombre del canal para el colaborador.`).setRequired(true)))
    .addSubcommand(encuesta => encuesta.setName(`encuesta`)
    .setDescription(`📊 Crea una encuesta.`)
    .addStringOption(titulo => titulo.setName(`titulo`)
    .setDescription(`🔖 El titulo del embed de la encuesta.`)
    .setRequired(true))
    .addStringOption(tiempo => tiempo.setName(`tiempo`)
    .setDescription(`⏱️ El tiempo que durara la encuesta.`)
    .setRequired(true))
    .addStringOption(descripcion => descripcion.setName(`descripción`)
    .setDescription(`📄 Descripción del embed de la encuesta.`)
    .setRequired(false))
    .addChannelOption(canal => canal.setName(`canal`)
    .setDescription(`📚 Canal en el cual se enviara la encuesta.`)
    .setRequired(false))
    .addStringOption(opcion1 => opcion1.setName(`opción1`).setDescription(`1️⃣ Agrega la opción 1.`).setRequired(false))
    .addStringOption(opcion2 => opcion2.setName(`opción2`).setDescription(`2️⃣ Agrega la opción 2.`).setRequired(false))
    .addStringOption(opcion3 => opcion3.setName(`opción3`).setDescription(`3️⃣ Agrega la opción 3.`).setRequired(false))
    .addStringOption(opcion4 => opcion4.setName(`opción4`).setDescription(`4️⃣ Agrega la opción 4.`).setRequired(false))
    .addStringOption(opcion5 => opcion5.setName(`opción5`).setDescription(`5️⃣ Agrega la opción 5.`).setRequired(false))
    .addStringOption(opcion6 => opcion6.setName(`opción6`).setDescription(`6️⃣ Agrega la opción 6.`).setRequired(false)))
    .addSubcommand(sorteo => sorteo.setName(`sorteo`)
    .setDescription(`🎉 Crea un sorteo.`)
    .addStringOption(titulo => titulo.setName(`titulo`)
    .setDescription(`🔖 El titulo del embed del sorteo.`)
    .setRequired(true))
    .addStringOption(tiempo => tiempo.setName(`tiempo`)
    .setDescription(`⏱️ El tiempo que durara el sorteo activo.`)
    .setRequired(true))
    .addIntegerOption(ganadores => ganadores.setName(`ganadores`)
    .setDescription(`👥 Cantidad de ganadores del sorteo.`)
    .setRequired(true))
    .addStringOption(descripcion => descripcion.setName(`descripción`)
    .setDescription(`📄 Descripción del embed del sorteo.`)
    .setRequired(false))
    .addChannelOption(canal => canal.setName(`canal`)
    .setDescription(`📚 Canal en el cual se enviara el sorteo.`)
    .setRequired(false))).toJSON();
const crearSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { options, guild, user } = int, subCommand = options.getSubcommand(true), { serverId, emoji, color } = db_1.botDB, author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const dataBot = yield models_1.botModel.findById(((_a = client.user) === null || _a === void 0 ? void 0 : _a.id) || '');
    // const {} = PermissionFlagsBits
    if (subCommand == "alianza") {
        __1.estadisticas.comandos++;
        const dataAli = yield models_1.alliancesModel.findById(serverId), arrayMi = dataAli === null || dataAli === void 0 ? void 0 : dataAli.miembros, arraySv = dataAli === null || dataAli === void 0 ? void 0 : dataAli.servidores;
        const channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get('826863938057797633'), channelLog = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.alliances) || '941880387020419083');
        const notificacion = int.options.getBoolean("notificación", true), aliado = int.options.getUser("aliado");
        let enviado = false;
        if ((guild === null || guild === void 0 ? void 0 : guild.ownerId) != int.user.id && !(author === null || author === void 0 ? void 0 : author.permissions.has('Administrator')) && !(author === null || author === void 0 ? void 0 : author.roles.cache.has('887444598715219999')))
            return (0, functions_1.setSlashError)(int, 'No eres miembro de soporte del servidor, por lo tanto no puedes utilizar el comando.');
        const embAdvertencia = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.warning} Advertencia`)
            .setDescription(`Tienes **30** segundos para proporcionar la plantilla.`)
            .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
        int.reply({ embeds: [embAdvertencia], ephemeral: true });
        setTimeout(() => {
            if (!enviado) {
                const embTiempoAgotado = new discord_js_1.EmbedBuilder()
                    .setTitle(`${emoji.warning} Tiempo agotado`)
                    .setDescription(`Se te ha terminado el tiempo para enviar la plantilla.`)
                    .setColor('Yellow');
                int.editReply({ embeds: [embTiempoAgotado] }).catch(c => console.log(c));
            }
        }, 30000);
        const colector = (_c = int.channel) === null || _c === void 0 ? void 0 : _c.createMessageCollector({ filter: u => u.author.id == int.user.id, time: 30000, max: 1 });
        colector === null || colector === void 0 ? void 0 : colector.on("collect", (m) => __awaiter(void 0, void 0, void 0, function* () {
            function alianzaSystem(des1, des2, des3, contenido) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function* () {
                    const embPlantilla = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
                        .setDescription(des1)
                        .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get("840704364158910475")) === null || _a === void 0 ? void 0 : _a.hexColor) || 'White');
                    if ((channel === null || channel === void 0 ? void 0 : channel.type) == discord_js_1.ChannelType.GuildText)
                        channel.send({ content: contenido }).then(mc => {
                            var _a, _b;
                            const embEnviada = new discord_js_1.EmbedBuilder()
                                .setTitle(`${emoji.afirmative} Alianza creada`)
                                .setDescription(des2)
                                .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.displayHexColor) || 'White')
                                .setTimestamp();
                            mc.reply({ embeds: [embPlantilla] });
                            enviado = true;
                            int.editReply({ embeds: [embEnviada] });
                            if (aliado)
                                (_b = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(aliado.id)) === null || _b === void 0 ? void 0 : _b.roles.add("895394175481159680");
                        });
                    const embRegistro = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
                        .setTitle(`${emoji.afirmative} Alianza creada`)
                        .setDescription(des3)
                        .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get("840704364158910475")) === null || _b === void 0 ? void 0 : _b.hexColor) || 'White')
                        .setTimestamp();
                    if (aliado)
                        embRegistro.setFooter({ text: aliado.tag, iconURL: aliado.displayAvatarURL() });
                    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
                        channelLog.send({ embeds: [embRegistro] });
                    if (arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.some(s => s.id == int.user.id)) {
                        let miembro = arrayMi.find(f => f.id == int.user.id);
                        if (miembro) {
                            miembro.cantidad++;
                            miembro.tag = int.user.tag;
                        }
                    }
                    else {
                        arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.push({ tag: int.user.tag, id: int.user.id, cantidad: 1 });
                    }
                    yield models_1.alliancesModel.findByIdAndUpdate(serverId, { miembros: arrayMi });
                });
            }
            if (m) {
                let plantilla = m.content.replace(/@/g, "");
                setTimeout(() => {
                    m.delete().catch(c => c);
                }, 400);
                if (!["discord.gg/", "discord.com/invite/"].some(s => plantilla.includes(s)))
                    return (0, functions_1.setSlashError)(int, `La plantilla que has proporcionado no es una plantilla de un servidor ya que no contienen ningún enlace de invitación a un servidor de Discord.`);
                client.fetchInvite(plantilla.split(/ +/g).find(f => ["discord.com/invite/", "discord.gg/"].some(s => f.includes(s))) || '').then((invite) => __awaiter(void 0, void 0, void 0, function* () {
                    var _h, _j, _k;
                    if (arraySv === null || arraySv === void 0 ? void 0 : arraySv.some(s => { var _a; return s.id == ((_a = invite.guild) === null || _a === void 0 ? void 0 : _a.id); })) {
                        let servidor = arraySv === null || arraySv === void 0 ? void 0 : arraySv.find(f => { var _a; return f.id == ((_a = invite.guild) === null || _a === void 0 ? void 0 : _a.id); });
                        if (servidor) {
                            if (servidor.tiempo >= Math.floor(Date.now() - (0, ms_1.default)("7d")))
                                return int.editReply({ embeds: [
                                        (0, functions_1.createEmbedMessage)(`${emoji.negative} Error`, `Ya se ha echo alianza con ese servidor y esa alianza se ha echo **<t:${Math.floor(((servidor === null || servidor === void 0 ? void 0 : servidor.tiempo) || 0) / 1000)}:R>** así que no se puede renovar por ahora.`, color.negative)
                                    ] });
                            servidor.nombre = ((_h = invite.guild) === null || _h === void 0 ? void 0 : _h.name) || '';
                            servidor.tiempo = Date.now();
                            servidor.invitacion = invite.url;
                            servidor.miembros = invite.memberCount;
                        }
                    }
                    else {
                        arraySv === null || arraySv === void 0 ? void 0 : arraySv.push({ nombre: ((_j = invite.guild) === null || _j === void 0 ? void 0 : _j.name) || '', id: ((_k = invite.guild) === null || _k === void 0 ? void 0 : _k.id) || '', tiempo: Date.now(), invitacion: invite.url, miembros: invite.memberCount });
                    }
                    yield models_1.alliancesModel.findByIdAndUpdate(serverId, { servidores: arraySv });
                    if (aliado) {
                        if ((0, functions_1.setSlashErrors)(int, [
                            [
                                Boolean(aliado.bot),
                                `Un bot no puede ser un aliado.`
                            ],
                            [
                                Boolean(aliado.id == int.user.id),
                                `Tu mismo no puedes elegirte como aliado, si quieres hacer una alianza con el servidor deja que otro miembro publique la plantilla te añada como aliado.`
                            ]
                        ]))
                            return;
                        if (notificacion) {
                            alianzaSystem(`*Alianza creada por ${int.user} y por el aliado <@${aliado.id}>*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel === null || channel === void 0 ? void 0 : channel.id}>, gracias por la alianza de ${aliado}.`, `Alianza creada por ${int.user}, gracias al aliado ${aliado}, se ha utilizado el ping <@&840704364158910475>.`, `${plantilla}\n<@&840704364158910475>`);
                        }
                        else {
                            alianzaSystem(`*Alianza creada por ${int.user} y por el aliado <@${aliado.id}>*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel === null || channel === void 0 ? void 0 : channel.id}>, gracias por la alianza de ${aliado}.`, `Alianza creada por ${int.user}, gracias al aliado ${aliado}, *no se ha utilizado ping*.`, plantilla);
                        }
                    }
                    else {
                        if (notificacion) {
                            alianzaSystem(`*Alianza creada por ${int.user}*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel === null || channel === void 0 ? void 0 : channel.id}>, gracias por la alianza.`, `Alianza creada por ${int.user} que ha utilizado el ping <@&840704364158910475>.`, `${plantilla}\n<@&840704364158910475>`);
                        }
                        else {
                            alianzaSystem(`*Alianza creada por ${int.user}*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel === null || channel === void 0 ? void 0 : channel.id}>, gracias por la alianza.`, `Alianza creada por ${int.user}, *no se ha utilizado ping*.`, plantilla);
                        }
                    }
                })).catch(error => {
                    (0, functions_1.setSlashError)(int, `Lo ciento no he podido obtener información de la invitación de la plantilla, puede ser que la invitación haya expirado o no sea real.`);
                });
                // console.log("No paso nada", plantilla)
            }
        }));
    }
    if (subCommand == "colaborador") {
        __1.estadisticas.comandos++;
        const dataCol = yield models_1.collaboratorsModel.findById(serverId), arrayCo = dataCol === null || dataCol === void 0 ? void 0 : dataCol.colaboradores, member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(options.getUser('colaborador', true).id), channelName = int.options.getString('nombre', true);
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(!(author === null || author === void 0 ? void 0 : author.permissions.has('Administrator'))),
                `¡No eres administrador del servidor!, no puede utilizar el comando.`
            ],
            [
                Boolean(member === null || member === void 0 ? void 0 : member.user.bot),
                `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser colaborador.`
            ],
            [
                Boolean((member === null || member === void 0 ? void 0 : member.id) == user.id),
                `El miembro que has proporcionado *(${member})* eres tu, no te puedes otorgar los veneficios como colaborador.`
            ],
            [
                Boolean((member === null || member === void 0 ? void 0 : member.id) == (guild === null || guild === void 0 ? void 0 : guild.ownerId)),
                `El miembro que has proporcionado *(${member})* es el sueño del servidor no tiene sentido que sea colaborador.`
            ]
        ]))
            return;
        if (arrayCo === null || arrayCo === void 0 ? void 0 : arrayCo.some(s => s.id == (member === null || member === void 0 ? void 0 : member.id))) {
            const colaborador = arrayCo.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id));
            if (colaborador === null || colaborador === void 0 ? void 0 : colaborador.colaborador) {
                const embEscolaborador = new discord_js_1.EmbedBuilder()
                    .setTitle(`💎 Es colaborador`)
                    .setDescription(`El miembro ${member} ya es colaborador del servidor.`)
                    .setColor((member === null || member === void 0 ? void 0 : member.displayHexColor) || 'White');
                int.reply({ ephemeral: true, embeds: [embEscolaborador] });
            }
            else if (colaborador) {
                member === null || member === void 0 ? void 0 : member.roles.add((dataCol === null || dataCol === void 0 ? void 0 : dataCol.datos.rolID) || '');
                guild === null || guild === void 0 ? void 0 : guild.channels.create({ name: `『』${channelName}`, parent: (dataCol === null || dataCol === void 0 ? void 0 : dataCol.datos.categoriaID) || '', permissionOverwrites: [{ id: (member === null || member === void 0 ? void 0 : member.id) || '', deny: 'ManageRoles', allow: ['CreateInstantInvite', 'ManageChannels', 'AddReactions', 'ViewChannel', 'SendMessages', 'SendTTSMessages', 'ManageMessages', 'EmbedLinks', 'AttachFiles', 'ReadMessageHistory', 'MentionEveryone', 'UseExternalEmojis', 'ManageWebhooks', 'UseApplicationCommands', 'ManageThreads', 'SendMessagesInThreads', 'CreatePublicThreads', 'CreatePrivateThreads', 'UseExternalStickers'] }] }).then((tc) => __awaiter(void 0, void 0, void 0, function* () {
                    var _l;
                    const embCanalCreado = new discord_js_1.EmbedBuilder()
                        .setTitle(`<a:afirmativo:856966728806432778> Canal creado`)
                        .setDescription(`El canal ${tc} ha sido creado para el colaborador ${member} y se le ha agregado el rol <@&${dataCol === null || dataCol === void 0 ? void 0 : dataCol.datos.rolID}>.`)
                        .setColor(((_l = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _l === void 0 ? void 0 : _l.displayHexColor) || 'White');
                    int.reply({ content: `<@${member === null || member === void 0 ? void 0 : member.id}>`, embeds: [embCanalCreado] });
                    colaborador.id = (member === null || member === void 0 ? void 0 : member.id) || '';
                    colaborador.tag = (member === null || member === void 0 ? void 0 : member.user.tag) || '';
                    colaborador.canalID = tc.id;
                    colaborador.fecha = Date.now();
                    colaborador.colaborador = true;
                    colaborador.tiempo = false;
                    colaborador.notificado = true;
                    yield models_1.collaboratorsModel.findByIdAndUpdate(serverId, { colaboradores: arrayCo });
                }));
            }
        }
        else {
            member === null || member === void 0 ? void 0 : member.roles.add((dataCol === null || dataCol === void 0 ? void 0 : dataCol.datos.rolID) || '');
            guild === null || guild === void 0 ? void 0 : guild.channels.create({ name: `『』${channelName}`, parent: dataCol === null || dataCol === void 0 ? void 0 : dataCol.datos.categoriaID, permissionOverwrites: [{ id: (member === null || member === void 0 ? void 0 : member.id) || '', deny: "ManageRoles", allow: ['CreateInstantInvite', 'ManageChannels', 'AddReactions', 'ViewChannel', 'SendMessages', 'SendTTSMessages', 'ManageMessages', 'EmbedLinks', 'AttachFiles', 'ReadMessageHistory', 'MentionEveryone', 'UseExternalEmojis', 'ManageWebhooks', 'UseApplicationCommands', 'ManageThreads', 'SendMessagesInThreads', 'CreatePublicThreads', 'CreatePrivateThreads', 'UseExternalStickers'] }] }).then((tc) => __awaiter(void 0, void 0, void 0, function* () {
                var _m;
                const embCanalCreado = new discord_js_1.EmbedBuilder()
                    .setTitle(`${emoji.afirmative} Canal creado`)
                    .setDescription(`El canal ${tc} ha sido creado para el nuevo colaborador ${member} y se le ha agregado el rol <@&${dataCol === null || dataCol === void 0 ? void 0 : dataCol.datos.rolID}>.`)
                    .setColor(((_m = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _m === void 0 ? void 0 : _m.displayHexColor) || 'White');
                int.reply({ content: `<@${member === null || member === void 0 ? void 0 : member.id}>`, embeds: [embCanalCreado] });
                arrayCo === null || arrayCo === void 0 ? void 0 : arrayCo.push({ id: (member === null || member === void 0 ? void 0 : member.id) || '', tag: (member === null || member === void 0 ? void 0 : member.user.tag) || '', canalID: tc.id, fecha: Date.now(), tiempo: false, colaborador: true, notificado: true });
                yield models_1.collaboratorsModel.findByIdAndUpdate(serverId, { colaboradores: arrayCo });
            }));
        }
    }
    if (subCommand == "encuesta") {
        __1.estadisticas.comandos++;
        const dataEnc = yield models_1.surveysModel.findById(serverId), arrayEn = dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.encuestas;
        const colorEb = (_d = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get((dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.datos.rolID) || '')) === null || _d === void 0 ? void 0 : _d.hexColor;
        const title = int.options.getString("titulo", true), tiempo = int.options.getString("tiempo", true), description = int.options.getString("descripción") || undefined, canal = (guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(((_e = options.getChannel("canal")) === null || _e === void 0 ? void 0 : _e.id) || '')) || int.channel, opcion1 = options.getString("opción1"), opcion2 = options.getString("opción2"), opcion3 = options.getString("opción3"), opcion4 = options.getString("opción4"), opcion5 = options.getString("opción5"), opcion6 = options.getString("opción6");
        let cantidadOpciones = 0, posicion = 0, opciones = [];
        [opcion1, opcion2, opcion3, opcion4, opcion5, opcion6].forEach(option => {
            if (option) {
                cantidadOpciones++;
                opciones.push({ emoji: (dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.datos.emojis[posicion]) || '', opcion: option, votos: 0 });
                posicion++;
            }
        });
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(!(author === null || author === void 0 ? void 0 : author.permissions.has('Administrator'))),
                `¡No eres administrador del servidor!, no puede utilizar el comando.`
            ],
            [
                Boolean(title.length > 200),
                `El tamaño del titulo *(${title.length})* supera el limite de **200** caracteres, proporciona un titulo más pequeño.`
            ],
            [
                Boolean(!isNaN(Number(tiempo))),
                `El tiempo proporcionado *(${tiempo})* no es valido ya que solo son números, también proporciona una letra que indique si son minutos, horas o días.`
            ],
            [
                Boolean(!(0, ms_1.default)(tiempo)),
                `El tiempo proporcionado *(${tiempo})* es in correcto.\nEjemplos:\n**Minutos:** 3m, 5m, 20m, 60m, etc\n**Horas:** 1h, 4h, 10h, 24h, etc\n**Días:** 1d, 2d, 4d, etc.`
            ],
            [
                Boolean((0, ms_1.default)(tiempo) > (0, ms_1.default)("10d")),
                `La cantidad de tiempo que has proporcionado *(${tiempo})* supera el limite de tiempo que un sorteo puede estar activo, proporciona un tiempo menor.`
            ],
            [
                Boolean(!opcion1 && !opcion2 && !opcion3 && !opcion4 && !opcion5 && !opcion6),
                `No has proporcionado ninguna opción para la encuesta, no se puede realizar una encuesta sin opciones.`
            ],
            [
                Boolean(cantidadOpciones < 2),
                `Solo has proporcionado **1** opción, una encuesta debe de tener mínimo **2** opciones.`
            ],
            [
                Boolean(description && description.length > 600),
                `El tamaño de la descripción *(${description === null || description === void 0 ? void 0 : description.length})* supera el limite de **600** caracteres, proporciona una descripción más pequeña.`
            ]
        ]))
            return;
        const embEncuesta = new discord_js_1.EmbedBuilder({ title, description })
            .setAuthor({ name: `⏸️ Encuesta en curso` })
            .addFields({ name: `🧩 **Opciones**`, value: `${opciones.map(m => `${m.emoji} ${m.opcion}`).join("\n")}` }, { name: `${emoji.information} **Información**`, value: `¡Selecciona una opción!\nFinaliza: <t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:R> *(<t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:F>)*\nCreada por: ${int.user}.` })
            .setColor(colorEb || 'White');
        const embEnviado = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.afirmative} Encuesta creada`)
            .setDescription(`La encuesta ha sido creada en este canal.`)
            .setColor(color.afirmative);
        if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement)) {
            canal.send({ embeds: [embEncuesta], content: `**¡Nueva encuesta <@&${dataEnc === null || dataEnc === void 0 ? void 0 : dataEnc.datos.rolID}>!**` }).then((ts) => __awaiter(void 0, void 0, void 0, function* () {
                if (canal.id != int.channelId)
                    embEnviado.setDescription(`La encuesta ha sido creada en el canal ${canal}.`);
                for (let r = 0; r < opciones.length; r++) {
                    if (dataEnc)
                        ts.react(dataEnc.datos.emojis[r]);
                }
                int.reply({ ephemeral: true, embeds: [embEnviado] });
                arrayEn === null || arrayEn === void 0 ? void 0 : arrayEn.push({ id: ts.id, canalID: canal.id, finaliza: Math.floor(Date.now() + (0, ms_1.default)(tiempo)), autorID: int.user.id, creado: Date.now(), activa: true, opciones: opciones });
                yield models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
            }));
        }
    }
    if (subCommand == "sorteo") {
        __1.estadisticas.comandos++;
        let dataSor = yield models_1.rafflesModel.findById(serverId), arraySo = dataSor === null || dataSor === void 0 ? void 0 : dataSor.sorteos, colorEb = (_f = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get((dataSor === null || dataSor === void 0 ? void 0 : dataSor.datos.rolID) || '')) === null || _f === void 0 ? void 0 : _f.hexColor;
        const title = options.getString("titulo", true), tiempo = options.getString("tiempo", true), preGanadores = options.getInteger("ganadores"), ganadores = preGanadores ? Math.floor(preGanadores) : null, description = options.getString("descripción") || undefined, canal = (guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(((_g = options.getChannel("canal")) === null || _g === void 0 ? void 0 : _g.id) || '')) || int.channel;
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(!(author === null || author === void 0 ? void 0 : author.permissions.has('Administrator'))),
                `¡No eres administrador del servidor!, no puede utilizar el comando.`
            ],
            [
                Boolean(title.length > 200),
                `El tamaño del titulo *(${title.length})* supera el limite de **200** caracteres, proporciona un titulo mas pequeño.`
            ],
            [
                Boolean(!isNaN(Number(tiempo))),
                `El tiempo proporcionado *(${tiempo})* no es valido ya que solo son números, también proporciona una letra que indique si son minutos, horas o días.`
            ],
            [
                Boolean(!(0, ms_1.default)(tiempo)),
                `El tiempo proporcionado *(${tiempo})* es in correcto.\nEjemplos:\n**Minutos:** 3m, 5m, 20m, 60m, etc\n**Horas:** 1h, 4h, 10h, 24h, etc\n**Días:** 1d, 2d, 4d, etc.`
            ],
            [
                Boolean((0, ms_1.default)(tiempo) > (0, ms_1.default)("10d")),
                `La cantidad de tiempo que has proporcionado *(${tiempo})* supera el limite de tiempo que un sorteo puede estar activo, proporciona un tiempo menor.`
            ],
            [
                Boolean(ganadores && ganadores > 10),
                `La cantidad de ganadores *(${ganadores})* supera el limite de ganadores de un sorteo.`
            ],
            [
                Boolean(description && description.length > 600),
                `El tamaño de la descripción *(${description === null || description === void 0 ? void 0 : description.length})* supera el limite de **600** caracteres, proporciona una descripción mas pequeña.`
            ]
        ]))
            return;
        const embSorteo = new discord_js_1.EmbedBuilder({ title, description })
            .setAuthor({ name: `⏸️ Sorteo en curso` })
            .addFields({ name: `\u200B`, value: `¡Reacciona a ${emoji.confetti} para participar!\nFinaliza: <t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:R> *(<t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:F>)*\nGanadores: ${ganadores == 1 ? `solo **1**` : `**${ganadores}**`}\nCreado por: ${int.user}.` })
            .setColor(colorEb || 'White')
            .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
            .setTimestamp();
        const embEnviado = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.afirmative} Sorteo creado`)
            .setDescription(`El sorteo ha sido creado este canal.`)
            .setColor(color.afirmative);
        if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement)) {
            canal.send({ embeds: [embSorteo], content: `**¡Nuevo sorteo <@&${dataSor === null || dataSor === void 0 ? void 0 : dataSor.datos.rolID}>**!` }).then((ts) => __awaiter(void 0, void 0, void 0, function* () {
                if (canal.id != int.channelId)
                    embEnviado.setDescription(`El sorteo ha sido creado en el canal ${canal}.`);
                ts.react("974801702307901490");
                int.reply({ ephemeral: true, embeds: [embEnviado] });
                arraySo === null || arraySo === void 0 ? void 0 : arraySo.push({ id: ts.id, canalID: canal.id, finaliza: Math.floor(Date.now() + (0, ms_1.default)(tiempo)), ganadores: ganadores || 1, autorID: int.user.id, creado: Date.now(), activo: true, participantes: [] });
                yield models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
            }));
        }
    }
}); // Linea 460 a
exports.crearSlashCommand = crearSlashCommand;
