"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberAddEvent = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const db_1 = require("../db");
// import { registerFont, createCanvas, loadImage } from "canvas";
const utils_1 = require("../utils");
// registerFont("tipo.otf", {family: 'MADE TOMMY'})
const memberAddEvent = async (gmd, client) => {
    if (gmd.guild.id != db_1.botDB.serverId)
        return;
    __1.svStatistics.joins++;
    const { color, emoji, serverId, creatorId, mainRoles } = db_1.botDB;
    const dataBot = await (0, utils_1.getBotData)(client);
    if (!dataBot)
        return;
    const welcomeLog = client.channels.cache.get(dataBot.logs.entry);
    if (gmd.user.bot) {
        const botEb = new discord_js_1.EmbedBuilder();
        if (!gmd.user.flags?.has('VerifiedBot')) {
            gmd.kick("Razon: Bot no verificado.");
            botEb
                .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
                .setTitle("Anti bots no verificados")
                .setDescription(`Se ha expulsado un bot no verificado que ha entrado en ${gmd.guild.name}`)
                .setColor(gmd.guild?.members.me?.displayHexColor || 'White')
                .setFooter({ text: gmd.guild?.name || 'undefined', iconURL: gmd.guild?.iconURL() || undefined })
                .setTimestamp();
            client.users.cache.get(creatorId)?.send({ embeds: [botEb] });
        }
        else {
            botEb
                .setTitle("🤖 Se unio un bot")
                .setThumbnail(gmd.displayAvatarURL())
                .setDescription(`${gmd}\n${gmd.user.tag}\nCreado <t:${Math.floor(gmd.user.createdAt.valueOf() / 1000)}:R>`)
                .setColor("#0084EC")
                .setTimestamp();
            if (welcomeLog?.type == discord_js_1.ChannelType.GuildText)
                welcomeLog.send({ embeds: [botEb] });
        }
    }
    else {
        const usBanner = await client.users.fetch(gmd.id, { force: true });
        const welcomeChannel = client.channels.cache.get(dataBot.logs.welcome);
        if (welcomeChannel?.type != discord_js_1.ChannelType.GuildText)
            return;
        welcomeChannel.sendTyping();
        let webhook = (await welcomeChannel.fetchWebhooks()).find(f => f.owner?.id == client.user?.id);
        if (!webhook)
            webhook = await welcomeChannel.createWebhook({ name: 'Welcome', avatar: 'https://cdn-icons-png.flaticon.com/512/5167/5167400.png', reason: 'Para las bienvenidas.' });
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
            .setColor(gmd.guild.members.me?.displayHexColor || 'White')
            .setFooter({ text: `Bienvenido/a a ${gmd.guild.name}`, iconURL: gmd.guild.iconURL() || undefined })
            .setTimestamp();
        const embBien = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL() })
            .setThumbnail(gmd.user.displayAvatarURL({ size: 4096 }))
            .setImage(usBanner?.bannerURL({ size: 4096 }) || null)
            .setTitle("📥 Se unió un usuario")
            .setDescription(`Se unió ${gmd}.\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`)
            .setColor(color.afirmative)
            .setFooter({ text: gmd.guild.name, iconURL: gmd.guild.iconURL() || undefined })
            .setTimestamp();
        // console.log('nuevo miembro')
        // welcomeMsg.send({embeds: [embBienvenida], files: [finalImg], content: `**¡Hola ${gmd}!**`})
        // .then(()=> console.log('send webhook'))
        if (welcomeLog?.type == discord_js_1.ChannelType.GuildText)
            welcomeLog.send({ embeds: [embBien] });
        gmd.roles.add(mainRoles);
    }
};
exports.memberAddEvent = memberAddEvent;
