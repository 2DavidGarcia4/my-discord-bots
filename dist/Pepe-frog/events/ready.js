"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = exports.once = void 0;
const discord_js_1 = require("discord.js");
const services_1 = require("../lib/services");
const functions_1 = require("../../shared/functions");
const notion_1 = require("../lib/notion");
exports.once = true;
exports.name = 'ready';
async function execute(client) {
    const { serverId, backupServerId, publishingServerId } = client.data;
    const SnackData = await (0, notion_1.getSnackData)();
    // console.log(SnackData)
    (0, functions_1.defaultReady)(client, SnackData.channels.ready, 'DarkGold');
    const server = client.guilds.cache.get(serverId);
    const backupServer = client.guilds.cache.get(backupServerId);
    const publishedServer = client.guilds.cache.get(publishingServerId);
    const allServers = [server, backupServer, publishedServer];
    client.data.serverIconUrl = server?.iconURL() || '';
    const suggestionsChannel = server?.channels.cache.get(SnackData.channels.suggestions);
    if (suggestionsChannel?.type == discord_js_1.ChannelType.GuildText)
        suggestionsChannel.messages.fetch({ limit: 100 });
    allServers.forEach(async (sv) => {
        [...client.slashCommands.map(sc => sc), ...client.contextCommands.map(cc => cc)].forEach(async (cmd) => {
            if (cmd.guildsIds.some(id => id == sv?.id)) {
                if (!(await sv?.commands.fetch())?.some(s => s.name == cmd.struct.name)) {
                    sv?.commands.create(cmd.struct).then(c => console.log(`➕ Se creo el comando ${c.name} en el servidor ${sv.name}`));
                }
            }
        });
    });
    (0, services_1.handlePresences)(client);
    const statsChannel = server?.channels.cache.get(SnackData.channels.stats);
    const sendStats = async () => {
        if (statsChannel?.type != discord_js_1.ChannelType.GuildText)
            return;
        const { topic } = statsChannel, nowTime = Date.now();
        if (topic) {
            const oldTime = parseInt(topic) + 24 * 60 * 60 * 1000;
            if ((oldTime - (60 * 60 * 1000)) < nowTime) {
                const { joins, leaves } = client.data, members = joins - leaves;
                const porcentMembers = Math.floor(members * 100 / joins);
                let barr = '';
                for (let i = 1; i <= 20; i++) {
                    if (i * 5 <= porcentMembers)
                        barr += '█';
                    else
                        barr += ' ';
                }
                client.data.joins = 0, client.data.leaves = 0;
                statsChannel.edit({ topic: nowTime.toString() });
                const StatsEb = new discord_js_1.EmbedBuilder()
                    .setTitle('Estadisticas diarias del servidor')
                    .setDescription(`Se unieron ${joins}, ${leaves} se fueron y ${members} se quedaron.\n\n**Miembros: ${porcentMembers}%**\n\`\`${barr}\`\``)
                    .setColor(server?.members.me?.displayHexColor || 'White');
                statsChannel.send({ embeds: [StatsEb] });
            }
        }
        else
            statsChannel.edit({ topic: nowTime.toString() });
    };
    sendStats();
    if (server?.members)
        (0, services_1.autoChangeNicknames)(server.members.cache.map(m => m), client);
    (0, services_1.inspectVerifieds)(client);
    setInterval(() => {
        (0, services_1.handlePresences)(client);
        sendStats();
        (0, services_1.inspectVerifieds)(client);
    }, 60 * 60000);
    (0, services_1.setGuildStatus)(client);
    setInterval(() => {
        (0, services_1.setGuildStatus)(client);
        if (server?.members)
            (0, services_1.autoChangeNicknames)(server.members.cache.map(m => m), client);
    }, 6 * 60 * 60000);
}
exports.execute = execute;
