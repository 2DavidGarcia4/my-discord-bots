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
const readyEvent = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + ' Estoy listo');
    const principalServer = client.guilds.cache.get('1028793496674500659');
    const server = client.guilds.cache.get(db_1.frogDb.serverId);
    const readyChannel = client.channels.cache.get('1053425705385467904');
    const ReadyEb = new discord_js_1.EmbedBuilder()
        .setTitle('✅ I am ready')
        .setColor('DarkGold')
        .setDescription('Connected again');
    if (!config_1.isDevelopment && (readyChannel === null || readyChannel === void 0 ? void 0 : readyChannel.type) == discord_js_1.ChannelType.GuildText) {
        readyChannel.sendTyping();
        setTimeout(() => readyChannel.send({ embeds: [ReadyEb] }), 2000);
    }
    // setGuildStatus(client)
    setInterval(() => {
        (0, functions_1.setGuildStatus)(client);
    }, 6 * 60 * 60 * 1000);
    [principalServer, server].forEach((sv) => __awaiter(void 0, void 0, void 0, function* () {
        interactionCreate_1.commands.forEach((cmd) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            if (!((_b = (yield (sv === null || sv === void 0 ? void 0 : sv.commands.fetch()))) === null || _b === void 0 ? void 0 : _b.some(s => s.name == cmd.name))) {
                sv === null || sv === void 0 ? void 0 : sv.commands.create(cmd).then(c => console.log(`Se creo el comando ${c.name}`));
            }
        }));
    }));
});
exports.readyEvent = readyEvent;
