"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsSlashComand = exports.commandsScb = void 0;
const discord_js_1 = require("discord.js");
const functions_1 = require("../../../../shared/functions");
const utils_1 = require("../../../utils");
exports.commandsScb = new discord_js_1.SlashCommandBuilder()
    .setName('commands')
    .setNameLocalization('es-ES', 'comandos')
    .setDescription('📄 My slash commands')
    .setDescriptionLocalization('es-ES', '📄 Mis comandos de barra').toJSON();
const commandsSlashComand = async (int, client) => {
    const { user, guild, locale } = int, isEnglish = locale == 'en-US';
    const author = guild?.members.cache.get(user.id);
    const commands = await client.application?.commands.fetch();
    await int.deferReply();
    const mentionCommands = commands?.filter(c => c.type == 1).map((c) => c.options.filter(f => f.type == 1).length ? c.options.map(a => `</${c.name} ${a.name}:${c.id}>`) : `</${c.name}:${c.id}>`).flat().join(', ');
    const CommandsEb = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: `Hola ${author?.nickname || author?.user.username}`, iconURL: author?.user.displayAvatarURL() })
        .setTitle(`📄 ${isEnglish ? 'Commands' : 'Comandos'}`)
        .setDescription((isEnglish ? 'A **command** is an order/instruction that you give to the Bot and to which the Bot responds in a certain way according to the order or name of the command.' : 'Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.') + `\n\n${mentionCommands}`)
        .setFooter({ text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined })
        .setColor((0, utils_1.getEmbedColor)(guild))
        .setTimestamp();
    (0, functions_1.sendMessageSlash)(int, { embeds: [CommandsEb] });
};
exports.commandsSlashComand = commandsSlashComand;
