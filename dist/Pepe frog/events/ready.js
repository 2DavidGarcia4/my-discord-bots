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
exports.readyEvent = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../utils/functions");
const db_1 = require("../db");
const config_1 = require("../../config");
const interactionCreate_1 = require("./interactionCreate");
const functions_2 = require("../../shared/functions");
const canvas_1 = require("canvas");
(0, canvas_1.registerFont)("tipo.otf", { family: 'MADE TOMMY' });
const readyEvent = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { serverId, principalServerId } = db_1.frogDb;
    console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + ' Estoy listo');
    const principalServer = client.guilds.cache.get(principalServerId);
    const server = client.guilds.cache.get(serverId);
    const readyChannel = client.channels.cache.get('1053425705385467904');
    const ReadyEb = new discord_js_1.EmbedBuilder()
        .setTitle('✅ I am ready')
        .setColor('DarkGold')
        .setDescription('Connected again');
    if (!config_1.isDevelopment && (readyChannel === null || readyChannel === void 0 ? void 0 : readyChannel.type) == discord_js_1.ChannelType.GuildText) {
        readyChannel.sendTyping();
        setTimeout(() => readyChannel.send({ embeds: [ReadyEb] }), 2000);
    }
    const logos = client.channels.cache.get('1064289166462042137');
    let imagen = "https://media.discordapp.net/attachments/1064289166462042137/1067870216157147156/banner_2023-01.jpg?width=468&height=468";
    const canvas = (0, canvas_1.createCanvas)(1000, 1000);
    const fondo = yield (0, canvas_1.loadImage)(imagen);
    const context = canvas.getContext("2d");
    context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    // context.strokeStyle = "#000000";
    // context.strokeRect(0,0, canvas.width, canvas.height);
    // context.textAlign = "center"
    context.font = "10px MADE TOMMY";
    context.fillStyle = "#ffffff";
    context.fillText("David200409", 20, 980);
    const finalImg = new discord_js_1.AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });
    // if(logos?.isTextBased()) logos.send({files: [finalImg]})
    const suggestionsChannel = server === null || server === void 0 ? void 0 : server.channels.cache.get('1053401642915082392');
    if ((suggestionsChannel === null || suggestionsChannel === void 0 ? void 0 : suggestionsChannel.type) == discord_js_1.ChannelType.GuildText)
        suggestionsChannel.messages.fetch({ limit: 100 });
    [principalServer, server].forEach((sv) => __awaiter(void 0, void 0, void 0, function* () {
        interactionCreate_1.commands.forEach((cmd) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            if (!((_b = (yield (sv === null || sv === void 0 ? void 0 : sv.commands.fetch()))) === null || _b === void 0 ? void 0 : _b.some(s => s.name == cmd.name))) {
                sv === null || sv === void 0 ? void 0 : sv.commands.create(cmd).then(c => console.log(`Se creo el comando ${c.name}`));
            }
        }));
    }));
    const dayStates = [
        {
            name: "moans",
            type: discord_js_1.ActivityType.Listening
        },
        {
            name: "orgasms",
            type: discord_js_1.ActivityType.Watching
        },
        {
            name: "with the girls",
            type: discord_js_1.ActivityType.Playing
        },
        {
            name: (server === null || server === void 0 ? void 0 : server.memberCount.toLocaleString()) + " members.",
            type: discord_js_1.ActivityType.Watching
        },
        {
            name: "vaginas",
            type: discord_js_1.ActivityType.Watching
        },
        {
            name: "boobs",
            type: discord_js_1.ActivityType.Watching
        },
        {
            name: "ass",
            type: discord_js_1.ActivityType.Watching
        },
    ];
    const nightStates = [
        {
            name: `naked women.`,
            type: discord_js_1.ActivityType.Watching
        },
        {
            name: `moans.`,
            type: discord_js_1.ActivityType.Listening
        },
        {
            name: 'the beauty of women',
            type: discord_js_1.ActivityType.Watching
        }
    ];
    (0, functions_2.presences)(dayStates, nightStates, client);
    const statsChannel = server === null || server === void 0 ? void 0 : server.channels.cache.get('1053389468993851472');
    const sendStats = () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if ((statsChannel === null || statsChannel === void 0 ? void 0 : statsChannel.type) != discord_js_1.ChannelType.GuildText)
            return;
        const { topic } = statsChannel, nowTime = Date.now();
        if (topic) {
            const oldTime = parseInt(topic) + 24 * 60 * 60 * 1000;
            if ((oldTime - (60 * 60 * 1000)) < nowTime) {
                const { joins, leaves } = db_1.frogDb, members = joins - leaves;
                const porcentMembers = Math.floor(members * 100 / joins);
                let barr = '';
                for (let i = 1; i <= 20; i++) {
                    if (i * 5 <= porcentMembers)
                        barr += '█';
                    else
                        barr += ' ';
                }
                db_1.frogDb.joins = 0, db_1.frogDb.leaves = 0;
                statsChannel.edit({ topic: nowTime.toString() });
                const StatsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('Estadisticas diarias del servidor')
                    .setDescription(`Se unieron ${joins}, ${leaves} se fueron y ${members} se quedaron.\n\n**Miembros: ${porcentMembers}%**\n\`\`${barr}\`\``)
                    .setColor(((_c = server === null || server === void 0 ? void 0 : server.members.me) === null || _c === void 0 ? void 0 : _c.displayHexColor) || 'White');
                statsChannel.send({ embeds: [StatsEb] });
            }
        }
        else
            statsChannel.edit({ topic: nowTime.toString() });
    });
    sendStats();
    setInterval(() => {
        (0, functions_2.presences)(dayStates, nightStates, client);
        sendStats();
    }, 60 * 60000);
    (0, functions_1.setGuildStatus)(client);
    setInterval(() => {
        (0, functions_1.setGuildStatus)(client);
    }, 6 * 60 * 60000);
});
exports.readyEvent = readyEvent;
