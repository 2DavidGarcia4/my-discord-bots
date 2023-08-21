"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookClientByChannel = exports.transformTime = exports.handlePresences = exports.handlePreviewChannels = exports.autoChangeNicknames = exports.defaultInfoMessageBody = exports.getInfoMessage = exports.inspectVerifieds = exports.setGuildStatus = void 0;
const discord_js_1 = require("discord.js");
const data_1 = require("../data");
const config_1 = require("../../config");
const models_1 = require("../../models");
const notion_1 = require("./notion");
const getCategoryChannels = (id, server) => {
    return server?.channels.cache.filter(f => f.parentId == id).size.toLocaleString();
};
const setGuildStatus = (client) => {
    const snackServer = client.getGuildById(data_1.FrogDb.serverId);
    const online = snackServer?.members.cache.filter(f => f.presence?.status == 'dnd' || f.presence?.status == 'idle' || f.presence?.status == 'online' || f.presence?.status == 'invisible').size;
    const allMembers = snackServer?.memberCount, nsfwChannels = getCategoryChannels('1139599817568432292', snackServer);
    const vipChannels = getCategoryChannels('1139599819942400010', snackServer);
    const onlineName = `🟢│En linea: ${online?.toLocaleString()}`, membersName = `👥│Todos: ${allMembers?.toLocaleString()}`, nsfwName = `🔞│NSFW canales: ${nsfwChannels}`, vipName = `🌟│VIP canales: ${vipChannels}`;
    const onlineChanel = snackServer?.channels.cache.get('1140009074851852328');
    const membersChanel = snackServer?.channels.cache.get('1140009240195518534');
    const nsfwChanel = snackServer?.channels.cache.get('1140009285988913322');
    const vipCahnnel = snackServer?.channels.cache.get('1139600255206293545');
    if (onlineChanel?.name != onlineName)
        onlineChanel?.edit({ name: onlineName });
    if (membersChanel?.name != membersName)
        membersChanel?.edit({ name: membersName });
    if (nsfwChanel?.name != nsfwName)
        nsfwChanel?.edit({ name: nsfwName });
    if (vipCahnnel?.name != nsfwName)
        vipCahnnel?.edit({ name: vipName });
};
exports.setGuildStatus = setGuildStatus;
async function inspectVerifieds(client) {
    const VerifiedsData = await models_1.VerifiedsModel.find();
    const { channels } = await (0, notion_1.getSnackData)();
    const server = client.getGuildById(data_1.FrogDb.serverId);
    const channelLog = client.getChannelById(channels.verifiedLogs);
    for (let v of VerifiedsData) {
        const channel = client.getChannelById(v.channelId);
        const verifiedMember = server?.members.cache.get(v.userId);
        const day = 24 * 60 * 60000;
        if (verifiedMember) {
            if (channel?.type == discord_js_1.ChannelType.GuildText) {
                if ((!v.contentHidden) && v.lastActivityAt && v.lastActivityAt < Math.floor(Date.now() - (day * 30)))
                    await channel.permissionOverwrites.edit(data_1.FrogDb.serverId, { ReadMessageHistory: false }).then(ed => {
                        v.contentHidden = true;
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`Los miembro ya no pueden ver el contenido de tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **30** días.`)
                            .setColor('Blue');
                        if (channelLog?.isTextBased())
                            channelLog.send({ content: `<@${v.userId}>`, embeds: [VerifiedLog] });
                    });
                if ((!v.channelHidden) && v.lastActivityAt && v.lastActivityAt < Math.floor(Date.now() - (day * 40)))
                    await channel.permissionOverwrites.edit(data_1.FrogDb.serverId, { ViewChannel: false }).then(ed => {
                        v.channelHidden = true;
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`Los miembro ya no pueden ver tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **40** días.`)
                            .setColor('Orange');
                        if (channelLog?.isTextBased())
                            channelLog.send({ content: `<@${v.userId}>`, embeds: [VerifiedLog] });
                    });
                if (!v.ping) {
                    if (v.pinedAt && Math.floor(v.pinedAt + (data_1.FrogDb.verifiedsCooldown)) <= Date.now()) {
                        if (channel?.type == discord_js_1.ChannelType.GuildText)
                            channel.permissionOverwrites.edit(v.userId, { MentionEveryone: true });
                        v.ping = true;
                        const VerifiedLog = new discord_js_1.EmbedBuilder()
                            .setDescription(`Ya puedes utilizar ping en tu canal <#${v.channelId}>`)
                            .setColor('Green');
                        if (channelLog?.isTextBased())
                            channelLog.send({ content: `<@${v.userId}>`, embeds: [VerifiedLog] });
                    }
                }
            }
        }
        else {
            if (channel?.type == discord_js_1.ChannelType.GuildText)
                await channel.permissionOverwrites.edit(data_1.FrogDb.serverId, { ViewChannel: false }).then(async () => {
                    await v.deleteOne();
                    const VerifiedLog = new discord_js_1.EmbedBuilder()
                        .setDescription(`La verificada <@${v.userId}> no se encuentra en el servidor, ha sido eliminada de la base de datos y su canal ha sido cerrado.`)
                        .setColor('Red');
                    if (channelLog?.isTextBased())
                        channelLog.send({ content: `<@${v.userId}>`, embeds: [VerifiedLog] });
                });
        }
    }
}
exports.inspectVerifieds = inspectVerifieds;
const messagesIndexByLanguages = {
    es: 1,
    en: 0
};
async function getInfoMessage({ client, channelId, language }) {
    const channel = client.channels.cache.get(channelId);
    if (channel?.type == discord_js_1.ChannelType.GuildText) {
        const infoMessages = (await channel.messages.fetch({ limit: 6 })).map(m => m);
        let index = messagesIndexByLanguages[language];
        return infoMessages?.find((_, i) => i == index)?.content;
    }
}
exports.getInfoMessage = getInfoMessage;
function defaultInfoMessageBody(msg, { title, description, name, extraButtons }) {
    const RulesEb = new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: "you don't speak Spanish?, Click blue button below" })
        .setColor(msg.guild?.members.me?.displayHexColor || 'White');
    const RulesArb = new discord_js_1.ActionRowBuilder();
    if (extraButtons) {
        RulesArb.addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`en-${name}-btn`)
            .setEmoji('👅')
            .setLabel('English')
            .setStyle(discord_js_1.ButtonStyle.Primary), ...extraButtons);
    }
    else {
        RulesArb.addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`en-${name}-btn`)
            .setEmoji('👅')
            .setLabel('English')
            .setStyle(discord_js_1.ButtonStyle.Primary));
    }
    msg.channel.send({ embeds: [RulesEb], components: [RulesArb] });
}
exports.defaultInfoMessageBody = defaultInfoMessageBody;
function autoChangeNicknames(members, client) {
    const includes = ['!', '¡', '?', '¿'];
    let updatedMembers = 0;
    members.forEach(m => {
        if (m.nickname) {
            if (includes.some(s => m.nickname?.startsWith(s))) {
                m.edit({ nick: m.nickname.replace(/[!¡¿?]/, '').trim() }).then(mr => {
                    updatedMembers++;
                });
            }
        }
        else if (includes.some(s => m.user.username.startsWith(s))) {
            m.edit({ nick: m.user.username.replace(/[!¡¿?]/, '').trim() }).then(mr => {
                updatedMembers++;
            });
        }
    });
    if (updatedMembers) {
        const UpdatedMembersEb = new discord_js_1.EmbedBuilder()
            .setTitle('Update members nicknames')
            .setDescription(`**${updatedMembers}**`)
            .setColor('Blue');
        const channelLog = client.channels.cache.get('1139600309786775662');
        if (channelLog?.isTextBased())
            channelLog.send({ embeds: [UpdatedMembersEb] });
    }
}
exports.autoChangeNicknames = autoChangeNicknames;
function handlePreviewChannels(int) {
    const { guild, user, locale } = int;
    const inEnglish = locale == 'en-US';
    const author = guild?.members.cache.get(user.id);
    const VIPPreviewEb = new discord_js_1.EmbedBuilder()
        .setTitle('👁️ ' + (inEnglish ? 'Channels preview' : 'Vista previa de canales'));
    if (this.accessRoles.some(s => author?.roles.cache.has(s))) {
        VIPPreviewEb
            .setDescription(inEnglish ?
            `You already have access to all channels in this category, you have upgraded the server or you have paid for access.` :
            `Ya tienes acceso a todos los canales de esta categoría, has mejorado el servidor o has pagado por el acceso.`)
            .setColor('Blurple');
    }
    else if (author?.roles.cache.has(this.previewRol)) {
        VIPPreviewEb
            .setDescription(inEnglish ?
            `You already have channel preview enabled for this category.` :
            `Ya tienes habilitada la vista previa de canales de este acategoría.`)
            .setColor('Blurple');
    }
    else {
        author?.roles.add(this.previewRol).then(() => setTimeout(() => {
            if (guild?.members.cache.has(author.id))
                author.roles.remove(this.previewRol);
        }, 10 * 60000));
        VIPPreviewEb
            .setDescription(inEnglish ?
            `You have been enabled to preview channels for this category, you can only see the channels, not the content.` :
            `Se the ha habilitado la vista previa de canales para esta categoría, solo puedes ver los canales no el contenido.`)
            .setFooter({ text: inEnglish ?
                'The channel preview is disabled in 10 minutes' :
                'La vista previa de canales se te deshabilita en 10 minutos'
        })
            .setColor('Yellow');
    }
    int.reply({ ephemeral: true, embeds: [VIPPreviewEb] });
}
exports.handlePreviewChannels = handlePreviewChannels;
function handlePresences(client) {
    const NOW_TIME = new Date();
    const hourDiference = config_1.inDevelopment ? 0 : 6;
    let hour = NOW_TIME.getHours() - hourDiference;
    if (hour < 0)
        hour = 24 - (-hour);
    if (hour == 0 || hour < 6) {
        client.user?.setPresence({ status: 'invisible' });
    }
    else {
        const server = client.guilds.cache.get(data_1.FrogDb.serverId);
        const dayStates = [
            {
                name: 'moans',
                type: discord_js_1.ActivityType.Listening
            },
            {
                name: 'orgasms',
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: 'with the girls',
                type: discord_js_1.ActivityType.Playing
            },
            {
                name: server?.memberCount.toLocaleString() + ' members.',
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: 'vaginas',
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: 'boobs',
                type: discord_js_1.ActivityType.Watching
            },
            {
                name: 'ass',
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
        if (hour >= 16 && hour < 24) {
            client.user?.setPresence({ status: 'idle', activities: [nightStates[Math.floor(Math.random() * nightStates.length)]] });
        }
        else {
            client.user?.setPresence({ status: 'online', activities: [dayStates[Math.floor(Math.random() * dayStates.length)]] });
        }
    }
}
exports.handlePresences = handlePresences;
function transformTime(time) {
    return Math.floor(time / 1000);
}
exports.transformTime = transformTime;
async function getWebhookClientByChannel(channel) {
    const webhooks = await channel.fetchWebhooks();
    const firstWebhook = webhooks.first();
    if (firstWebhook) {
        const { url } = firstWebhook;
        return new discord_js_1.WebhookClient({ url });
    }
    else {
        const { url } = await channel.createWebhook({ name: 'snack' });
        return new discord_js_1.WebhookClient({ url });
    }
}
exports.getWebhookClientByChannel = getWebhookClientByChannel;
