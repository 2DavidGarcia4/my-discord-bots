"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = exports.commandsCommand = exports.name = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const functions_1 = require("../../../../shared/functions");
exports.name = "commands";
const commandsCommand = (msg, client, args) => {
    msg.channel.sendTyping();
    const { prefix } = db_1.botDB;
    const generalCommands = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`;
    const moderationCommands = `**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`;
    let descripcion = "";
    if (args[0] == 'all' && msg.author.id == db_1.botDB.creatorId) {
        descripcion = `**⚜️ Administración:**\n\`\`${prefix}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefix}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.\n\n💎 **Creador:**\n\`\`${prefix}addalianzas\`\` **|** Agrega alianzas a un miembro del servidor.\n\`\`${prefix}removealianzas\`\` **|** Elimina alianzas de un miembro.\n\`\`${prefix}removeusersystemali\`\` **|** Elimina un miembro del sistema de alianzas.\n\`\`${prefix}expulsarpersonal\`\` **|** Elimina un miembro del personal del sistema y le elimina todos los roles del personal.`;
    }
    else {
        if (msg.member?.permissions.has('Administrator')) {
            descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.\n\n**⚜️ Administración:**\n\`\`${prefix}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefix}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.`;
        }
        else {
            if (msg.member?.roles.cache.get("773271945894035486")) {
                descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`;
            }
            else {
                if (!msg.member?.roles.cache.get("773271945894035486") || !msg.member?.permissions.has('Administrator')) {
                    descripcion = `**🌐 Generales:**\n\`\`${prefix}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefix}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`;
                }
            }
        }
    }
    const embComandos = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: msg.member?.nickname ? msg.member?.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL() })
        .setTitle("📃 Comandos")
        .setDescription(descripcion)
        .setColor(msg.guild?.members.me?.displayHexColor || 'White')
        .setFooter({ text: msg.guild?.name || 'indefined', iconURL: msg.guild?.iconURL() || undefined })
        .setTimestamp();
    (0, functions_1.sendMessageText)(msg, { embeds: [embComandos] });
};
exports.commandsCommand = commandsCommand;
exports.alias = ['cmds', 'comandos'];
