"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const data_1 = require("../data");
const __1 = require("../..");
class MessageCreateEvent extends __1.BotEvent {
    constructor() {
        super('messageCreate');
    }
    async execute(msg, client) {
        const { member, guild, guildId } = msg;
        const { prefix, emoji, color, serverId } = client.data;
        if (msg.guildId == data_1.botDB.serverId) {
            if (msg.author.bot)
                return;
            //TODO: Roles de timpo
            if (member) {
                const tiempo = Math.floor(Date.now() - Number(member.joinedAt?.valueOf()));
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
                    member.roles.add(option?.rol);
                tiempos.forEach(time => {
                    if (member.roles.cache.has(time.rol) && time.rol != option?.rol) {
                        member.roles.remove(time.rol);
                    }
                });
            }
            //TODO: Sistema VIP
            if (msg.channelId == '826193847943037018' && msg.channel.type == discord_js_1.ChannelType.GuildText && msg.mentions.everyone && msg.member?.roles.cache.has('826197551904325712') && !msg.member?.permissions.has('Administrator')) {
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
                    .setTitle(`${data_1.botDB.emoji.animateBoost} Nueva mejora`)
                    .setColor(msg.member?.displayHexColor || 'White');
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
        }
        //TODO: Mensaje por mención
        if (msg.content.match(`^<@!?${client.user?.id}>( |)$`)) {
            client.textCommands.get('help')?.execute({ message: msg, client });
        }
        if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
            return;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (commandName) {
            client.textCommands.get(commandName)?.execute({ message: msg, args, client });
        }
    }
}
exports.default = MessageCreateEvent;
