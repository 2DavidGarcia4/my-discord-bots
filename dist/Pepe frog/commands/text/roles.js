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
exports.rolesCommand = void 0;
const discord_js_1 = require("discord.js");
const rolesCommand = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const RolesEb = new discord_js_1.EmbedBuilder()
        .setTitle('🌈 Roles')
        .setDescription('Hola, aquí podrás obtener los roles que quieras, unos roles te notifican sobre acciones que se realizan en el servidor mientras que otros son solo de adorno como roles que cambian tu color.\n\nPara obtener un rol seleccione el tipo de rol que quieres obtener abajo en el menú desplegable.')
        .setColor(((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White');
    const RolesBtn = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('en-roles-btn')
        .setEmoji('👅')
        .setLabel('English')
        .setStyle(discord_js_1.ButtonStyle.Primary));
    const RolesMenu = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.SelectMenuBuilder()
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
    ]));
    msg.channel.send({ embeds: [RolesEb], components: [RolesMenu, RolesBtn] });
});
exports.rolesCommand = rolesCommand;
