"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAutomaticContent = void 0;
const discord_js_1 = require("discord.js");
const channels = {
    martine: '1139600091829776498',
    onlyNudes: '1139600102445551646'
};
const categories = {
    martine: '949861762902138941',
    onlyNudes: '1141075333374804059'
};
const autoContentServerId = '949861760096145438';
async function ManageAutomaticContent(msg, client) {
    const { channelId, content } = msg;
    if (![channels.martine, channels.onlyNudes].some(s => s == channelId))
        return;
    const getAndSendContent = async (contentUrl, channel) => {
        if (contentUrl.slice(contentUrl.length - 7, contentUrl.length).includes('.')) {
            const response = await fetch(contentUrl);
            const imageBufer = await response.arrayBuffer();
            const bufer = Buffer.from(imageBufer);
            const MBs = (bufer.length / 1048576).toFixed(2);
            channel.send({ content: `**MB:** ${MBs}`, files: [bufer] });
        }
        else {
            channel.send({ content: `**Video:** ${contentUrl}` });
        }
    };
    const handleSendContent = (categoryId, categoryName, contentUrl) => {
        const autoContentServer = client.getGuildById(autoContentServerId);
        const martineChannel = autoContentServer?.channels.cache.find(f => f.parentId == categoryId && f.name == categoryName);
        if (martineChannel?.type == discord_js_1.ChannelType.GuildText) {
            getAndSendContent(contentUrl, martineChannel);
        }
        else {
            autoContentServer?.channels.create({ name: categoryName, parent: categoryId, nsfw: true }).then(newChannel => {
                getAndSendContent(contentUrl, newChannel);
            });
        }
    };
    if (channels.martine == channelId) {
        const splitContent = content.replaceAll('`', '').split('\n');
        const categoryName = splitContent.find(f => f.toLowerCase().includes('category:'))?.split(/ +/g).pop();
        const contentUrl = splitContent.find(f => f.toLowerCase().includes('image:'))?.split(/ +/g).pop();
        // console.log({categoryName, contentUrl})
        if (categoryName && contentUrl)
            handleSendContent(categories.martine, categoryName, contentUrl);
    }
    if (channels.onlyNudes == channelId) {
        const splitContent = content.split(/ +/g);
        const lastName = splitContent[3];
        const categoryName = splitContent[2] + (lastName.toLowerCase().includes('content') ? '' : ' ' + lastName);
        const contentUrl = splitContent.find(f => f.includes('http'))?.replace(')', '').split('(').pop();
        if (categoryName && contentUrl)
            handleSendContent(categories.onlyNudes, categoryName, contentUrl);
    }
}
exports.ManageAutomaticContent = ManageAutomaticContent;
