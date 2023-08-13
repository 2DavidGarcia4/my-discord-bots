"use strict";
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
const limpiarSlashCommand = async (int, client) => {
    const { user, channel, guild, options, locale } = int, { emoji, color } = db_1.botDB, isEnglish = locale == 'en-US';
    const author = guild?.members.cache.get(user.id);
    const amount = options.getString('amount', true), member = options.getUser('member'), id = options.getString("id") || member?.id;
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
    const amountMessages = Number(amount);
    if (amountMessages && channel?.type == discord_js_1.ChannelType.GuildText) {
        let leakedMessages = (await channel.messages.fetch({ limit: (amountMessages > 100 ? 100 : amountMessages) })).filter(f => (id ? id == f.author.id : true) && (Date.now() - f.createdTimestamp) < (0, ms_1.default)("14d")).map(m => m);
        console.log(leakedMessages.length);
        const SweeepEb = new discord_js_1.EmbedBuilder()
            .setTitle(`${emoji.loop} Eliminando mensajes`)
            .setColor('Blue');
        int.reply({ ephemeral: true, embeds: [SweeepEb] }).then(() => {
            SweeepEb.setAuthor({ name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`🗑️ Mensajes eliminados`)
                .setColor('Blurple')
                .setFooter({ text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined })
                .setTimestamp();
            if (leakedMessages.length == amountMessages) {
                SweeepEb.setDescription(`Se han eliminado **${leakedMessages.length}** mensajes en este canal.`);
            }
            else {
                SweeepEb.setDescription(`Solo he podido eliminar **${leakedMessages.length}** mensajes de los **${amount}** que me pediste en este canal.`);
            }
            channel.bulkDelete(leakedMessages).then(async () => {
                await int.editReply({ embeds: [SweeepEb] });
            });
        });
    }
    if (false) {
        console.log('id');
        await client.users.fetch(id || '', { force: true }).then(async (usuario) => {
            let bueltas = 0, mensajes = 0, parado = false;
            async function clearMessages() {
                if (int.channel?.type != discord_js_1.ChannelType.GuildText)
                    return;
                bueltas++;
                let filtro = (await int.channel?.messages.fetch({ limit: 100 }))?.filter(f => f.author.id == id && Date.now() - f.createdTimestamp < (0, ms_1.default)("14d")).map(m => m);
                // console.log(filtro.length)
                const embError1 = new discord_js_1.EmbedBuilder()
                    .setTitle(`${emoji.negative} Error`)
                    .setDescription(`No hay mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal para eliminar, no hay ningún mensaje de ese autor en los **100** últimos mensajes o los mensajes que hay de ese autor superan los 14 días y no puedo eliminar mensajes con ese tiempo.`)
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
                            .setAuthor({ name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL() })
                            .setTitle(`🗑️ Mensajes eliminados`)
                            .setColor(int.guild?.members.me?.displayHexColor || 'White')
                            .setFooter({ text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined })
                            .setTimestamp();
                        if (mensajes == amount) {
                            embLimpiar
                                .setDescription(`Se han eliminado **${mensajes}** mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal.`);
                        }
                        else {
                            embLimpiar
                                .setDescription(`Solo he podido eliminar **${mensajes}** mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>` : `usuario <@${id}>`} en este canal.`);
                        }
                        setTimeout(() => {
                            int.reply({ ephemeral: true, embeds: [embLimpiar] });
                        }, mensajes * 100);
                    }
                }
            }
            clearMessages();
            let intervalo = setInterval(async () => {
                if (parado) {
                    clearInterval(intervalo);
                }
                else {
                    clearMessages();
                }
            }, 2000);
        }).catch(c => {
            const embErrorNoEncontrado = new discord_js_1.EmbedBuilder()
                .setTitle(`${emoji.negative} Error`)
                .setDescription(`No pude encontrar al usuario, ID del autor invalida.`)
                .setColor(color.negative);
            int.reply({ ephemeral: true, embeds: [embErrorNoEncontrado] });
        });
    }
    else if (false) {
        console.log('else id');
        let bueltas = 0, mensajes = 0, parado = false;
        async function clearMessages() {
            console.log('función');
            if (int.channel?.type != discord_js_1.ChannelType.GuildText)
                return;
            bueltas++;
            // ;(await int.channel.messages.fetch({limit: 10})).forEach(msg=> console.log(msg.createdAt, msg.createdTimestamp))
            let filtro = (await int.channel?.messages.fetch({ limit: 100 })).filter(f => Date.now() - f.createdTimestamp < (0, ms_1.default)("14d")).map(m => m);
            console.log(filtro.length);
            if (bueltas == 1 && filtro.length == 0) {
                console.log('Error');
                parado = true;
                (0, functions_1.setSlashError)(int, `No hay mensajes en este canal para eliminar o los mensajes que hay superan los **14** días y no puedo eliminar mensajes con ese tiempo.`);
            }
            else {
                console.log('numero');
                const amountN = Number(amount);
                console.log({ op: Math.floor(amountN / 100) - bueltas });
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
                await int.channel.bulkDelete(filtro);
                if (mensajes == amountN || (bueltas > 1 && filtro.length == 0)) {
                    parado = true;
                    let embLimpiar = new discord_js_1.EmbedBuilder()
                        .setAuthor({ name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL() })
                        .setTitle(`🗑️ Mensajes eliminados`)
                        .setColor(int.guild?.members.me?.displayHexColor || 'White')
                        .setFooter({ text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined })
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
        }
        clearMessages();
        let intervalo = setInterval(async () => {
            if (parado) {
                clearInterval(intervalo);
            }
            else {
                clearMessages();
            }
        }, 2000);
    }
};
exports.limpiarSlashCommand = limpiarSlashCommand;
