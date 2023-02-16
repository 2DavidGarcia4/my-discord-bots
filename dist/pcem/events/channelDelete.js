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
exports.channelDeleteEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const channelDeleteEvent = (cd, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (cd.type == discord_js_1.ChannelType.DM)
        return;
    if (cd.guildId != db_1.botDB.serverId)
        return;
});
exports.channelDeleteEvent = channelDeleteEvent;
