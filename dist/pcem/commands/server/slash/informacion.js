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
exports.informacionSlashCommand = exports.informacionScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../shared/functions");
exports.informacionScb = new discord_js_1.SlashCommandBuilder()
    .setName("información")
    .setDescription(`📖 Muestra información de cosas.`)
    .addSubcommand(afiliacion => afiliacion.setName(`afiliaciones`).setDescription(`✨ Información sobre como hacer una afiliación.`))
    .addSubcommand(alianzas => alianzas.setName(`alianzas`).setDescription(`🤝 Información sobre como hacer una alianza.`))
    .addSubcommand(miembro => miembro.setName(`miembro`).setDescription(`🧑 Muestra información de un miembro sobre los sistemas del bot.`)
    .addUserOption(usuario => usuario.setName(`usuario`).setDescription(`👤 Proporciona un usuario para ver su información.`).setRequired(false))).toJSON();
const informacionSlashCommand = (int) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { options, guild, user } = int, subCommand = options.getSubcommand(true), author = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(user.id), { emoji } = db_1.botDB;
    if (subCommand == "afiliaciones") {
        yield int.deferReply();
        const membershipEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
            .setTitle(`${emoji.information} Información sobre afiliaciones`)
            .addFields({ name: `📋 **Requisitos para afiliación:**`, value: `**1.** Tener mínimo **1,500** miembros en su servidor.\n**2.** Utilizar ping @everyone o @here obligatorio.\n**3.** Tener una plantilla bien organizada y una invitación qué no expire.\n**4.** Un representante en el servidor.\n**5.** Prohibidos servidores de raid/gore/CP/doxxeo/etc.` }, { name: `👮 **Soporte:**`, value: `Una vez cumplas con los requisitos para realizar la afiliación abre un ticket en el canal <#830165896743223327> y pide una afiliación, otra forma de pedir una afiliación es pedírsela un miembro del equipo de soporte por su MD *(mensaje directo)* a cualquiera de los miembros que tengan los siguientes roles <@&847302489732153354>, <@&907807597011279923> y <@&839549500237938748>.` }, { name: `❓ **Datos:**`, value: `Puedes renovar la afiliación despues de un mes.` })
            .setColor(((_a = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get('941731411684122625')) === null || _a === void 0 ? void 0 : _a.hexColor) || 'White')
            .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
            .setTimestamp();
        (0, functions_1.sendMessageSlash)(int, { embeds: [membershipEb] });
    }
    if (subCommand == "alianzas") {
        yield int.deferReply();
        const alliancesEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
            .setTitle(`${emoji.information} Información sobre alianzas`)
            .addFields({ name: `📋 **Requisitos para alianza:**`, value: `**1.** Servidor con mas de **50** miembros.\n**2.** Servidor no toxico, que no fomente ninguna práctica mala como el raideo.\n**3.** Servidor sin contenido **NSFW** en canales normales debe de estar en canales **NSFW** con restricción de edad.\n**4.** No eliminar la alianza, en caso de hacerlo nosotros lo haremos de la misma manera.\n**5.** Proporcionar su plantilla con una invitación a su servidor que no expire, en caso de que expire eliminaremos su plantilla.` }, { name: `👮 **Soporte:**`, value: `Una vez cumplas con los requisitos para realizar la alianza abre un ticket en el canal <#830165896743223327> y pide una alianza, otra forma de pedir una alianza es pedírsela un miembro del equipo de soporte por su MD *(mensaje directo)* a cualquiera de los miembros que tenga el rol <@&887444598715219999>.` }, { name: `❓ **Datos:**`, value: `Puedes renovar tu alianza cada semana.\nSi tu servidor supera los **600** al hacer una alianza con nosotros utilizaremos en tu plantilla la mención del rol <@&895394175481159680> el cual notifica a todos los usuarios que lo tienen.` })
            .setColor(((_b = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get('840704364158910475')) === null || _b === void 0 ? void 0 : _b.hexColor) || 'White')
            .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined })
            .setTimestamp();
        (0, functions_1.sendMessageSlash)(int, { embeds: [alliancesEb] });
    }
    if (subCommand == "miembro") {
        const dataAli = yield models_1.alliancesModel.findById(db_1.botDB.serverId), userOption = options.getUser('usuario');
        let member = userOption ? ((guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userOption.id)) || undefined) : undefined;
        if (member === null || member === void 0 ? void 0 : member.user.bot)
            return (0, functions_1.setSlashError)(int, `El miembro proporcionado *(${member})* es un bot, no puedo mostrar información de los bots.`);
        if (!dataAli)
            return;
        const memberInfoEb = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: (author === null || author === void 0 ? void 0 : author.nickname) || int.user.username, iconURL: int.user.displayAvatarURL() })
            .setColor(((_d = (_c = int.guild) === null || _c === void 0 ? void 0 : _c.members.me) === null || _d === void 0 ? void 0 : _d.displayHexColor) || 'White')
            .addFields()
            .setTimestamp();
        yield int.deferReply();
        const isStaff = member ? member.permissions.has('Administrator') || member.roles.cache.has('887444598715219999') : (author === null || author === void 0 ? void 0 : author.permissions.has('Administrator')) || (author === null || author === void 0 ? void 0 : author.roles.cache.has('887444598715219999'));
        if (member) {
            let miembroAli = dataAli.members.find(f => f.id == (member === null || member === void 0 ? void 0 : member.id));
            if (member.id == (user === null || user === void 0 ? void 0 : user.id)) {
                memberInfoEb
                    .setTitle(`${emoji.information} Tu información`)
                    .setDescription(`<@${member.id}>`)
                    .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined });
                if (isStaff && miembroAli)
                    (_e = memberInfoEb.data.fields) === null || _e === void 0 ? void 0 : _e.push({ name: `🤝 **Alianzas:**`, value: `Has creado ${((miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount) || 0) <= 1 ? `**${miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount}** alianza.` : `**${miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount}** alianzas.`}` });
            }
            else {
                memberInfoEb
                    .setTitle(`${emoji.information} Información de`)
                    .setDescription(`<@${member.id}>`)
                    .setFooter({ text: member.nickname || member.user.username, iconURL: member.displayAvatarURL() });
                if (isStaff && miembroAli)
                    (_f = memberInfoEb.data.fields) === null || _f === void 0 ? void 0 : _f.push({ name: `🤝 **Alianzas:**`, value: `Ha creado ${((miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount) || 0) <= 1 ? `**${miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount}** alianza.` : `**${miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount}** alianzas.`}` });
            }
            // sendMessageSlash(int, {embeds: [memberInfoEb]})
        }
        else {
            let miembroAli = dataAli.members.find(f => f.id == user.id);
            memberInfoEb
                .setTitle(`${emoji.information} Tu información`)
                .setDescription(`<@${user.id}>`)
                .setFooter({ text: (guild === null || guild === void 0 ? void 0 : guild.name) || 'undefined', iconURL: (guild === null || guild === void 0 ? void 0 : guild.iconURL()) || undefined });
            if (isStaff && miembroAli)
                (_g = memberInfoEb.data.fields) === null || _g === void 0 ? void 0 : _g.push({ name: `🤝 **Alianzas:**`, value: `Has creado ${((miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount) || 0) <= 1 ? `**${miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount}** alianza.` : `**${miembroAli === null || miembroAli === void 0 ? void 0 : miembroAli.amount}** alianzas.`}` });
        }
        (0, functions_1.sendMessageSlash)(int, { embeds: [memberInfoEb] });
    }
}); // 178 a 131
exports.informacionSlashCommand = informacionSlashCommand;
