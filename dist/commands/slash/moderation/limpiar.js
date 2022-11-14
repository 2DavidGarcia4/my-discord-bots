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
exports.limpiarSlashCommand = exports.limpiarScb = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const __1 = require("../../..");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../utils/functions");
exports.limpiarScb = new discord_js_1.SlashCommandBuilder()
    .setName(`limpiar`)
    .setDescription(`🗑️ Elimina mensajes de un canal.`)
    .addStringOption(cantidad => cantidad.setName(`cantidad`).setDescription(`🔢 Cantidad de mensajes a eliminar o la palabra todos (elimina un máximo de 400 mensajes).`).setRequired(true))
    .addUserOption(miembro => miembro.setName(`miembro`).setDescription(`🧑 El miembro al que se le eliminaran sus mensajes en el canal.`).setRequired(false))
    .addStringOption(autorID => autorID.setName(`autorid`).setDescription(`🆔 ID del autor de los mensajes a eliminar.`).setRequired(false)).toJSON();
const limpiarSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { Flags: per } = discord_js_1.PermissionsBitField, dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), author = (_b = int.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(int.user.id);
    const { options } = int, { emoji, color } = db_1.botDB;
    if (!dataBot)
        return;
    // await int.deferReply({ephemeral: true})
    __1.estadisticas.comandos++;
    let cantidad = int.options.getString('cantidad', true), autorId = int.options.getString('autorid'), id = int.options.getUser("miembro") ? (_c = options.getUser("miembro")) === null || _c === void 0 ? void 0 : _c.id : false || autorId, canalRegistros = client.channels.cache.get(dataBot === null || dataBot === void 0 ? void 0 : dataBot.logs.moderation);
    if ((0, functions_1.setSlashErrors)(int, [
        [
            ![per.ModerateMembers, per.KickMembers, per.BanMembers].some(s => author === null || author === void 0 ? void 0 : author.permissions.has(s)),
            '¡No eres moderador del servidor!, no puede utilizar el comando.'
        ],
        [
            isNaN(Number(cantidad)) && cantidad != "todos",
            `La cantidad *(${cantidad})* no es valida ya que no es una cantidad numérica ni es la palabra **todos**.`
        ],
        [
            !isNaN(Number(cantidad)) && Number(cantidad) > 400,
            `La cantidad que has proporcionado *(${cantidad})* es mayora a la cantidad máxima de mensajes que puedo eliminar la cual es **400** mensajes.`
        ],
        [
            Boolean(int.options.getUser("miembro")) && Boolean(int.options.getString("autorid")),
            `No proporciones un miembro y una ID de un autor a la vez.`
        ],
        [
            Boolean(autorId && isNaN(Number(autorId))),
            `La ID del autor *(${autorId})* no es valida ya que no es numérica.`
        ],
        [
            Boolean(autorId && autorId.length != 18),
            `La ID del autor *(${autorId})* no es valida ya que no contiene **18** caracteres numéricos contiene menos o mas.`
        ]
    ]))
        return;
    console.log("hello");
    if (id) {
        console.log('id');
        yield client.users.fetch(id, { force: true }).then((usuario) => __awaiter(void 0, void 0, void 0, function* () {
            let bueltas = 0, mensajes = 0, parado = false;
            function clearMessages() {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __awaiter(this, void 0, void 0, function* () {
                    if (((_a = int.channel) === null || _a === void 0 ? void 0 : _a.type) != discord_js_1.ChannelType.GuildText)
                        return;
                    bueltas++;
                    let filtro = (_c = (yield ((_b = int.channel) === null || _b === void 0 ? void 0 : _b.messages.fetch({ limit: 100 })))) === null || _c === void 0 ? void 0 : _c.filter(f => f.author.id == id && Date.now() - f.createdTimestamp < (0, ms_1.default)("14d")).map(m => m);
                    // console.log(filtro.length)
                    const embError1 = new discord_js_1.EmbedBuilder()
                        .setTitle(`${emoji.negative} Error`)
                        .setDescription(`No hay mensajes del ${((_d = int.guild) === null || _d === void 0 ? void 0 : _d.members.cache.has(id || '')) ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal para eliminar, no hay ningún mensaje de ese autor en los **100** últimos mensajes o los mensajes que hay de ese autor superan los 14 días y no puedo eliminar mensajes con ese tiempo.`)
                        .setColor(color.negative);
                    if (bueltas == 1 && filtro.length == 0) {
                        parado = true;
                        int.reply({ ephemeral: true, embeds: [embError1] });
                    }
                    else if (typeof cantidad == 'number') {
                        if (cantidad < 100 && Math.floor(cantidad / 100) - bueltas < 0) {
                            filtro = filtro.splice(0, Math.floor(cantidad % 100));
                        }
                        mensajes += filtro.length;
                        let embElimiando = new discord_js_1.EmbedBuilder()
                            .setTitle(`${emoji.loop} Eliminando mensajes`)
                            .setColor('Blue');
                        if (bueltas == 1) {
                            int.reply({ ephemeral: true, embeds: [embElimiando] });
                        }
                        int.channel.bulkDelete(filtro);
                        if (mensajes == cantidad || (bueltas > 1 && filtro.length == 0)) {
                            parado = true;
                            let embLimpiar = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
                                .setTitle(`🗑️ Mensajes eliminados`)
                                .setColor(((_f = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.me) === null || _f === void 0 ? void 0 : _f.displayHexColor) || 'White')
                                .setFooter({ text: ((_g = int.guild) === null || _g === void 0 ? void 0 : _g.name) || 'undefined', iconURL: ((_h = int.guild) === null || _h === void 0 ? void 0 : _h.iconURL()) || undefined })
                                .setTimestamp();
                            if (mensajes == cantidad) {
                                embLimpiar
                                    .setDescription(`Se han eliminado **${mensajes}** mensajes del ${((_j = int.guild) === null || _j === void 0 ? void 0 : _j.members.cache.has(id || '')) ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal.`);
                            }
                            else {
                                embLimpiar
                                    .setDescription(`Solo he podido eliminar **${mensajes}** mensajes del ${((_k = int.guild) === null || _k === void 0 ? void 0 : _k.members.cache.has(id || '')) ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal.`);
                            }
                            const embRegistro = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: `Comando ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
                                .setTitle(`📝 Registro del comando /limpiar`)
                                .addFields({ name: `📌 **Utilizado en el canal:**`, value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: `👮 **Autor:**`, value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `🗑️ **Mensajes eliminados:**`, value: `**${mensajes}** de ${usuario}\n**ID:** ${usuario.id}` })
                                .setColor('Blue')
                                .setFooter({ text: usuario.tag, iconURL: usuario.displayAvatarURL() })
                                .setTimestamp();
                            setTimeout(() => {
                                int.reply({ ephemeral: true, embeds: [embLimpiar] });
                                if ((canalRegistros === null || canalRegistros === void 0 ? void 0 : canalRegistros.type) == discord_js_1.ChannelType.GuildText)
                                    canalRegistros.send({ embeds: [embRegistro] });
                            }, mensajes * 100);
                        }
                    }
                });
            }
            clearMessages();
            let intervalo = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                if (parado) {
                    clearInterval(intervalo);
                }
                else {
                    clearMessages();
                }
            }), 2000);
        })).catch(c => {
            const embErrorNoEncontrado = new discord_js_1.EmbedBuilder()
                .setTitle(`${emoji.negative} Error`)
                .setDescription(`No pude encontrar al usuario, ID del autor invalida.`)
                .setColor(color.negative);
            int.reply({ ephemeral: true, embeds: [embErrorNoEncontrado] });
        });
    }
    else {
        console.log('else id');
        let bueltas = 0, mensajes = 0, parado = false;
        function clearMessages() {
            var _a, _b, _c, _d, _e, _f;
            return __awaiter(this, void 0, void 0, function* () {
                console.log('función');
                if (((_a = int.channel) === null || _a === void 0 ? void 0 : _a.type) != discord_js_1.ChannelType.GuildText)
                    return;
                bueltas++;
                // ;(await int.channel.messages.fetch({limit: 10})).forEach(msg=> console.log(msg.createdAt, msg.createdTimestamp))
                let filtro = (yield ((_b = int.channel) === null || _b === void 0 ? void 0 : _b.messages.fetch({ limit: 100 }))).filter(f => Date.now() - f.createdTimestamp < (0, ms_1.default)("14d")).map(m => m);
                console.log(filtro.length);
                const embError1 = new discord_js_1.EmbedBuilder()
                    .setTitle(`${emoji.negative} Error`)
                    .setDescription(`No hay mensajes en este canal para eliminar o los mensajes que hay en este canal superan los **14** días y no puedo eliminar mensajes con ese tiempo.`)
                    .setColor(color.negative);
                if (bueltas == 1 && filtro.length == 0) {
                    console.log('Error');
                    parado = true;
                    int.reply({ ephemeral: true, embeds: [embError1] });
                }
                else {
                    console.log('numero');
                    const amount = Number(cantidad);
                    if (amount < 100 && Math.floor(amount / 100) - bueltas < 0) {
                        filtro = filtro.splice(0, Math.floor(amount % 100));
                    }
                    mensajes += filtro.length;
                    let embElimiando = new discord_js_1.EmbedBuilder()
                        .setTitle(`${emoji.loop} Eliminando mensajes`)
                        .setColor('Blue');
                    if (bueltas == 1) {
                        int.reply({ ephemeral: true, embeds: [embElimiando] });
                    }
                    yield int.channel.bulkDelete(filtro);
                    if (mensajes == amount || (bueltas > 1 && filtro.length == 0)) {
                        parado = true;
                        let embLimpiar = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
                            .setTitle(`🗑️ Mensajes eliminados`)
                            .setColor(((_d = (_c = int.guild) === null || _c === void 0 ? void 0 : _c.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White')
                            .setFooter({ text: ((_e = int.guild) === null || _e === void 0 ? void 0 : _e.name) || 'undefined', iconURL: ((_f = int.guild) === null || _f === void 0 ? void 0 : _f.iconURL()) || undefined })
                            .setTimestamp();
                        if (mensajes == amount) {
                            embLimpiar
                                .setDescription(`Se han eliminado **${mensajes}** mensajes en este canal.`);
                        }
                        else {
                            embLimpiar
                                .setDescription(`Solo he podido eliminar **${mensajes}** mensajes de los **${cantidad}** que me pediste en este canal.`);
                        }
                        const embRegistro = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: `Comando ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL() })
                            .setTitle(`📝 Registro del comando /limpiar`)
                            .addFields({ name: `📌 **Utilizado en el canal:**`, value: `${int.channel}\n**ID:** ${int.channelId}` }, { name: `👮 **Autor:**`, value: `${int.user}\n**ID:** ${int.user.id}` }, { name: `🗑️ **Mensajes eliminados:**`, value: `**${mensajes}**` })
                            .setColor('Blue')
                            .setTimestamp();
                        setTimeout(() => {
                            int.reply({ embeds: [embLimpiar] });
                            if ((canalRegistros === null || canalRegistros === void 0 ? void 0 : canalRegistros.type) == discord_js_1.ChannelType.GuildText)
                                canalRegistros.send({ embeds: [embRegistro] });
                        }, mensajes * 100);
                    }
                }
            });
        }
        clearMessages();
        let intervalo = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            if (parado) {
                clearInterval(intervalo);
            }
            else {
                clearMessages();
            }
        }), 2000);
    }
});
exports.limpiarSlashCommand = limpiarSlashCommand;
