"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsCommand = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../db");
const functions_1 = require("../../../utils/functions");
const commandsCommand = (msg, client, args) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    msg.channel.sendTyping();
    const { prefix } = db_1.botDB;
    const generalCommands = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`;
    const moderationCommands = `**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`;
    let descripcion = "";
    if (args[0] == 'all' && msg.author.id == db_1.botDB.creatorId) {
        descripcion = `**⚜️ Administración:**\n\`\`${prefix}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefix}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.\n\n💎 **Creador:**\n\`\`${prefix}addalianzas\`\` **|** Agrega alianzas a un miembro del servidor.\n\`\`${prefix}removealianzas\`\` **|** Elimina alianzas de un miembro.\n\`\`${prefix}removeusersystemali\`\` **|** Elimina un miembro del sistema de alianzas.\n\`\`${prefix}expulsarpersonal\`\` **|** Elimina un miembro del personal del sistema y le elimina todos los roles del personal.`;
    }
    else {
        if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.permissions.has('Administrator')) {
            descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.\n\n**⚜️ Administración:**\n\`\`${prefix}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefix}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.`;
        }
        else {
            if ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.cache.get("773271945894035486")) {
                descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`;
            }
            else {
                if (!((_c = msg.member) === null || _c === void 0 ? void 0 : _c.roles.cache.get("773271945894035486")) || !((_d = msg.member) === null || _d === void 0 ? void 0 : _d.permissions.has('Administrator'))) {
                    descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`;
                }
            }
        }
    }
    const embComandos = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: ((_e = msg.member) === null || _e === void 0 ? void 0 : _e.nickname) ? (_f = msg.member) === null || _f === void 0 ? void 0 : _f.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL() })
        .setTitle("📃 Comandos")
        .setDescription(descripcion)
        .setColor(((_h = (_g = msg.guild) === null || _g === void 0 ? void 0 : _g.members.me) === null || _h === void 0 ? void 0 : _h.displayHexColor) || 'White')
        .setFooter({ text: ((_j = msg.guild) === null || _j === void 0 ? void 0 : _j.name) || 'indefined', iconURL: ((_k = msg.guild) === null || _k === void 0 ? void 0 : _k.iconURL()) || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageText)(msg, { embeds: [embComandos] });
};
exports.commandsCommand = commandsCommand;
