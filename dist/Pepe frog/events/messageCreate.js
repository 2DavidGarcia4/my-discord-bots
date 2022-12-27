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
exports.messageCreateEvent = exports.modDb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const eval_1 = require("../commands/text/eval");
const roles_1 = require("../commands/text/roles");
const rules_1 = require("../commands/text/rules");
const girls_1 = require("../commands/text/girls");
exports.modDb = [];
const sanctions = [
    {
        time: 4 * 60 * 60 * 1000,
        warns: 3
    },
    {
        time: 8 * 60 * 60 * 1000,
        warns: 4
    },
    {
        time: 16 * 60 * 60 * 1000,
        warns: 5
    },
    {
        time: 24 * 60 * 60 * 1000,
        warns: 6
    },
    {
        time: 48 * 60 * 60 * 1000,
        warns: 7
    },
];
const messageCreateEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { prefix, serverId, principalServerId } = db_1.frogDb;
    if (((_a = msg.mentions.roles.first()) === null || _a === void 0 ? void 0 : _a.id) == '1053411182935023657')
        msg.react('1053444752340680817');
    if (msg.author.bot)
        return;
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
    if (msg.guildId == serverId) {
        //? Auto moderation
        const enlaceActivators = ['http://', 'https://'];
        const filesSinks = ['png', 'jpg', 'gif', 'jpeg', 'mov', 'mp4', 'mp3'];
        if (!msg.author.bot && !((_b = msg.member) === null || _b === void 0 ? void 0 : _b.permissions.has('Administrator')) && enlaceActivators.some(s => msg.content.includes(s))) {
            const texts = msg.content.split(/ +/g).map(m => m.includes('\n') ? m.split('\n') : m).flat();
            const filter = texts.filter(f => enlaceActivators.some(s => f.includes(s)));
            if (filter.some(f => !filesSinks.some(s => f.endsWith('.' + s)))) {
                const AutoModEb = new discord_js_1.EmbedBuilder()
                    .setTitle('Auto moderation')
                    .setDescription('Only links to images, videos and gifs are allowed.')
                    .setColor('Red');
                msg.reply({ embeds: [AutoModEb] }).then(re => {
                    msg.delete();
                    setTimeout(() => re.delete(), 10000);
                });
                const member = exports.modDb.find(f => f.id == msg.author.id);
                if (member) {
                    member.warns++;
                    if (member.warns >= 7) {
                        (_c = msg.member) === null || _c === void 0 ? void 0 : _c.roles.add('1053430826823594106');
                    }
                    sanctions.forEach(sanction => {
                        var _a;
                        if (sanction.warns == member.warns) {
                            (_a = msg.member) === null || _a === void 0 ? void 0 : _a.timeout(sanction.time, `Auto moderation of links, ${sanction.warns} warns`);
                        }
                    });
                }
                else {
                    exports.modDb.push({ id: msg.author.id, warns: 1 });
                }
            }
        }
        if (msg.channel.type != discord_js_1.ChannelType.GuildText)
            return;
        const { parentId } = msg.channel;
        if (msg.attachments.size && parentId != '1054485238413266965') {
            const principalServer = client.guilds.cache.get(principalServerId), channelName = msg.channel.name, serverChannel = principalServer === null || principalServer === void 0 ? void 0 : principalServer.channels.cache.find(f => f.name == channelName);
            if ((serverChannel === null || serverChannel === void 0 ? void 0 : serverChannel.type) == discord_js_1.ChannelType.GuildText)
                serverChannel.send({ content: `${msg.author} | \`\`${msg.author.id}\`\``, files: msg.attachments.map(m => m) });
        }
    }
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = (_d = args.shift()) === null || _d === void 0 ? void 0 : _d.toLowerCase();
    if ((_e = msg.member) === null || _e === void 0 ? void 0 : _e.permissions.has('Administrator')) {
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
