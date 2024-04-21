"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
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
            const msDay = (days) => days * 24 * 60 * 60000;
            //TODO: Roles de timpo
            if (member) {
                const tiempo = Math.floor(Date.now() - Number(member.joinedAt?.valueOf()));
                const tiempos = [
                    { condicion: tiempo >= msDay(30) && tiempo < msDay(60), rol: "975068365032947792" },
                    { condicion: tiempo >= msDay(60) && tiempo < msDay(90), rol: "975068396406329434" },
                    { condicion: tiempo >= msDay(90) && tiempo < msDay(120), rol: "975068402576154654" },
                    { condicion: tiempo >= msDay(120) && tiempo < msDay(150), rol: "975068408464949298" },
                    { condicion: tiempo >= msDay(150) && tiempo < msDay(180), rol: "975068418850050098" },
                    { condicion: tiempo >= msDay(180) && tiempo < msDay(210), rol: "975068424466214922" },
                    { condicion: tiempo >= msDay(210) && tiempo < msDay(240), rol: "975068413816868894" },
                    { condicion: tiempo >= msDay(240) && tiempo < msDay(270), rol: "975068429834915850" },
                    { condicion: tiempo >= msDay(270) && tiempo < msDay(300), rol: "975068435434319903" },
                    { condicion: tiempo >= msDay(300) && tiempo < msDay(330), rol: "975068435832770581" },
                    { condicion: tiempo >= msDay(330) && tiempo < msDay(360), rol: "975068441650274314" },
                    { condicion: tiempo >= msDay(360) && tiempo < msDay(547), rol: "975068449015480402" },
                    { condicion: tiempo >= msDay(547) && tiempo < msDay(730), rol: "975068458045825024" },
                    { condicion: tiempo >= msDay(730), rol: "975068463687139349" },
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
