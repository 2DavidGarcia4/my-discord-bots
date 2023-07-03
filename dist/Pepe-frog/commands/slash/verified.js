"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const VerifiedScb = new discord_js_1.SlashCommandBuilder()
    .setName('verified')
    .setNameLocalization('es-ES', 'verificada')
    .setDescription('✅ Provides information about a verified woman.')
    .setDescriptionLocalization('es-ES', '✅ Proporciona información sobre una mujer verificada.')
    .addUserOption(verified => verified.setName('user')
    .setNameLocalization('es-ES', 'usuario')
    .setDescription('👩 Verified user')
    .setDescriptionLocalization('es-ES', '👩 Usuario verificado')
    .setRequired(false)).toJSON();
function verifiedSlashCommand(int, client) {
    const { user } = int;
    const VerifiedEb = new discord_js_1.EmbedBuilder()
        .setTitle('✅ Verificada');
    int.reply({ ephemeral: true, content: 'Command under development' });
}
exports.default = {
    Command: VerifiedScb,
    run: verifiedSlashCommand
};
