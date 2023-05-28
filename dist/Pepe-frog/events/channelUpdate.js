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
exports.channelUpdateEvetn = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const channelUpdateEvetn = (oldChannel, newChannel, clien) => __awaiter(void 0, void 0, void 0, function* () {
    const { serverId, principalServerId } = db_1.frogDb;
    if (oldChannel.isDMBased() || newChannel.isDMBased() || oldChannel.guildId != serverId)
        return;
    const principalServer = clien.guilds.cache.get(principalServerId);
    const prinCategory = principalServer === null || principalServer === void 0 ? void 0 : principalServer.channels.cache.find(f => { var _a; return f.name == ((_a = newChannel.parent) === null || _a === void 0 ? void 0 : _a.name); });
    const prinChannel = principalServer === null || principalServer === void 0 ? void 0 : principalServer.channels.cache.find(f => f.name == oldChannel.name);
    if (prinChannel) {
        prinChannel.edit({
            name: newChannel.name,
            position: newChannel.position,
            parent: prinCategory === null || prinCategory === void 0 ? void 0 : prinCategory.id,
        });
        if (newChannel.type == discord_js_1.ChannelType.GuildText) {
            prinChannel.edit({ nsfw: newChannel.nsfw, topic: newChannel.topic });
        }
    }
});
exports.channelUpdateEvetn = channelUpdateEvetn;
