"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("../..");
class InfoCommand extends __1.TextCommand {
    constructor() {
        super({
            name: 'info'
        });
    }
    async execute({ message: msg }) {
        const InfoEb = new discord_js_1.EmbedBuilder()
            .setTitle('<a:animate_info:1058179015938158592> Información')
            .setDescription('Aquí podrás obtener información de casi todo lo que hay en el servidor solo selecciona una opción en el menú de abajo y obtendrás información de esa opción.\n\n*En caso de haber leído y aun tener dudas puedes consultar con <@853063286320922634> cualquier duda.*')
            .setColor(msg.guild?.members.me?.displayHexColor || 'White');
        const InfoMenu = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('info-menu')
            .setPlaceholder('👉 Selecciona una opción.')
            .setOptions([
            {
                emoji: '🥟',
                label: 'Servidor',
                value: 'server'
            },
            {
                emoji: '1058198792282841220',
                label: 'Canales',
                value: 'channels'
            },
            {
                emoji: '🎭',
                label: 'Roles',
                value: 'roles'
            },
            {
                emoji: '🤖',
                label: 'Sobre mí',
                value: 'about-me'
            },
        ]));
        const InfoBtn = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('en-info-btn')
            .setEmoji('👅')
            .setLabel('English')
            .setStyle(discord_js_1.ButtonStyle.Primary));
        msg.channel.send({ embeds: [InfoEb], components: [InfoMenu, InfoBtn] });
    }
}
exports.default = InfoCommand;
