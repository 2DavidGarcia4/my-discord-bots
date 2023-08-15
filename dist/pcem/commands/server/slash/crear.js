"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearSlashCommand = exports.crearScb = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const db_1 = require("../../../db");
const models_1 = require("../../../../models");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.crearScb = new discord_js_1.SlashCommandBuilder()
    .setName("crear")
    .setDescription(`¡Crea!`)
    .addSubcommand(alianza => alianza.setName(`alianza`)
    .setDescription(`🤝 !Crea una alianza¡.`)
    .addBooleanOption(ping => ping.setName("notificación").setDescription(`🔔 Notifica a los miembros que tienen el rol de alianza.`).setRequired(true))
    .addUserOption(us => us.setName("aliado").setDescription("🧑 Proporciona el aliado (el miembro con el que has creado la alianza).").setRequired(false))).toJSON();
// .addSubcommand(encuesta => 
//   encuesta.setName(`encuesta`)
//   .setDescription(`📊 Crea una encuesta.`)
//   .addStringOption(titulo=> 
//     titulo.setName(`titulo`)
//     .setDescription(`🔖 El titulo del embed de la encuesta.`)
//     .setRequired(true)
//   )
//   .addStringOption(tiempo=> 
//     tiempo.setName(`tiempo`)
//     .setDescription(`⏱️ El tiempo que durara la encuesta.`)
//     .setRequired(true)
//   )
//   .addStringOption(descripcion=> 
//     descripcion.setName(`descripción`)
//     .setDescription(`📄 Descripción del embed de la encuesta.`)
//     .setRequired(false)
//   )
//   .addChannelOption(canal=> 
//     canal.setName(`canal`)
//     .setDescription(`📚 Canal en el cual se enviara la encuesta.`)
//     .setRequired(false)
//   )
//   .addStringOption(opcion1=> opcion1.setName(`opción1`).setDescription(`1️⃣ Agrega la opción 1.`).setRequired(false))
//   .addStringOption(opcion2=> opcion2.setName(`opción2`).setDescription(`2️⃣ Agrega la opción 2.`).setRequired(false))
//   .addStringOption(opcion3=> opcion3.setName(`opción3`).setDescription(`3️⃣ Agrega la opción 3.`).setRequired(false))
//   .addStringOption(opcion4=> opcion4.setName(`opción4`).setDescription(`4️⃣ Agrega la opción 4.`).setRequired(false))
//   .addStringOption(opcion5=> opcion5.setName(`opción5`).setDescription(`5️⃣ Agrega la opción 5.`).setRequired(false))
//   .addStringOption(opcion6=> opcion6.setName(`opción6`).setDescription(`6️⃣ Agrega la opción 6.`).setRequired(false))
// )
// .addSubcommand(sorteo => 
//   sorteo.setName(`sorteo`)
//   .setDescription(`🎉 Crea un sorteo.`)
//   .addStringOption(titulo=> titulo.setName(`titulo`)
//     .setDescription(`🔖 El titulo del embed del sorteo.`)
//     .setRequired(true)
//   )
//   .addStringOption(tiempo=> 
//     tiempo.setName(`tiempo`)
//     .setDescription(`⏱️ El tiempo que durara el sorteo activo.`)
//     .setRequired(true)
//   )
//   .addIntegerOption(ganadores=> 
//     ganadores.setName(`ganadores`)
//     .setDescription(`👥 Cantidad de ganadores del sorteo.`)
//     .setRequired(true)
//   )
//   .addStringOption(descripcion=> 
//     descripcion.setName(`descripción`)
//     .setDescription(`📄 Descripción del embed del sorteo.`)
//     .setRequired(false)
//   )
//   .addChannelOption(canal=> 
//     canal.setName(`canal`)
//     .setDescription(`📚 Canal en el cual se enviara el sorteo.`)
//     .setRequired(false)
//   )
// ).toJSON()
const crearSlashCommand = async (int, client) => {
    const { options, guild, user } = int, subCommand = options.getSubcommand(true), { serverId, emoji, color } = db_1.botDB, author = guild?.members.cache.get(user.id);
    const dataBot = await (0, utils_1.getBotData)(client);
    // const {} = PermissionFlagsBits
    if (subCommand == "alianza") {
        const dataAli = await models_1.alliancesModel.findById(serverId), arrayMi = dataAli?.members, arraySv = dataAli?.servers;
        const channel = guild?.channels.cache.get('826863938057797633'), channelLog = guild?.channels.cache.get(dataBot?.logs.alliances || '941880387020419083');
        const notificacion = int.options.getBoolean("notificación", true), aliado = int.options.getUser("aliado");
        let enviado = false;
        if (guild?.ownerId != int.user.id && !author?.permissions.has('Administrator') && !author?.roles.cache.has('887444598715219999'))
            return (0, functions_1.setSlashError)(int, 'No eres miembro de soporte del servidor, por lo tanto no puedes utilizar el comando.');
        const embAdvertencia = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.warning} Advertencia`)
            .setDescription(`Tienes **30** segundos para proporcionar la plantilla.`)
            .setColor(guild?.members.me?.displayHexColor || 'White');
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
        const colector = int.channel?.createMessageCollector({ filter: u => u.author.id == int.user.id, time: 30000, max: 1 });
        colector?.on("collect", async (m) => {
            async function alianzaSystem(des1, des2, des3, contenido) {
                const embPlantilla = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
                    .setDescription(des1)
                    .setColor(guild?.roles.cache.get("840704364158910475")?.hexColor || 'White');
                if (channel?.type == discord_js_1.ChannelType.GuildText)
                    channel.send({ content: contenido }).then(mc => {
                        const embEnviada = new discord_js_1.EmbedBuilder()
                            .setTitle(`${emoji.afirmative} Alianza creada`)
                            .setDescription(des2)
                            .setColor(guild?.members.me?.displayHexColor || 'White')
                            .setTimestamp();
                        mc.reply({ embeds: [embPlantilla] });
                        enviado = true;
                        int.editReply({ embeds: [embEnviada] });
                        if (aliado)
                            guild?.members.cache.get(aliado.id)?.roles.add("895394175481159680");
                    });
                const embRegistro = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: int.user.tag, iconURL: int.user.displayAvatarURL() })
                    .setTitle(`${emoji.afirmative} Alianza creada`)
                    .setDescription(des3)
                    .setColor(guild?.roles.cache.get("840704364158910475")?.hexColor || 'White')
                    .setTimestamp();
                if (aliado)
                    embRegistro.setFooter({ text: aliado.tag, iconURL: aliado.displayAvatarURL() });
                if (channelLog?.type == discord_js_1.ChannelType.GuildText)
                    channelLog.send({ embeds: [embRegistro] });
                if (arrayMi?.some(s => s.id == int.user.id)) {
                    let miembro = arrayMi.find(f => f.id == int.user.id);
                    if (miembro) {
                        miembro.amount++;
                        miembro.tag = int.user.tag;
                    }
                }
                else {
                    arrayMi?.push({ tag: int.user.tag, id: int.user.id, amount: 1 });
                }
                await models_1.alliancesModel.findByIdAndUpdate(serverId, { miembros: arrayMi });
            }
            if (m) {
                let plantilla = m.content.replace(/@/g, "");
                setTimeout(() => {
                    m.delete().catch(c => c);
                }, 400);
                if (!["discord.gg/", "discord.com/invite/"].some(s => plantilla.includes(s)))
                    return (0, functions_1.setSlashError)(int, `La plantilla que has proporcionado no es una plantilla de un servidor ya que no contienen ningún enlace de invitación a un servidor de Discord.`);
                client.fetchInvite(plantilla.split(/ +/g).find(f => ["discord.com/invite/", "discord.gg/"].some(s => f.includes(s))) || '').then(async (invite) => {
                    if (arraySv?.some(s => s.id == invite.guild?.id)) {
                        let servidor = arraySv?.find(f => f.id == invite.guild?.id);
                        if (servidor) {
                            if (servidor.time >= Math.floor(Date.now() - (0, ms_1.default)("7d")))
                                return int.editReply({ embeds: [
                                        (0, functions_1.createEmbedMessage)(`${emoji.negative} Error`, `Ya se ha echo alianza con ese servidor y esa alianza se ha echo **<t:${Math.floor((servidor?.time || 0) / 1000)}:R>** así que no se puede renovar por ahora.`, color.negative)
                                    ] });
                            servidor.name = invite.guild?.name || '';
                            servidor.time = Date.now();
                            servidor.invitation = invite.url;
                            servidor.members = invite.memberCount;
                        }
                    }
                    else {
                        arraySv?.push({ name: invite.guild?.name || '', id: invite.guild?.id || '', time: Date.now(), invitation: invite.url, members: invite.memberCount });
                    }
                    await models_1.alliancesModel.findByIdAndUpdate(serverId, { servidores: arraySv });
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
                            alianzaSystem(`*Alianza creada por ${int.user} y por el aliado <@${aliado.id}>*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel?.id}>, gracias por la alianza de ${aliado}.`, `Alianza creada por ${int.user}, gracias al aliado ${aliado}, se ha utilizado el ping <@&840704364158910475>.`, `${plantilla}\n<@&840704364158910475>`);
                        }
                        else {
                            alianzaSystem(`*Alianza creada por ${int.user} y por el aliado <@${aliado.id}>*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel?.id}>, gracias por la alianza de ${aliado}.`, `Alianza creada por ${int.user}, gracias al aliado ${aliado}, *no se ha utilizado ping*.`, plantilla);
                        }
                    }
                    else {
                        if (notificacion) {
                            alianzaSystem(`*Alianza creada por ${int.user}*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel?.id}>, gracias por la alianza.`, `Alianza creada por ${int.user} que ha utilizado el ping <@&840704364158910475>.`, `${plantilla}\n<@&840704364158910475>`);
                        }
                        else {
                            alianzaSystem(`*Alianza creada por ${int.user}*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, `Plantilla enviada al canal <#${channel?.id}>, gracias por la alianza.`, `Alianza creada por ${int.user}, *no se ha utilizado ping*.`, plantilla);
                        }
                    }
                }).catch(error => {
                    (0, functions_1.setSlashError)(int, `Lo ciento no he podido obtener información de la invitación de la plantilla, puede ser que la invitación haya expirado o no sea real.`);
                });
                // console.log("No paso nada", plantilla)
            }
        });
    }
    if (subCommand == "encuesta") {
        const dataEnc = await models_1.surveysModel.findById(serverId), arrayEn = dataEnc?.surveys;
        const colorEb = guild?.roles.cache.get(dataEnc?.data.rolId || '')?.hexColor;
        const title = int.options.getString("titulo", true), tiempo = int.options.getString("tiempo", true), description = int.options.getString("descripción") || undefined, canal = guild?.channels.cache.get(options.getChannel("canal")?.id || '') || int.channel, opcion1 = options.getString("opción1"), opcion2 = options.getString("opción2"), opcion3 = options.getString("opción3"), opcion4 = options.getString("opción4"), opcion5 = options.getString("opción5"), opcion6 = options.getString("opción6");
        let cantidadOpciones = 0, posicion = 0, opciones = [];
        [opcion1, opcion2, opcion3, opcion4, opcion5, opcion6].forEach(option => {
            if (option) {
                cantidadOpciones++;
                opciones.push({ emoji: dataEnc?.data.emojis[posicion] || '', option: option, votes: 0 });
                posicion++;
            }
        });
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(!author?.permissions.has('Administrator')),
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
                `El tamaño de la descripción *(${description?.length})* supera el limite de **600** caracteres, proporciona una descripción más pequeña.`
            ]
        ]))
            return;
        const embEncuesta = new discord_js_1.EmbedBuilder({ title, description })
            .setAuthor({ name: `⏸️ Encuesta en curso` })
            .addFields({ name: `🧩 **Opciones**`, value: `${opciones.map(m => `${m.emoji} ${m.option}`).join("\n")}` }, { name: `${emoji.information} **Información**`, value: `¡Selecciona una opción!\nFinaliza: <t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:R> *(<t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:F>)*\nCreada por: ${int.user}.` })
            .setColor(colorEb || 'White');
        const embEnviado = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.afirmative} Encuesta creada`)
            .setDescription(`La encuesta ha sido creada en este canal.`)
            .setColor(color.afirmative);
        if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement)) {
            canal.send({ embeds: [embEncuesta], content: `**¡Nueva encuesta <@&${dataEnc?.data.rolId}>!**` }).then(async (ts) => {
                if (canal.id != int.channelId)
                    embEnviado.setDescription(`La encuesta ha sido creada en el canal ${canal}.`);
                for (let r = 0; r < opciones.length; r++) {
                    if (dataEnc)
                        ts.react(dataEnc.data.emojis[r]);
                }
                int.reply({ ephemeral: true, embeds: [embEnviado] });
                arrayEn?.push({ id: ts.id, channelId: canal.id, ends: Math.floor(Date.now() + (0, ms_1.default)(tiempo)), authorId: int.user.id, createdAt: Date.now(), active: true, options: opciones });
                await models_1.surveysModel.findByIdAndUpdate(serverId, { encuestas: arrayEn });
            });
        }
    }
    if (subCommand == "sorteo") {
        let dataSor = await models_1.rafflesModel.findById(serverId), arraySo = dataSor?.raffles, colorEb = guild?.roles.cache.get(dataSor?.data.rolId || '')?.hexColor;
        const title = options.getString("titulo", true), tiempo = options.getString("tiempo", true), preGanadores = options.getInteger("ganadores"), ganadores = preGanadores ? Math.floor(preGanadores) : null, description = options.getString("descripción") || undefined, canal = guild?.channels.cache.get(options.getChannel("canal")?.id || '') || int.channel;
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(!author?.permissions.has('Administrator')),
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
                `El tamaño de la descripción *(${description?.length})* supera el limite de **600** caracteres, proporciona una descripción mas pequeña.`
            ]
        ]))
            return;
        const embSorteo = new discord_js_1.EmbedBuilder({ title, description })
            .setAuthor({ name: `⏸️ Sorteo en curso` })
            .addFields({ name: `\u200B`, value: `¡Reacciona a ${emoji.confetti} para participar!\nFinaliza: <t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:R> *(<t:${Math.floor((Date.now() + (0, ms_1.default)(tiempo)) / 1000)}:F>)*\nGanadores: ${ganadores == 1 ? `solo **1**` : `**${ganadores}**`}\nCreado por: ${int.user}.` })
            .setColor(colorEb || 'White')
            .setFooter({ text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined })
            .setTimestamp();
        const embEnviado = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.afirmative} Sorteo creado`)
            .setDescription(`El sorteo ha sido creado este canal.`)
            .setColor(color.afirmative);
        if (canal && (canal.type == discord_js_1.ChannelType.GuildText || canal.type == discord_js_1.ChannelType.GuildAnnouncement)) {
            canal.send({ embeds: [embSorteo], content: `**¡Nuevo sorteo <@&${dataSor?.data.rolId}>**!` }).then(async (ts) => {
                if (canal.id != int.channelId)
                    embEnviado.setDescription(`El sorteo ha sido creado en el canal ${canal}.`);
                ts.react("974801702307901490");
                int.reply({ ephemeral: true, embeds: [embEnviado] });
                arraySo?.push({ id: ts.id, channelId: canal.id, ends: Math.floor(Date.now() + (0, ms_1.default)(tiempo)), winners: ganadores || 1, authorId: int.user.id, createdAt: Date.now(), active: true, participants: [] });
                await models_1.rafflesModel.findByIdAndUpdate(serverId, { sorteos: arraySo });
            });
        }
    }
}; // Linea 460 a
exports.crearSlashCommand = crearSlashCommand;
