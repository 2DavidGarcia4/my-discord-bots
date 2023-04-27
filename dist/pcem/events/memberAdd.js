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
// import { registerFont, createCanvas, loadImage } from "canvas";
const utils_1 = require("../utils");
// registerFont("tipo.otf", {family: 'MADE TOMMY'})
const memberAddEvent = (gmd, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (gmd.guild.id != db_1.botDB.serverId)
        return;
    __1.svStatistics.joins++;
    const { color, emoji, serverId, creatorId, mainRoles } = db_1.botDB;
    const dataBot = yield (0, utils_1.getBotData)(client);
    if (!dataBot)
        return;
    const welcomeLog = client.channels.cache.get(dataBot.logs.entry);
    if (gmd.user.bot) {
        const botEb = new discord_js_1.EmbedBuilder();
        if (!((_a = gmd.user.flags) === null || _a === void 0 ? void 0 : _a.has('VerifiedBot'))) {
            gmd.kick("Razon: Bot no verificado.");
            botEb
                .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
                .setTitle("Anti bots no verificados")
                .setDescription(`Se ha expulsado un bot no verificado que ha entrado en ${gmd.guild.name}`)
                .setColor(((_c = (_b = gmd.guild) === null || _b === void 0 ? void 0 : _b.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White')
                .setFooter({ text: ((_d = gmd.guild) === null || _d === void 0 ? void 0 : _d.name) || 'undefined', iconURL: ((_e = gmd.guild) === null || _e === void 0 ? void 0 : _e.iconURL()) || undefined })
                .setTimestamp();
            (_f = client.users.cache.get(creatorId)) === null || _f === void 0 ? void 0 : _f.send({ embeds: [botEb] });
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
        // let imagen = "https://cdn.discordapp.com/attachments/901313790765854720/902607815359758356/fondoBienv.png"
        // const canvas = createCanvas(1000, 500);
        // const fondo = await loadImage(imagen);
        // const context = canvas.getContext("2d");
        // context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        // context.strokeStyle = "#000000";
        // context.strokeRect(0,0, canvas.width, canvas.height);
        // context.beginPath();
        // context.arc(500, 160, 145, 0, Math.PI * 2, true);
        // context.fillStyle = `${gmd.guild.members.me?.displayHexColor}`;
        // context.stroke();
        // context.fill();
        // context.textAlign = "center"
        // context.font = "80px MADE TOMMY"
        // context.fillStyle = "#ffffff"
        // context.fillText("Bienvenid@", 500, 375)
        // context.font = '45px MADE TOMMY';
        // context.fillStyle = '#ffffff';
        // context.fillText(`${gmd.user.tag}`, 500, 435);
        // context.font = '38px MADE TOMMY'
        // context.fillStyle = '#ffffff';
        // context.fillText(`disfruta del servidor`, 500, 480);
        // context.beginPath();
        // context.arc(500, 160, 140, 0, Math.PI * 2, true);
        // context.fillStyle = `${gmd.guild.members.me?.displayHexColor}`;
        // context.closePath();
        // context.clip();
        // const avatar = await loadImage(gmd.displayAvatarURL({size: 2048, extension: 'png'}))
        // context.drawImage(avatar, 360, 20, 280, 280);
        // const finalImg = new AttachmentBuilder(canvas.toBuffer(), {name: 'welcome.png'})
        const embBienvenida = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
            .setImage(`attachment://welcome.png`)
            .setTitle("👋 ¡Bienvenido/a!")
            .setDescription(`*No se por quien has sido invitado.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
            .setColor(((_g = gmd.guild.members.me) === null || _g === void 0 ? void 0 : _g.displayHexColor) || 'White')
            .setFooter({ text: `Bienvenido/a a ${gmd.guild.name}`, iconURL: gmd.guild.iconURL() || undefined })
            .setTimestamp();
        const embBien = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
            .setThumbnail(gmd.user.displayAvatarURL({ size: 4096 }))
            .setImage((usBanner === null || usBanner === void 0 ? void 0 : usBanner.bannerURL({ size: 4096 })) || null)
            .setTitle("📥 Se unió un usuario")
            .setDescription(`Se unió ${gmd}.\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`)
            .setColor(color.afirmative)
            .setFooter({ text: gmd.guild.name, iconURL: gmd.guild.iconURL() || undefined })
            .setTimestamp();
        // console.log('nuevo miembro')
        // welcomeMsg.send({embeds: [embBienvenida], files: [finalImg], content: `**¡Hola ${gmd}!**`})
        // .then(()=> console.log('send webhook'))
        if ((welcomeLog === null || welcomeLog === void 0 ? void 0 : welcomeLog.type) == discord_js_1.ChannelType.GuildText)
            welcomeLog.send({ embeds: [embBien] });
        gmd.roles.add(mainRoles);
    }
});
exports.memberAddEvent = memberAddEvent;
