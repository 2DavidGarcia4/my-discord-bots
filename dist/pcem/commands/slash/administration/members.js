"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberScb = void 0;
const discord_js_1 = require("discord.js");
exports.memberScb = new discord_js_1.SlashCommandBuilder()
    .setName('members')
    .setNameLocalization('es-ES', 'miembros')
    .setDescription('🌪️ Filter members')
    .setDescriptionLocalization('es-ES', '🌪️ Filtra miembros')
    .addSubcommand(mwith => mwith.setName('with')
    .setNameLocalization('es-ES', 'con')
    .setDescription('⚙️ Filter members by.')
    .setDescriptionLocalization('es-ES', '⚙️ Filtrar miembros por.')
    .addRoleOption(principalRol => principalRol.setName('rol')
    .setDescription('')
    .setRequired(false)))
    .addSubcommand(without => without.setName('without')
    .setNameLocalization('es-ES', 'sin')
    .setDescription('⚙️ Filter members without.')
    .setDescriptionLocalization('es-ES', '⚙️ Filtrar miembros sin'))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .toJSON();
