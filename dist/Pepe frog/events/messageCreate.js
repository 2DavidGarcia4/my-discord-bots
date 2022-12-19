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
exports.messageCreateEvent = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const eval_1 = require("../commands/text/eval");
const roles_1 = require("../commands/text/roles");
const rules_1 = require("../commands/text/rules");
const girls_1 = require("../commands/text/girls");
const messageCreateEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { prefix, serverId, principalServerId } = db_1.frogDb;
    if (msg.guildId == principalServerId) {
        if (msg.channel.type != discord_js_1.ChannelType.GuildText)
            return;
        const { parentId } = msg.channel;
        if (['1028793497295261828', '1054489737097908364'].some(s => s == parentId)) {
            const server = client.guilds.cache.get(serverId), channelName = msg.channel.name, serverChannel = server === null || server === void 0 ? void 0 : server.channels.cache.find(f => f.name == channelName);
            if ((serverChannel === null || serverChannel === void 0 ? void 0 : serverChannel.type) == discord_js_1.ChannelType.GuildText)
                serverChannel.send({ content: msg.content || ' ', files: msg.attachments.map(m => m) });
        }
    }
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.permissions.has('Administrator')) {
        if (command == 'eval')
            (0, eval_1.evalCommand)(msg, client, args.join(' '));
        if (command == 'rules')
            (0, rules_1.rulesCommand)(msg);
        if (command == 'roles')
            (0, roles_1.rolesCommand)(msg);
        if (command == 'girls')
            (0, girls_1.girlsCommand)(msg);
    }
});
exports.messageCreateEvent = messageCreateEvent;
