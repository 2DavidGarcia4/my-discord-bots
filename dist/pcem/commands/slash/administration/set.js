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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSlashCommand = exports.setScb = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const functions_1 = require("../../../../shared/functions");
exports.setScb = new discord_js_1.SlashCommandBuilder()
    .setName('set')
    .setNameLocalization('es-ES', 'establecer')
    .setDescription('👉 Set a option.')
    .setDescriptionLocalization('es-ES', '👉 Establecer una opción.')
    .addSubcommand(slowMode => slowMode.setName('slowmode')
    .setNameLocalization('es-ES', 'modolento')
    .setDescription('⏳ Set channel slow mode.')
    .setDescriptionLocalization('es-ES', '⏳ Establecer el modo lento del canal.')
    .addStringOption(time => time.setName('time')
    .setNameLocalization('es-ES', 'tiempo')
    .setDescription('🔢 Waiting time between each message.')
    .setDescriptionLocalization('es-ES', '🔢 Tiempo de espera entre cada mensaje.')
    .setMinLength(2)
    .setRequired(true))
    .addChannelOption(channel => channel.setName('channel')
    .setNameLocalization('es-ES', 'canal')
    .setDescription('✍️ Text channel to set slow mode.')
    .setDescriptionLocalization('es-ES', '✍️ Canal de texto para establecer el modo lento.')
    .addChannelTypes(discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.PublicThread, discord_js_1.ChannelType.PrivateThread, discord_js_1.ChannelType.GuildAnnouncement, discord_js_1.ChannelType.AnnouncementThread, discord_js_1.ChannelType.GuildVoice)
    .setRequired(false)))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .toJSON();
const setSlashCommand = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { guild, user, options, locale } = int, subCommandName = options.getSubcommand(true), isEnglish = locale == 'en-US';
    const author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id);
    if (subCommandName == 'slowmode') {
        const time = options.getString('time', true), channel = options.getChannel('channel');
        if ((0, functions_1.setSlashErrors)(int, [
            [
                Boolean(channel && !((_a = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _a === void 0 ? void 0 : _a.permissionsIn(channel.id).has('ManageChannels'))),
                (isEnglish ? `I don't have permission to edit channel <#${channel === null || channel === void 0 ? void 0 : channel.id}>.` : `No tengo permiso para editar el canal <#${channel === null || channel === void 0 ? void 0 : channel.id}>.`)
            ],
            [
                Boolean((!channel) && !((_b = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _b === void 0 ? void 0 : _b.permissionsIn(((_c = int.channel) === null || _c === void 0 ? void 0 : _c.id) || '').has('ManageChannels'))),
                (isEnglish ? `I don't have permission to edit this channel *(${int.channel})*.` : `No tengo permiso para editar este canal *(${int.channel})*.`)
            ],
            [
                Boolean(!(0, ms_1.default)(time)),
                (isEnglish ? `The time you provided *(${time})* is not valid.\n\n**Examples:**\n30 seconds = **30s**\n10 minutes = **10m**\n2 hours = **2h**` : `El tiempo que has proporcionado *(${time})* no es valido.\n\n**Ejemplos:**\n30 segundos = **30s**\n10 minutos = **10m**\n2 horas = **2h**`)
            ],
            [
                Boolean((0, ms_1.default)(time) < (0, ms_1.default)('1s')),
                (isEnglish ? `The time you provided *(${time})* is less than **1** second, please provide a longer timeout.` : `El tiempo que has proporcionado *(${time})* es menor a **1** segundo, proporciona un tiempo de espera mayor.`)
            ],
            [
                Boolean((0, ms_1.default)(time) > (0, ms_1.default)('6h')),
                (isEnglish ? `The time you provided *(${time})* is greater than **6** hours, please provide a shorter wait time.` : `El tiempo que has proporcionado *(${time})* es mayor a **6** horas, proporciona un tiempo de espera menor.`)
            ],
        ]))
            return;
        yield int.deferReply();
        const SlowmodeEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || user.username, iconURL: user.displayAvatarURL() })
            .setTitle('⏳ ' + (isEnglish ?
            'Slow mode' :
            'Modo pausado'))
            .setDescription(isEnglish ?
            `Paused mode for channel ${channel || int.channel} has been set to **${time}**.` :
            `El modo pausado del canal ${channel || int.channel} se ha establecido a **${time}**.`)
            .setColor(((_d = guild === null || guild === void 0 ? void 0 : guild.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White')
            .setTimestamp();
        const finalChannel = channel || int.channel;
        (_e = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get((finalChannel === null || finalChannel === void 0 ? void 0 : finalChannel.id) || '')) === null || _e === void 0 ? void 0 : _e.edit({ rateLimitPerUser: Math.floor((0, ms_1.default)(time) / 1000) }).then(() => {
            (0, functions_1.sendMessageSlash)(int, { embeds: [SlowmodeEb] });
        });
    }
});
exports.setSlashCommand = setSlashCommand;
