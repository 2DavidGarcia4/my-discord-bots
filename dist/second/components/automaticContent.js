"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAutomaticContent = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const config_2 = require("../../config");
const models_1 = require("../../models");
const node_path_1 = __importDefault(require("node:path"));
const martineChannel = '1058148757641900083';
const martineCategories = [
    '949861762902138941',
    '1141400243645190304',
    '1207834923734663188',
    '1207834958287208458',
    '1207841886123991080'
];
const autoContentServerId = '949861760096145438';
async function ManageAutomaticContent(msg, client) {
    if (config_1.inDevelopment !== undefined || !config_2.TYPES_CONTENT_IGNORE)
        return;
    const { channelId, content } = msg;
    if (channelId !== martineChannel)
        return;
    const splitContent = content.replaceAll('`', '').split('\n');
    const categoryName = splitContent.find(f => f.toLowerCase().includes('category:'))?.split(/ +/g).at(-1)?.toLowerCase();
    const fileUrl = splitContent.find(f => f.toLowerCase().includes('image:'))?.split(/ +/g).pop();
    // console.log({categoryName, fileUrl})
    if (!(categoryName && fileUrl) || config_2.TYPES_CONTENT_IGNORE.split(/ +/g).some(s => s === categoryName)) {
        msg.delete().catch(e => console.error('Error al eliminar el mensaje: ', e));
        return;
    }
    const autoContentServer = client.getGuildById(autoContentServerId);
    async function getMartineChannel(channelName) {
        return autoContentServer?.channels.cache.find(f => f.name === channelName && martineCategories.some(c => c === f.parentId)) ?? await autoContentServer?.channels.create({
            name: channelName,
            parent: martineCategories.find(c => autoContentServer.channels.cache.filter(f => c === f.parentId).size < 50),
            nsfw: true
        });
    }
    if (fileUrl.slice(fileUrl.length - 7, fileUrl.length).includes('.')) {
        const response = await fetch(fileUrl);
        if (response.status !== 200)
            return;
        const contentType = response.headers.get('content-type');
        if (contentType === null) {
            console.log(`El archivo no tiene content-type header | URL: ${fileUrl}`);
            return;
        }
        const splitContentTipe = contentType.split('/');
        const channelName = `${categoryName}-${splitContentTipe.at(-1) === 'gif' ? 'gif' : splitContentTipe.at(0)}`;
        const channel = await getMartineChannel(channelName);
        if (channel?.type !== discord_js_1.ChannelType.GuildText)
            return;
        const contentLength = response.headers.get('content-length');
        const mbSize = 1_048_576;
        const fileExtension = splitContentTipe.at(-1);
        let size = 0;
        let MBs = 0;
        if (contentLength === null) {
            const imageBufer = await response.arrayBuffer();
            const buffer = Buffer.from(imageBufer);
            size = buffer.length;
            MBs = size / mbSize;
        }
        else {
            size = parseInt(contentLength);
            MBs = size / mbSize;
        }
        const categories = categoryName.split('_');
        const categoryIds = [];
        for (const name of categories) {
            const category = await models_1.SnackFileCategoriesModel.findOne({ name });
            if (category === null) {
                const newCategory = await models_1.SnackFileCategoriesModel.create({ name });
                categoryIds.push(newCategory.id);
                continue;
            }
            categoryIds.push(category.id);
        }
        const handleExtension = async (filePath) => {
            const extName = node_path_1.default.extname(filePath).slice(1);
            const extension = await models_1.SnackFileExtensionsModel.findOne({ name: extName });
            if (extension === null) {
                await models_1.SnackFileExtensionsModel.create({ name: extName });
            }
        };
        //* 25MB max
        if (MBs > 24) {
            channel.send({ content: `[**File url**](${fileUrl}) **${contentType}** | **${MBs.toFixed(2)} MB**` });
            const name = node_path_1.default.basename(fileUrl);
            await handleExtension(fileUrl);
            await models_1.SnackFilesModel.create({
                url: fileUrl,
                name,
                size,
                type: contentType,
                categories: categoryIds
            });
            return;
        }
        const fileNumber = (parseInt(channel.topic?.match(/\d+/g)?.[0] || '0')) + 1;
        channel.send({
            content: `**file${fileNumber}.${fileExtension}** | **${MBs.toFixed(2)} MB**`,
            files: [{ attachment: fileUrl, name: `file${fileNumber}.${fileExtension}` }]
        }).then(async (msg) => {
            for (const [_, attachment] of msg.attachments) {
                await handleExtension(attachment.name);
                await models_1.SnackFilesModel.create({
                    url: attachment.url,
                    name: attachment.name,
                    type: attachment.contentType,
                    size: attachment.size,
                    width: attachment.width,
                    height: attachment.height,
                    categories: categoryIds
                });
            }
            channel.edit({ topic: fileNumber + '' });
        }).catch(e => console.error('Error in send file: ', e));
    }
    else {
        const defaultChannel = await getMartineChannel(categoryName);
        if (defaultChannel?.type === discord_js_1.ChannelType.GuildText) {
            defaultChannel.send({ content: `[**File url**](${fileUrl})` });
        }
    }
}
exports.ManageAutomaticContent = ManageAutomaticContent;
