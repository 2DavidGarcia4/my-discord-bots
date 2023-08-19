"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../../..");
class RolesCommand extends __1.TextCommand {
    constructor() {
        super({ name: 'roles' });
    }
    async execute({ message: msg }) {
        const RolesEb = new discord_js_1.EmbedBuilder()
            .setTitle('🎭 Roles')
            .setDescription('Hola, aquí podrás obtener los roles que quieras, unos roles te notifican sobre acciones que se realizan en el servidor mientras que otros son solo de adorno como roles que cambian el color de tu nombre.\n\nPara obtener un rol seleccione el tipo de rol que quieres obtener abajo en el menú desplegable.')
            .setFooter({ text: "you don't speak Spanish?, Click blue button below" })
            .setColor(msg.guild?.members.me?.displayHexColor || 'White');
        const RolesBtn = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('en-roles-btn')
            .setEmoji('👅')
            .setLabel('English')
            .setStyle(discord_js_1.ButtonStyle.Primary));
        const RolesMenu = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('roles-menu')
            .setPlaceholder('👉 Selecciona un tipo de rol')
            .setOptions([
            {
                label: 'Notificaciones',
                emoji: '🔔',
                description: 'Roles que te notifican sobre acciones.',
                value: 'notifications'
            },
            {
                label: 'Colores',
                emoji: '🌈',
                description: 'Roles que cambian el color de tu nombre.',
                value: 'colors'
            },
            {
                label: 'Géneros',
                emoji: '👥',
                description: 'Roles que te identifican con un género.',
                value: 'genders'
            },
        ]));
        msg.channel.send({ embeds: [RolesEb], components: [RolesMenu, RolesBtn] });
    }
}
exports.default = RolesCommand;
