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
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberAddEvent = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const db_1 = require("../db");
const models_1 = require("../models");
const canvas_1 = require("canvas");
(0, canvas_1.registerFont)("tipo.otf", { family: 'MADE TOMMY' });
const memberAddEvent = (gmd, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (gmd.guild.id != db_1.botDB.serverId)
        return;
    __1.estadisticas.entradas++;
    const { color, emoji, serverId, creatorId, mainRoles } = db_1.botDB;
    const dataBot = yield models_1.botModel.findById((_a = client.user) === null || _a === void 0 ? void 0 : _a.id), dataInv = yield models_1.invitesModel.findById(serverId), arrayMi = dataInv === null || dataInv === void 0 ? void 0 : dataInv.miembros;
    if (!dataBot)
        return;
    const welcomeLog = client.channels.cache.get(dataBot.logs.entry);
    if (gmd.user.bot) {
        const botEb = new discord_js_1.EmbedBuilder();
        if (!((_b = gmd.user.flags) === null || _b === void 0 ? void 0 : _b.has('VerifiedBot'))) {
            gmd.kick("Razon: Bot no verificado.");
            botEb
                .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
                .setTitle("Anti bots no verificados")
                .setDescription(`Se ha expulsado un bot no verificado que ha entrado en ${gmd.guild.name}`)
                .setColor(((_d = (_c = gmd.guild) === null || _c === void 0 ? void 0 : _c.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White')
                .setFooter({ text: ((_e = gmd.guild) === null || _e === void 0 ? void 0 : _e.name) || 'undefined', iconURL: ((_f = gmd.guild) === null || _f === void 0 ? void 0 : _f.iconURL()) || undefined })
                .setTimestamp();
            (_g = client.users.cache.get(creatorId)) === null || _g === void 0 ? void 0 : _g.send({ embeds: [botEb] });
        }
        else {
            botEb
                .setTitle("🤖 Se unio un bot")
                .setThumbnail(gmd.displayAvatarURL())
                .setDescription(`${gmd}\n${gmd.user.tag}\nCreado <t:${Math.floor(gmd.user.createdAt.valueOf() / 1000)}:R>`)
                .setColor("#0084EC")
                .setTimestamp();
            if ((welcomeLog === null || welcomeLog === void 0 ? void 0 : welcomeLog.type) == discord_js_1.ChannelType.GuildText)
                welcomeLog.send({ embeds: [botEb] });
        }
    }
    else {
        const usBanner = yield client.users.fetch(gmd.id, { force: true });
        const welcomeChannel = client.channels.cache.get(dataBot.logs.welcome);
        if ((welcomeChannel === null || welcomeChannel === void 0 ? void 0 : welcomeChannel.type) != discord_js_1.ChannelType.GuildText)
            return;
        welcomeChannel.sendTyping();
        let webhook = (yield welcomeChannel.fetchWebhooks()).find(f => { var _a, _b; return ((_a = f.owner) === null || _a === void 0 ? void 0 : _a.id) == ((_b = client.user) === null || _b === void 0 ? void 0 : _b.id); });
        if (!webhook)
            webhook = yield welcomeChannel.createWebhook({ name: 'Welcome', avatar: 'https://cdn-icons-png.flaticon.com/512/5167/5167400.png', reason: 'Para las bienvenidas.' });
        const welcomeMsg = new discord_js_1.WebhookClient({ url: webhook.url });
        let imagen = "https://cdn.discordapp.com/attachments/901313790765854720/902607815359758356/fondoBienv.png";
        const canvas = (0, canvas_1.createCanvas)(1000, 500);
        const fondo = yield (0, canvas_1.loadImage)(imagen);
        const context = canvas.getContext("2d");
        context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#000000";
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(500, 160, 145, 0, Math.PI * 2, true);
        context.fillStyle = `${(_h = gmd.guild.members.me) === null || _h === void 0 ? void 0 : _h.displayHexColor}`;
        context.stroke();
        context.fill();
        context.textAlign = "center";
        context.font = "80px MADE TOMMY";
        context.fillStyle = "#ffffff";
        context.fillText("Bienvenid@", 500, 375);
        context.font = '45px MADE TOMMY';
        context.fillStyle = '#ffffff';
        context.fillText(`${gmd.user.tag}`, 500, 435);
        context.font = '38px MADE TOMMY';
        context.fillStyle = '#ffffff';
        context.fillText(`disfruta del servidor`, 500, 480);
        context.beginPath();
        context.arc(500, 160, 140, 0, Math.PI * 2, true);
        context.fillStyle = `${(_j = gmd.guild.members.me) === null || _j === void 0 ? void 0 : _j.displayHexColor}`;
        context.closePath();
        context.clip();
        const avatar = yield (0, canvas_1.loadImage)(gmd.displayAvatarURL({ size: 2048, extension: 'png' }));
        context.drawImage(avatar, 360, 20, 280, 280);
        const finalImg = new discord_js_1.AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });
        const embBienvenida = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
            .setImage(`attachment://welcome.png`)
            .setTitle("👋 ¡Bienvenido/a!")
            .setDescription(`*No se por quien has sido invitado.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
            .setColor(((_k = gmd.guild.members.me) === null || _k === void 0 ? void 0 : _k.displayHexColor) || 'White')
            .setFooter({ text: `Bienvenido/a a ${gmd.guild.name}`, iconURL: gmd.guild.iconURL() || undefined })
            .setTimestamp();
        const embBien = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
            .setThumbnail(gmd.user.displayAvatarURL({ size: 4096 }))
            .setImage((usBanner === null || usBanner === void 0 ? void 0 : usBanner.bannerURL({ size: 4096 })) || null)
            .setTitle("📥 Se unió un usuario")
            .setDescription(`Se unió ${gmd} *(no se por quien fue invitado/a)*.\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`)
            .setColor(color.negative)
            .setFooter({ text: gmd.guild.name, iconURL: gmd.guild.iconURL() || undefined })
            .setTimestamp();
        yield gmd.guild.invites.fetch().then((invites) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log(invites.map(m => `${m.code} || ${m.uses}`))
            if (!arrayMi)
                return;
            const invitacion = invites.find(f => { var _a, _b, _c; return ((_a = arrayMi.find(fm => fm.id == f.inviterId)) === null || _a === void 0 ? void 0 : _a.codes.find(fc => fc.code == f.code)) ? (((_c = (_b = arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.find(fm => fm.id == f.inviterId)) === null || _b === void 0 ? void 0 : _b.codes.find(fc => fc.code == f.code)) === null || _c === void 0 ? void 0 : _c.usos) || 0) < (f.uses || 0) : false; });
            // console.log(invitacion)
            let miembro = arrayMi.find(f => f.id == (invitacion === null || invitacion === void 0 ? void 0 : invitacion.inviterId));
            if (miembro) {
                if (miembro.codes.some(s => s.code == (invitacion === null || invitacion === void 0 ? void 0 : invitacion.code))) {
                    let invite = miembro.codes.find(f => f.code == (invitacion === null || invitacion === void 0 ? void 0 : invitacion.code));
                    if (!(invitacion === null || invitacion === void 0 ? void 0 : invitacion.uses) || !invite)
                        return;
                    if ((invitacion === null || invitacion === void 0 ? void 0 : invitacion.uses) > (invite === null || invite === void 0 ? void 0 : invite.usos)) {
                        if (miembro.id == gmd.user.id) {
                            miembro.falsas++;
                            embBienvenida.setDescription(`*Has sido invitado/a por ti mismo con una invitación creada por ti.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`);
                            embBien.data.description = `Se unió ${gmd} *ha sido invitado/a por el mismo con una invitación suya.*\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`;
                        }
                        else {
                            miembro.verdaderas++;
                            if (miembro.invitados.some(s => s.id == gmd.user.id)) {
                                let invitado = miembro.invitados.find(f => f.id == gmd.user.id);
                                if (invitado === null || invitado === void 0 ? void 0 : invitado.miembro)
                                    invitado.miembro = true;
                            }
                            else {
                                miembro.invitados.push({ id: gmd.user.id, tag: gmd.user.tag, miembro: true });
                            }
                            const miembroSV = gmd.guild.members.cache.get(invitacion.inviterId || '');
                            const channelLog = client.channels.cache.get(dataBot.logs.bot);
                            if (miembroSV && !miembroSV.user.bot) {
                                const rolVIPEb = new discord_js_1.EmbedBuilder()
                                    .setThumbnail(miembroSV.displayAvatarURL({ size: 1024 }))
                                    .setTitle("➕ Rol agregado a miembro")
                                    .setColor(color.afirmative)
                                    .setTimestamp();
                                if (!miembroSV.roles.cache.has(dataInv.datos.roles[0].id) && miembro.verdaderas >= 10) {
                                    miembroSV.roles.add(dataInv.datos.roles[0].id);
                                    rolVIPEb
                                        .setDescription(`Le he agregado el rol <@&${dataInv.datos.roles[0].id}> a <@${miembroSV.id}> ya que ha invitado a **${dataInv.datos.roles[0].invitaciones}** miembros.`);
                                    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
                                        channelLog.send({ embeds: [rolVIPEb] });
                                }
                                if (!miembroSV.roles.cache.has(dataInv.datos.roles[1].id) && miembro.verdaderas >= 20) {
                                    miembroSV.roles.add(dataInv.datos.roles[1].id);
                                    rolVIPEb
                                        .setDescription(`Le he agregado el rol <@&${dataInv.datos.roles[1].id}> a <@${miembroSV.id}> ya que ha invitado a **${dataInv.datos.roles[1].invitaciones}** miembros.`);
                                    if ((channelLog === null || channelLog === void 0 ? void 0 : channelLog.type) == discord_js_1.ChannelType.GuildText)
                                        channelLog.send({ embeds: [rolVIPEb] });
                                }
                            }
                            embBienvenida.setDescription(`*Has sido invitado/a por <@${miembro.id}> quien ahora tiene **${miembro.verdaderas.toLocaleString()}** ${miembro.verdaderas == 1 ? "invitación" : "invitaciones"}.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`);
                            embBien.data.description = `Se unió ${gmd} *ha sido invitado/a por <@${miembro.id}> quien ahora tiene **${miembro.verdaderas.toLocaleString()}** ${miembro.verdaderas == 1 ? "invitación" : "invitaciones"}.*\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`;
                        }
                        miembro.totales++;
                        if (invite.usos)
                            invite.usos = invitacion.uses;
                    }
                }
            }
        }));
        console.log('nuevo miembro');
        welcomeMsg.send({ embeds: [embBienvenida], files: [finalImg], content: `**¡Hola ${gmd}!**` }).then(() => console.log('send webhook'));
        if ((welcomeLog === null || welcomeLog === void 0 ? void 0 : welcomeLog.type) == discord_js_1.ChannelType.GuildText)
            welcomeLog.send({ embeds: [embBien] });
        let miembroInv = arrayMi === null || arrayMi === void 0 ? void 0 : arrayMi.find(f => f.id == gmd.user.id);
        if (miembroInv)
            miembroInv.tiempo = null;
        yield models_1.invitesModel.findByIdAndUpdate(serverId, { miembros: arrayMi });
        gmd.roles.add(mainRoles);
    }
});
exports.memberAddEvent = memberAddEvent;
