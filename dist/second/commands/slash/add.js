"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
const data_1 = require("../../data");
const models_1 = require("../../../models");
const functions_1 = require("../../../shared/functions");
const notion_1 = require("../../lib/notion");
const AddScb = new discord_js_1.SlashCommandBuilder()
    .setName('add')
    .setNameLocalization('es-ES', 'agregar')
    .setDescription('➕ Add command')
    .setDescriptionLocalization('es-ES', '➕ Comando agregar')
    .addSubcommand(verified => verified.setName('verified')
    .setNameLocalization('es-ES', 'verificada')
    .setDescription('✅ Add a new verified to the system')
    .setDescriptionLocalization('es-ES', '✅ Agrega a una nueva verificada al sistema')
    .addUserOption(girl => girl.setName('girl')
    .setNameLocalization('es-ES', 'chica')
    .setDescription('👩 The new verified')
    .setDescriptionLocalization('es-ES', '👩 La nueva verificada')
    .setRequired(true))
    .addStringOption(channelId => channelId.setName('channel')
    .setNameLocalization('es-ES', 'canal')
    .setDescription('🆔 Channel ID')
    .setDescriptionLocalization('es-ES', '🆔 Canal ID')
    .setRequired(true)))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .toJSON();
class AddSlashCommand extends __1.SlashCommand {
    constructor() {
        super({
            struct: AddScb,
            guildsIds: [data_1.FrogDb.serverId]
        });
    }
    async execute(int) {
        const { guild, options } = int, subCommandName = options.getSubcommand(true);
        if (subCommandName == 'verified') {
            const girl = options.getUser('girl', true), channelId = options.getString('channel', true);
            const verified = await models_1.VerifiedsModel.findOne({ userId: girl.id });
            if (verified)
                return (0, functions_1.setSlashError)(int, `The girl ${girl} is already verified`);
            await int.deferReply({ ephemeral: true });
            const { roles } = await (0, notion_1.getSnackData)();
            guild?.members.cache.get(girl.id)?.roles.add(roles.verified);
            models_1.VerifiedsModel.create({
                userId: girl.id,
                channelId,
                ping: true,
                verifiedAt: Date.now(),
                contentHidden: false,
                channelHidden: false
            });
            const AddVerifiedEb = new discord_js_1.EmbedBuilder()
                .setTitle('➕ New verified')
                .setDescription(`New verified girl ${girl}`)
                .setColor('Green');
            (0, functions_1.sendMessageSlash)(int, { embeds: [AddVerifiedEb] });
        }
    }
}
exports.default = AddSlashCommand;
