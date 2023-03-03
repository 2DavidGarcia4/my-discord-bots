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
exports.membersSlashCommand = exports.membersScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.membersScb = new discord_js_1.SlashCommandBuilder()
    .setName('members')
    .setNameLocalization('es-ES', 'miembros')
    .setDescription('🌪️ Filter members')
    .setDescriptionLocalization('es-ES', '🌪️ Filtra miembros')
    .addSubcommand(mwith => mwith.setName('with')
    .setNameLocalization('es-ES', 'con')
    .setDescription('⚙️ Filter members by.')
    .setDescriptionLocalization('es-ES', '⚙️ Filtrar miembros por.')
    .addBooleanOption(bot => bot.setName('bot')
    .setDescription('🤖 Include bots?.')
    .setDescriptionLocalization('es-ES', '🤖 ¿Incluir bots?.')
    .setRequired(true))
    .addRoleOption(rol => rol.setName('rol')
    .setDescription('🏅 Filter by role.')
    .setDescriptionLocalization('es-ES', '🏅 Filtrar por rol.')
    .setRequired(false))
    .addStringOption(includes => includes.setName('includes')
    .setNameLocalization('es-ES', 'incluye')
    .setDescription('📝 Filter by word you include in your name.')
    .setDescriptionLocalization('es-ES', '📝 Filtrar por palabra que incluya en su nombre.')
    .setRequired(false)))
    .addSubcommand(without => without.setName('without')
    .setNameLocalization('es-ES', 'sin')
    .setDescription('⚙️ Filter members without.')
    .setDescriptionLocalization('es-ES', '⚙️ Filtrar miembros sin')
    .addBooleanOption(bot => bot.setName('bot')
    .setDescription('🤖 Include bots?.')
    .setDescriptionLocalization('es-ES', '🤖 ¿Incluir bots?.')
    .setRequired(true))
    .addRoleOption(rol => rol.setName('rol')
    .setDescription('🏅 Filter without role.')
    .setDescriptionLocalization('es-ES', '🏅 Filtrar sin rol.')
    .setRequired(false))
    .addStringOption(includes => includes.setName('includes')
    .setNameLocalization('es-ES', 'incluye')
    .setDescription('📝 Filter without a word that includes in its name.')
    .setDescriptionLocalization('es-ES', '📝 Filtra sin palabra que incluya en su nombre.')
    .setRequired(false)))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .toJSON();
const membersSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, guild, options, locale } = int, subCommandName = options.getSubcommand(true), isEnglish = locale == 'en-US';
    const bot = options.getBoolean('bot', true), rol = options.getRole('rol'), includes = options.getString('includes');
    if (subCommandName == 'with') {
        if (!rol && !includes)
            return (0, functions_1.setSlashError)(int, (isEnglish ?
                'Provide at least one value to filter members.' :
                'Proporciona al menos un valor para filtrar los miembros.'));
        const membersFilter = guild === null || guild === void 0 ? void 0 : guild.members.cache.filter(f => (bot || !f.user.bot) && (rol ? f.roles.cache.has(rol.id) : true) && (includes ? f.user.username.includes(includes) : true));
        const filterEmoji = '<:filter:1077404400764596275>';
        if (membersFilter)
            (0, utils_1.interactiveList)(int, membersFilter.map((m, key) => `[${m.user.tag}](${m.displayAvatarURL({ size: 1024 })})\n<@${key}>\n`), (isEnglish ? `${filterEmoji} members filtered by` : `${filterEmoji} miembros filtrados por`), (isEnglish ?
                `**${membersFilter.size}** Members filtered by:\n${rol ? `Rol ${rol}\n` : ``}${includes ? `Includes \`\`${includes}\`\`` : ''}\n\n` :
                `**${membersFilter.size}** Miembros filtrados por:\n${rol ? `Rol ${rol}\n` : ''}${includes ? `Incluye \`\`${includes}\`\`` : ''}\n\n`), (0, utils_1.getEmbedColor)(guild));
    }
    if (subCommandName == 'without') {
        if (!rol && !includes)
            return (0, functions_1.setSlashError)(int, (isEnglish ?
                'Provide at least one value to filter members.' :
                'Proporciona al menos un valor para filtrar los miembros.'));
        const membersFilter = guild === null || guild === void 0 ? void 0 : guild.members.cache.filter(f => (bot || !f.user.bot) && (rol ? !f.roles.cache.has(rol.id) : true) && (includes ? !f.user.username.includes(includes) : true));
        const filterEmoji = '<:filter:1077404400764596275>';
        if (membersFilter)
            (0, utils_1.interactiveList)(int, membersFilter.map((m, key) => `[${m.user.tag}](${m.displayAvatarURL({ size: 1024 })})\n<@${key}>\n`), (isEnglish ? `${filterEmoji} members filtered without` : `${filterEmoji} miembros filtrados sin`), (isEnglish ?
                `**${membersFilter.size}** Members filtered without:\n${rol ? `Rol ${rol}\n` : ``}${includes ? `Includes \`\`${includes}\`\`` : ''}\n\n` :
                `**${membersFilter.size}** Miembros filtrados sin:\n${rol ? `Rol ${rol}\n` : ''}${includes ? `Incluye \`\`${includes}\`\`` : ''}\n\n`), (0, utils_1.getEmbedColor)(guild));
    }
});
exports.membersSlashCommand = membersSlashCommand;
