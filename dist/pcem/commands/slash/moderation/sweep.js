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
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
exports.limpiarScb = new discord_js_1.SlashCommandBuilder()
    .setName(`sweep`)
    .setNameLocalization('es-ES', 'barrer')
    .setDescription(`🧹 Delete messages of the channel.`)
    .setDescriptionLocalization('es-ES', `🧹 Elimina mensajes del canal.`)
    .addStringOption(amount => amount.setName(`amount`)
    .setNameLocalization('es-ES', 'cantidad')
    .setDescription(`🔢 Number of messages to delete or the word 'all' (deletes up to 400 messages).`)
    .setDescriptionLocalization('es-ES', `🔢 Cantidad de mensajes a eliminar o la palabra 'todos' (elimina un máximo de 400 mensajes).`)
    .setRequired(true))
    .addUserOption(member => member.setName(`member`)
    .setNameLocalization('es-ES', 'miembro')
    .setDescription(`🧑 The member whose messages will be deleted in the channel.`)
    .setDescriptionLocalization('es-ES', `🧑 El miembro al que se le eliminaran sus mensajes en el canal.`)
    .setRequired(false))
    .addStringOption(id => id.setName(`id`)
    .setDescription(`🆔 ID of the author of the messages to be deleted.`)
    .setDescriptionLocalization('es-ES', `🆔 ID del autor de los mensajes a eliminar.`)
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages)
    .toJSON();
const limpiarSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, guild, options, locale } = int, { emoji, color } = db_1.botDB, isEnglish = locale == 'en-US';
    const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    const amount = options.getString('amount', true), member = options.getUser('member'), id = options.getString("id") || (member === null || member === void 0 ? void 0 : member.id);
    if ((0, functions_1.setSlashErrors)(int, [
        [
            Boolean(isNaN(Number(amount)) && (!['todos', 'all'].some(s => s == amount))),
            (isEnglish ? `The amount you provided *(${amount})* is not valid as it is not a numeric amount nor is it the word **all**.` : `La cantidad que has proporcionado *(${amount})* no es valida ya que no es una cantidad numérica ni es la palabra **todos**.`)
        ],
        [
            Boolean(Number(amount) > 400),
            (isEnglish ? `The amount you have provided *(${amount})* is greater than the maximum amount of messages I can delete which is **400** messages.` : `La cantidad que has proporcionado *(${amount})* es mayora a la cantidad máxima de mensajes que puedo eliminar la cual es **400** mensajes.`)
        ],
        [
            Boolean(member && options.getString("id")),
            (isEnglish ? `Do not provide a member and an author ID at the same time.` : `No proporciones un miembro y una ID de un autor a la vez.`)
        ],
        [
            Boolean(id && isNaN(Number(id))),
            (isEnglish ? `The author ID *(${id})* is not valid since it is not numeric.` : `La ID del autor *(${id})* no es valida ya que no es numérica.`)
        ]
    ]))
        return;
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
                    else if (typeof amount == 'number') {
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
                        int.channel.bulkDelete(filtro);
                        if (mensajes == amount || (bueltas > 1 && filtro.length == 0)) {
                            parado = true;
                            let embLimpiar = new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
                                .setTitle(`🗑️ Mensajes eliminados`)
                                .setColor(((_f = (_e = int.guild) === null || _e === void 0 ? void 0 : _e.members.me) === null || _f === void 0 ? void 0 : _f.displayHexColor) || 'White')
                                .setFooter({ text: ((_g = int.guild) === null || _g === void 0 ? void 0 : _g.name) || 'undefined', iconURL: ((_h = int.guild) === null || _h === void 0 ? void 0 : _h.iconURL()) || undefined })
                                .setTimestamp();
                            if (mensajes == amount) {
                                embLimpiar
                                    .setDescription(`Se han eliminado **${mensajes}** mensajes del ${((_j = int.guild) === null || _j === void 0 ? void 0 : _j.members.cache.has(id || '')) ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal.`);
                            }
                            else {
                                embLimpiar
                                    .setDescription(`Solo he podido eliminar **${mensajes}** mensajes del ${((_k = int.guild) === null || _k === void 0 ? void 0 : _k.members.cache.has(id || '')) ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal.`);
                            }
                            setTimeout(() => {
                                int.reply({ ephemeral: true, embeds: [embLimpiar] });
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
                    .setDescription(`No hay mensajes en este canal para eliminar o los mensajes que hay superan los **14** días y no puedo eliminar mensajes con ese tiempo.`)
                    .setColor(color.negative);
                if (bueltas == 1 && filtro.length == 0) {
                    console.log('Error');
                    parado = true;
                    int.reply({ ephemeral: true, embeds: [embError1] });
                }
                else {
                    console.log('numero');
                    const amountN = Number(amount);
                    if (amountN < 100 && Math.floor(amountN / 100) - bueltas < 0) {
                        filtro = filtro.splice(0, Math.floor(amountN % 100));
                    }
                    mensajes += filtro.length;
                    let embElimiando = new discord_js_1.EmbedBuilder()
                        .setTitle(`${emoji.loop} Eliminando mensajes`)
                        .setColor('Blue');
                    if (bueltas == 1) {
                        int.reply({ ephemeral: true, embeds: [embElimiando] });
                    }
                    yield int.channel.bulkDelete(filtro);
                    if (mensajes == amountN || (bueltas > 1 && filtro.length == 0)) {
                        parado = true;
                        let embLimpiar = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
                            .setTitle(`🗑️ Mensajes eliminados`)
                            .setColor(((_d = (_c = int.guild) === null || _c === void 0 ? void 0 : _c.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White')
                            .setFooter({ text: ((_e = int.guild) === null || _e === void 0 ? void 0 : _e.name) || 'undefined', iconURL: ((_f = int.guild) === null || _f === void 0 ? void 0 : _f.iconURL()) || undefined })
                            .setTimestamp();
                        if (mensajes == amountN) {
                            embLimpiar
                                .setDescription(`Se han eliminado **${mensajes}** mensajes en este canal.`);
                        }
                        else {
                            embLimpiar
                                .setDescription(`Solo he podido eliminar **${mensajes}** mensajes de los **${amount}** que me pediste en este canal.`);
                        }
                        setTimeout(() => {
                            int.reply({ embeds: [embLimpiar] });
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
