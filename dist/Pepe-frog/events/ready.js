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
const commands_1 = require("../commands");
const functions_2 = require("../../shared/functions");
// import { registerFont, createCanvas, loadImage } from "canvas";
// registerFont("tipo.otf", {family: 'MADE TOMMY'})
function readyEvent(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { serverId, principalServerId } = db_1.FrogDb;
        (0, functions_2.defaultReady)(client, '1053425705385467904', 'DarkGold');
        const principalServer = client.guilds.cache.get(principalServerId);
        const server = client.guilds.cache.get(serverId);
        const suggestionsChannel = server === null || server === void 0 ? void 0 : server.channels.cache.get('1053401642915082392');
        if ((suggestionsChannel === null || suggestionsChannel === void 0 ? void 0 : suggestionsChannel.type) == discord_js_1.ChannelType.GuildText)
            suggestionsChannel.messages.fetch({ limit: 100 });
        [principalServer, server].forEach((sv) => __awaiter(this, void 0, void 0, function* () {
            commands_1.CommandBodys.forEach((cmd) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!((_a = (yield (sv === null || sv === void 0 ? void 0 : sv.commands.fetch()))) === null || _a === void 0 ? void 0 : _a.some(s => s.name == cmd.name))) {
                    sv === null || sv === void 0 ? void 0 : sv.commands.create(cmd).then(c => console.log(`➕ Se creo el comando ${c.name} en el servidor ${sv.name}`));
                }
            }));
        }));
        (0, functions_1.handlePresences)(client);
        const statsChannel = server === null || server === void 0 ? void 0 : server.channels.cache.get('1053389468993851472');
        const sendStats = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            if ((statsChannel === null || statsChannel === void 0 ? void 0 : statsChannel.type) != discord_js_1.ChannelType.GuildText)
                return;
            const { topic } = statsChannel, nowTime = Date.now();
            if (topic) {
                const oldTime = parseInt(topic) + 24 * 60 * 60 * 1000;
                if ((oldTime - (60 * 60 * 1000)) < nowTime) {
                    const { joins, leaves } = db_1.FrogDb, members = joins - leaves;
                    const porcentMembers = Math.floor(members * 100 / joins);
                    let barr = '';
                    for (let i = 1; i <= 20; i++) {
                        if (i * 5 <= porcentMembers)
                            barr += '█';
                        else
                            barr += ' ';
                    }
                    db_1.FrogDb.joins = 0, db_1.FrogDb.leaves = 0;
                    statsChannel.edit({ topic: nowTime.toString() });
                    const StatsEb = new discord_js_1.EmbedBuilder()
                        .setTitle('Estadisticas diarias del servidor')
                        .setDescription(`Se unieron ${joins}, ${leaves} se fueron y ${members} se quedaron.\n\n**Miembros: ${porcentMembers}%**\n\`\`${barr}\`\``)
                        .setColor(((_b = server === null || server === void 0 ? void 0 : server.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
                    statsChannel.send({ embeds: [StatsEb] });
                }
            }
            else
                statsChannel.edit({ topic: nowTime.toString() });
        });
        sendStats();
        if (server === null || server === void 0 ? void 0 : server.members)
            (0, functions_1.autoChangeNicknames)(server.members.cache.map(m => m), client);
        (0, functions_1.inspectVerifieds)(client);
        setInterval(() => {
            (0, functions_1.handlePresences)(client);
            sendStats();
            (0, functions_1.inspectVerifieds)(client);
        }, 60 * 60000);
        (0, functions_1.setGuildStatus)(client);
        setInterval(() => {
            (0, functions_1.setGuildStatus)(client);
            if (server === null || server === void 0 ? void 0 : server.members)
                (0, functions_1.autoChangeNicknames)(server.members.cache.map(m => m), client);
        }, 6 * 60 * 60000);
    });
}
exports.readyEvent = readyEvent;
