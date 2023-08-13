"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionEvent = exports.interactionCommands = exports.svInteractionCommands = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../db");
const fs_1 = require("fs");
const functions_1 = require("../../shared/functions");
const isDist = __dirname.includes('src') ? 'src' : 'dist';
exports.svInteractionCommands = new discord_js_1.Collection();
(0, fs_1.readdirSync)(`./${isDist}/pcem/commands/server/slash/`).forEach(async (file) => {
    const command = await Promise.resolve(`${`../commands/server/slash/${file}`}`).then(s => __importStar(require(s)));
    const struct = command[Object.keys(command)[0]];
    const cmdFunction = command[Object.keys(command)[1]];
    exports.svInteractionCommands.set(struct.name, { struct, run: cmdFunction });
});
exports.interactionCommands = new discord_js_1.Collection();
(0, fs_1.readdirSync)(`./${isDist}/pcem/commands/slash/`).forEach(async (folder) => {
    (0, fs_1.readdirSync)(`./${isDist}/pcem/commands/slash/${folder}/`).forEach(async (file) => {
        // console.log(file)
        const command = await Promise.resolve(`${`../commands/slash/${folder}/${file}`}`).then(s => __importStar(require(s)));
        const struct = command[Object.keys(command)[0]];
        const cmdFunction = command[Object.keys(command)[1]];
        exports.interactionCommands.set(struct.name, { struct, run: cmdFunction });
    });
});
(0, fs_1.readdirSync)(`./${isDist}/pcem/commands/context/`).forEach(async (folder) => {
    (0, fs_1.readdirSync)(`./${isDist}/pcem/commands/context/${folder}/`).forEach(async (file) => {
        const command = await Promise.resolve(`${`../commands/context/${folder}/${file}`}`).then(s => __importStar(require(s)));
        const struct = command[Object.keys(command)[0]];
        const cmdFunction = command[Object.keys(command)[1]];
        exports.interactionCommands.set(struct.name, { struct, run: cmdFunction });
    });
});
const baseRoles_1 = require("../commands/server/context/baseRoles");
const interactionEvent = async (int, client) => {
    const { emoji, owners, serverId } = db_1.botDB;
    if (int.isChatInputCommand()) {
        const { commandName, guildId } = int;
        if (guildId == serverId) {
            const svCommand = exports.svInteractionCommands.get(commandName);
            db_1.botDB.usedCommands++;
            if (svCommand)
                return svCommand.run(int, client);
        }
        const publicCommand = exports.interactionCommands.get(commandName);
        db_1.botDB.usedCommands++;
        if (publicCommand)
            return publicCommand.run(int, client);
    }
    if (int.isContextMenuCommand()) {
        const { commandName, commandType } = int;
        if (commandType == discord_js_1.ApplicationCommandType.User) {
            const publicCommand = exports.interactionCommands.get(commandName);
            db_1.botDB.usedCommands++;
            if (publicCommand)
                return publicCommand.run(int, client);
            if (commandName == 'Roles base')
                (0, baseRoles_1.rolesBaseContextMenu)(int);
            db_1.botDB.usedCommands++;
        }
    }
    if (int.isButton()) {
        const { customId, guild, user } = int;
        if (customId == 'eliminarMsgMD')
            int.message.delete();
    }
    if (int.isStringSelectMenu()) {
        const { customId, values, guild, user } = int;
        if (customId == 'select-type-role') {
            const guildColor = guild?.members.me?.displayHexColor || 'White';
            if (values[0] == 'colors') {
                const colorsEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🌈 Roles de colores")
                    .setDescription(`Elige una opción para obtener un rol que cambiará el color de tu nombre dentro del servidor.\n\n**<@&825913849504333874>\n\n<@&825913858446327838>\n\n<@&825913837944438815>\n\n<@&823639766226436146>\n\n<@&823639778926395393>\n\n<@&825913846571991100>\n\n<@&823639775499386881>\n\n<@&825913860992270347>\n\n<@&825913843645546506>\n\n<@&823639769300467724>\n\n<@&825913834803560481>\n\n<@&825913840981901312>\n\n<@&825913855392743444>\n\n<@&825913852654780477>**`)
                    .setColor(guildColor);
                const colorsMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("colors-roles")
                    .setPlaceholder("📑 Elige una opción para obtener un rol.")
                    .addOptions([
                    {
                        label: "Negro",
                        emoji: "🎩",
                        description: "Pinta tu nombre de color Negro.",
                        value: "negro"
                    },
                    {
                        label: "Café ",
                        emoji: "🦂",
                        description: "Pinta tu nombre de color Café .",
                        value: "cafe"
                    },
                    {
                        label: "Naranja",
                        emoji: "🍊",
                        description: "Pinta tu nombre de color Naranja.",
                        value: "naranja"
                    },
                    {
                        label: "Rojo",
                        emoji: "🍎",
                        description: "Pinta tu nombre de color Rojo.",
                        value: "rojo"
                    },
                    {
                        label: "Rosa",
                        emoji: "🌷",
                        description: "Pinta tu nombre de color Rosa.",
                        value: "rosa"
                    },
                    {
                        label: "Morado",
                        emoji: "☂️",
                        description: "Pinta tu nombre de color Morado.",
                        value: "morado"
                    },
                    {
                        label: "Azul",
                        emoji: "💧",
                        description: "Pinta tu nombre de color Azul.",
                        value: "azul"
                    },
                    {
                        label: "Azul celeste",
                        emoji: "🐬",
                        description: "Pinta tu nombre de color Azul celeste.",
                        value: "celeste"
                    },
                    {
                        label: "Cian",
                        emoji: "🧼",
                        description: "Pinta tu nombre de color Cian.",
                        value: "cian"
                    },
                    {
                        label: "Verde",
                        emoji: "🌲",
                        description: "Pinta tu nombre de color Verde.",
                        value: "verde"
                    },
                    {
                        label: "Verde Lima",
                        emoji: "🍀",
                        description: "Pinta tu nombre de color Verde Lima.",
                        value: "lima"
                    },
                    {
                        label: "Amarillo",
                        emoji: "🍌",
                        description: "Pinta tu nombre de color Amarillo.",
                        value: "amarillo"
                    },
                    {
                        label: "Gris",
                        emoji: "🐺",
                        description: "Pinta tu nombre de color Gris.",
                        value: "gris"
                    },
                    {
                        label: "Blanco",
                        emoji: "☁️",
                        description: "Pinta tu nombre de color Blanco",
                        value: "blanco"
                    }
                ]));
                int.reply({ ephemeral: true, embeds: [colorsEb], components: [colorsMenu] });
            }
            if (values[0] == 'notifications') {
                const notificationsEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🔔 Roles de notificaciones")
                    .setDescription(`Elige una opción para obtener un rol que te notificará de nuevos anuncios, alianzas, sorteos, encuestas, eventos, sugerencias de la comunidad o postulaciones a staff del servidor o puedes obtener un rol que te notifica cuando se necesite revivir el chat general el cual es <@&850932923573338162> y puede ser muy usado.\n\n**<@&840704358949584926>\n\n<@&840704364158910475>\n\n<@&840704370387451965>\n\n<@&840704372911505418>\n\n<@&915015715239637002>\n\n<@&840704367467954247>\n\n<@&850932923573338162>**`)
                    .setColor(guildColor);
                const notificationsBtns = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("notifications-roles")
                    .setPlaceholder("📑 Elige varias opciones.")
                    .setMaxValues(7)
                    .addOptions([
                    {
                        label: "Anuncios",
                        emoji: "📢",
                        description: "Te notifica cuándo haya un nuevo Anuncio.",
                        value: "anuncio"
                    },
                    {
                        label: "Alianzas",
                        emoji: "🤝",
                        description: "Te notifica cuándo haya una nueva Alianza.",
                        value: "alianza"
                    },
                    {
                        label: "Sorteos",
                        emoji: "🎉",
                        description: "Te notifica cuándo haya un nuevo Sorteo.",
                        value: "sorteo"
                    },
                    {
                        label: "Encuestas",
                        emoji: "📊",
                        description: "Te notifica cuándo haya una nueva Encuesta.",
                        value: "encuesta"
                    },
                    {
                        label: "Evento",
                        emoji: "🥳",
                        description: "Te notifica cuándo haya un nuevo Evento.",
                        value: "evento"
                    },
                    {
                        label: "Sugerencias",
                        emoji: "📧",
                        description: "Te notifica cuándo haya una nueva Sugerencia.",
                        value: "sugerencia"
                    },
                    {
                        label: "Revivir chat",
                        emoji: "❇️",
                        description: "Te notifica cuándo se necesite Revivir el chat general.",
                        value: "revivir"
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [notificationsEb], components: [notificationsBtns] });
            }
            if (values[0] == 'gender') {
                const genderEb = new discord_js_1.EmbedBuilder()
                    .setTitle("♀️♂️ Roles de género")
                    .setDescription(`Elige una opción en el menú de abajo para agregarte un rol y así determinar tu género dentro del servidor.\n\n**<@&828720344869240832>\n\n<@&828720347246624769>**`)
                    .setColor(guildColor);
                const genderBtns = new discord_js_1.ActionRowBuilder()
                    .addComponents([
                    new discord_js_1.StringSelectMenuBuilder()
                        .setCustomId("gender-roles")
                        .setPlaceholder("📑 Elige una opción para obtener un rol.")
                        .addOptions([
                        {
                            label: "Mujer",
                            emoji: "👩",
                            description: "Rol que te determina como mujer aquí.",
                            value: "mujer"
                        },
                        {
                            label: "Hombre",
                            emoji: "👨",
                            description: "Rol que te determina como hombre aquí.",
                            value: "hombre"
                        }
                    ])
                ]);
                int.reply({ ephemeral: true, embeds: [genderEb], components: [genderBtns] });
            }
            if (values[0] == 'age') {
                const ageEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🔢 Roles de edad")
                    .setDescription(`Elije una opción en el menú de abajo para agregarte un rol de edad y así determinar tu edad dentro del servidor.\n\n**<@&828720200924790834>\n\n<@&828720340719894579>**`)
                    .setColor(guildColor);
                const ageMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("age-roles")
                    .setPlaceholder("📑 Elige una opción para obtener un rol.")
                    .addOptions([
                    {
                        label: "-18",
                        emoji: "🌗",
                        description: "Rol que te determina como menor de edad.",
                        value: "-18"
                    },
                    {
                        label: "+18",
                        emoji: "🌕",
                        description: "Rol que te determina como mayor de edad.",
                        value: "+18"
                    }
                ]));
                int.reply({ ephemeral: true, embeds: [ageEb], components: [ageMenu] });
            }
            if (values[0] == 'video-games') {
                const videoGamesEb = new discord_js_1.EmbedBuilder()
                    .setTitle("🎮 Roles de videojuegos")
                    .setDescription(`Elige una o más opciones en el menú de abajo para obtener un rol del videojuego que te guste y así los demás miembros sabrán que videojuegos te gustan.\n\n**<@&886331637690953729>\n\n<@&886331642074005545>\n\n<@&886331630690631691>\n\n<@&885005724307054652>\n\n<@&886331626643152906>\n\n<@&886331634272587806>**`)
                    .setColor(guildColor);
                const videoGamesMenu = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("video-games-roles")
                    .setPlaceholder("📑 Elige varias opciones.")
                    .setMaxValues(6)
                    .addOptions([
                    {
                        label: "Fornite",
                        emoji: "☂️",
                        description: "Obtienes el rol de Fornite.",
                        value: "fornite"
                    },
                    {
                        label: "Minecraft",
                        emoji: "⛏️",
                        description: "Obtienes el rol de Minecraft.",
                        value: "minecraft"
                    },
                    {
                        label: "Free Fire",
                        emoji: "🔫",
                        description: "Obtienes el rol de Free Fire.",
                        value: "free"
                    },
                    {
                        label: "Roblox",
                        emoji: "💠",
                        description: "Obtienes el rol de Roblox.",
                        value: "roblox"
                    },
                    {
                        label: "GTA V",
                        emoji: "🚗",
                        description: "Obtienes el rol de GTA V.",
                        value: "GTA"
                    },
                    {
                        label: "Among Us",
                        emoji: "🔍",
                        description: "Obtienes el rol de Among Us.",
                        value: "amongus"
                    },
                ]));
                int.reply({ ephemeral: true, embeds: [videoGamesEb], components: [videoGamesMenu] });
            }
        }
        if (customId == 'gender-roles') {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'mujer',
                    rol: '828720344869240832',
                    status: ''
                },
                {
                    value: 'hombre',
                    rol: '828720347246624769',
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == 'age-roles') {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: '-18',
                    rol: '828720200924790834',
                    status: ''
                },
                {
                    value: '+18',
                    rol: '828720340719894579',
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == "video-games-roles") {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'fornite',
                    rol: '886331637690953729',
                    status: ''
                },
                {
                    value: 'minecraft',
                    rol: '886331642074005545',
                    status: ''
                },
                {
                    value: 'free',
                    rol: '886331630690631691',
                    status: ''
                },
                {
                    value: 'roblox',
                    rol: '885005724307054652',
                    status: ''
                },
                {
                    value: 'GTA',
                    rol: '886331626643152906',
                    status: ''
                },
                {
                    value: 'amongus',
                    rol: '886331634272587806',
                    status: ''
                }
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == "colors-roles") {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'negro',
                    rol: '825913849504333874',
                    status: ''
                },
                {
                    value: 'cafe',
                    rol: '825913858446327838',
                    status: ''
                },
                {
                    value: 'naranja',
                    rol: '825913837944438815',
                    status: ''
                },
                {
                    value: 'rojo',
                    rol: '823639766226436146',
                    status: ''
                },
                {
                    value: 'rosa',
                    rol: '823639778926395393',
                    status: ''
                },
                {
                    value: 'morado',
                    rol: '825913846571991100',
                    status: ''
                },
                {
                    value: 'azul',
                    rol: '823639775499386881',
                    status: ''
                },
                {
                    value: 'celeste',
                    rol: '825913860992270347',
                    status: ''
                },
                {
                    value: 'cian',
                    rol: '825913843645546506',
                    status: ''
                },
                {
                    value: 'verde',
                    rol: '823639769300467724',
                    status: ''
                },
                {
                    value: 'lima',
                    rol: '825913834803560481',
                    status: ''
                },
                {
                    value: 'amarillo',
                    rol: '825913840981901312',
                    status: ''
                },
                {
                    value: 'gris',
                    rol: '825913855392743444',
                    status: ''
                },
                {
                    value: 'blanco',
                    rol: '825913852654780477',
                    status: ''
                },
            ];
            if (author)
                (0, functions_1.selectRole)(int, values[0], dictionary, author);
        }
        if (customId == "notifications-roles") {
            const author = guild?.members.cache.get(user.id);
            const dictionary = [
                {
                    value: 'anuncio',
                    rol: '840704358949584926',
                    status: ''
                },
                {
                    value: 'alianza',
                    rol: '840704364158910475',
                    status: ''
                },
                {
                    value: 'sorteo',
                    rol: '840704370387451965',
                    status: ''
                },
                {
                    value: 'encuesta',
                    rol: '840704372911505418',
                    status: ''
                },
                {
                    value: 'evento',
                    rol: '915015715239637002',
                    status: ''
                },
                {
                    value: 'sugerencia',
                    rol: '840704367467954247',
                    status: ''
                },
                {
                    value: 'postulacion',
                    rol: '840704375190061076',
                    status: ''
                },
                {
                    value: 'revivir',
                    rol: '850932923573338162',
                    status: ''
                },
            ];
            if (author)
                (0, functions_1.selectMultipleRoles)(int, values, dictionary, author);
        }
        if (customId == "información") {
            const author = guild?.members.cache.get(user.id);
            const colaboradores = [];
            let infos = [
                {
                    valor: `servidor`,
                    color: guild?.members.me?.displayHexColor || 'White',
                    miniatura: guild?.iconURL({ size: 1024 }) || '',
                    titulo: `${guild?.name}`,
                    descripcion: `Es un servidor enfocado en la promoción, creado el <t:${Math.floor((guild?.createdAt.valueOf() || 0) / 1000)}:F> aquí puedes promocionarte, dar a conocer tu contenido, trabajo, redes sociales a mas personas, además de eso puedes charlar con los demás miembros del servidor, hacer amigos, entretenerte con los diversos bots de entretenimiento que tenemos, entre otras cosas.\n\n**¡Disfruta del servidor!**\n*Gracias por estar aquí*`
                },
                {
                    valor: `categoría-importante`,
                    color: `#F4F2F2`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982802288660/importante.png`,
                    titulo: `💠 Importante`,
                    descripcion: `Categoría: **<#823655193886851143>**: en esta categoría hay canales importantes que debes de revisar.\n\n> **<#823343749039259648>**: en este canal están las reglas del servidor importante que las leas y las respetes para no tener que sancionarte. \n> .\n> **<#826205120173310032>**: en este canal se publican **anuncios**, **eventos**, **sorteos**, **encuestas** y el estado de las **postulaciones** del personal del servidor, si no te quieres perder de ninguno de los anteriores y ser notificado cuando haya un rol que te notifica por cada uno puedes obtener los roles en el canal <#823639152922460170>, si quieres saber más sobre esos roles selecciona la opción **🔔 Roles de ping** en este menú.\n> .\n> **<#837563299058679828>**: en este canal se da la bienvenida a cada nuevo miembro con un mensaje automático del bot <@843185929002025030>.\n> .\n> **<#823639152922460170>**: en este canal puedes obtener roles con solo dar un clic, roles que cambian el color de tu nombre en el servidor, roles de notificaciones los cuales te notifican cuando hay una nueva actualización sobre algún tema como **anuncios**, **postulaciones**, **sorteos**, **eventos**, etc.`
                },
                {
                    valor: `categoría-colaboradores`,
                    color: `#6B6B6B`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981506248734/colaborador.png`,
                    titulo: `💎 Colaboradores`,
                    descripcion: `Categoría **<#913490278529261619>**:  en esta categoría encontrarás canales para los colaboradores del servidor, cada colaborador tendrá su canal en el cual podrá modificar el nombre y descripción de su canal cuantas veces quiera, publicar su contenido utilizando @everyone o @here una vez por día.\n\n${colaboradores.length == 0 ? "" : "**Canales de los colaboradores actuales:**\n> " + colaboradores?.join("\n> .\n> ")}\n> **¿Quieres ser colaborador?** selecciona la opción **:trophy: Roles exclusivos** en este menú para obtener información sobre ello.`
                },
                {
                    valor: `categoría-promociones-vip`,
                    color: `#643602`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924983553077298/VIP.png`,
                    titulo: `✨ Promociones VIP`,
                    descripcion: `Categoría **<#827295364167237644>**: en esta categoría hay canales de promoción exclusivos los cuales solo si tienes cierto rol puedes acceder a ellos.\n\n> **<#826193847943037018>**: a este canal de promoción tienen acceso los miembros con el rol <@&826197551904325712>, en el pueden publicar o promocionar su contenido cada **6** horas y utilizar @everyone o @here pero solo **2** días a la semana y **1** vez por día.\n> .\n> **<#870884933529378846>**: a este canal de promoción solo tienen acceso los miembros que tienen el rol <@&826197378229993503>, en el canal pueden publicar o promocionar su contenido cada **4** horas.\n\n**¿Quieres saber como conseguir esos roles?**, selecciona la opción **🏆 Roles exclusivos** en el menú de información.`
                },
                {
                    valor: `categoría-promociónate`,
                    color: `#F28204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925160049381437/promocionate.png`,
                    titulo: `📣 Promociónate`,
                    descripcion: `Categoría **<#785729364288339978>**: en esta categoría están todos los canales en los que puedes hacer promoción de tu servidor, bot, redes sociales, webs y mas contenido, sin necesidad de tener algún rol o permiso.\n\n> **<#836315643070251008>** en este canal puedes promocionar todo tipo de contenido.\n> .\n> **<#823381769750577163>**: en este canal solo puedes promocionar servidores de **Discord** excepto si es un servidor **NSFW** o **+18**.\n> .\n> **<#823961526297165845>**: en este canal solo puedes promocionar videos de **YouTube** o canales del mismo.\n> .\n> **<#823381980389310464>**: en este canal solo puedes promocionar contenido de **Twitch**, directos y canales.\n> .\n> **<#827295990360965153>**: en este canal solo puedes promocionar contenido de **TikTok**, TikToks, cuentas, etc.\n> .\n> **<#823381924344758313>**: en este canal solo puedes promocionar contenido de **Twitter** como link de una cuenta, etc.\n> .\n> **<#823382007391584276>**: en este canal solo se puede promocionar contenido de **Instagram**, tu cuenta, enlaces, etc.\n> .\n> **<#833750678978822154>**: en este canal solo se puede promocionar **Páginas web**.`
                },
                {
                    valor: `categoría-general`,
                    color: `#F2D904`,
                    miniatura: ``,
                    titulo: `🧭 General`,
                    descripcion: `Categoría **<#837063475552321546>**: en esta categoría encontrarás canales en los que podrás interactuar, charlar, utilizar comandos de bots, ver memes o enviar y mas.\n\n> **<#773404850972524615>**: en este canal puedes hablar con los demás miembros del servidor, de cualquier tema no sensible.\n> .\n> **<#845396662930112533>**: en este canal puedes publicar tus memes, si tus memes tienen buena cantidad de raciones positivas puedes obtener el rol <@&912888572401561620>.\n> .\n> **<#914537165269110804>**: en este canal puedes publicar imágenes o videos del tema que quieras excepto contenido explícito o NSFW.\n> .\n> **<#978791620579299398>**: en este canal puedes hablar con otros miembros de otros servidores gracias al bot <@959204525678424064> el cual une a varios canales de otros servidores en un mismo canal.\n> . **<#834956208112795668>**: este canal es para usar los comandos de los bots que hay en el servidor.\n> .\n> **<#862803602107400232>**: en este canal lo puedes usar para desahogarte insultando, solo en el canal si lo haces en otro canal serás sancionado.\n> .\n> **<#979098277163192400>**: en este canal puedes encontrar imágenes, gifs, vídeos de contenido **NSFW** y tú mismo también puedes publicar dicho contenido.`
                },
                {
                    valor: `categoría-user-x-user`,
                    color: `#D5F204`,
                    miniatura: ``,
                    titulo: `👥 User x user`,
                    descripcion: `Categoría **<#773249398431809587>**: en esta categoría encontrarás canales para hacer join x join que es como decir si te unes me uno, también encontrarás otro tipos de canales.\n\n> **<#826203792788815894>**: en este canal puedes publicar que haces **j4j**.\n> .\n> **<#831677248611418152>**: en este canal puedes publicar **sub x sub** que significa que buscas a alguien que se subscriba a tu canal y tu al suyo.\n> .\n> **<#836447269573099540>**: en este canal puedes publicar **FxF** *(follow por follow)* de una red social.\n> .\n> **<#827296844454690816>**: en este canal puedes encontrar personas que quieran hacer alianzas.`
                },
                {
                    valor: `categoría-entretenimiento`,
                    color: `#AAF204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981984428133/entretenimiento.png`,
                    titulo: `🎮 Entretenimiento`,
                    descripcion: `Categoría **<#834865948837806110>**: en esta categoría encontrarás varios canales en los cuales puedes usar un bot para entretenerte.\n\n> **<#834893418403725342>**: en este canal puedes usar el bot **<@292953664492929025>** que es el bot de economía.\n> .\n> **<#834898232760729680>**: en este canal podrás usar a **<@429457053791158281>** otro bot que tiene una economía pero esta es mundial la cual funciona en cualquier servidor en el que este el bot.\n> .\n> **<#840272810249027604>**: en este canal puedes usar el bot **<@543567770579894272>** es un bot que tienen muchos mini juegos.\n> .\n> **<#838495529046507570>**: en este canal podrás usar a **<@356065937318871041>** un bot que adivina en que personaje famoso estas pensando por medio de preguntas.\n> .\n> **<#866328027892940801>**: en este canal podrás usar a **<@716390085896962058>**, un bot de **Pokemon**.\n> .\n> **<#942980086817239050>**: en este canal podrás usar a **<@715906723982082139>**, un bot de preguntas generales.`
                },
                {
                    valor: `categoría-audio`,
                    color: `#41F204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981263003648/audio.png`,
                    titulo: `🔊 Audio`,
                    descripcion: `Categoría **<#773249398431809588>**: en esta categoría encontrarás canales de voz en los que te puedes reunir con tus amigos para charlar o escuchar música de los bots.\n\n> **<#836671054537424906>**: en este canal puedes poner el nombre la música que quieras escuchar, el bot **<@547905866255433758>** pondrá la música en el canal de voz en el que estás.\n> .\n> **<#773250082552283208>**: este canal es un canal de voz, puedes unirte a el para escuchar música.\n> .\n> **<#828789627082637333>**: este canal es un canal de voz, en el puedes unirte con tus amigos o con un miembro del servidor para hablar.\n> .\n> **<#906925232265265163>**: este canal de voz es para el bot <@830530156048285716> el cual estará reproduciendo **24/7** música.`
                },
                {
                    valor: `categoría-registros`,
                    color: `#0AA105`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971927633757601814/registro.png`,
                    titulo: `📝 Registros`,
                    descripcion: `Categoría **<#881978653452423188>**: en esta categoría se encuentran canales que registran acciones en el servidor.\n\n> **<#833043103048925276>**: en este canal se registra cuando un miembro sube de nivel.\n> .\n> **<#858783283567394826>**: en este canal se registran las sanciones que tienen los miembros.\n> .\n> **<#824462775542743090>**: en este canal se registran los usuarios que han sido invitados por un usuario, la cantidad de usuarios invitados, etc.\n> .\n> **<#964599029927407678>**: en este canal se registra la calificaccion y reseña de cada ticket.`
                },
                {
                    valor: `categoría-soporte`,
                    color: `#05D55A`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925159789350912/soporte.png`,
                    titulo: `🔰 Soporte`,
                    descripcion: `Categoría **<#833120722695487518>**: en esta categoría hay más canales importantes en los que puedes obtener soporte o información.\n\n> **<#830165896743223327>**: en este canal puedes crear un Ticket, **¿Qué es un ticket?** es un canal creado para ti y los miembros de soporte del servidor en donde puedes resolver dudas con ellos, reportar usuario, problemas, pedir ayuda, reclamar un rol, etc.\n> .\n> **<#848992769245577256>**: en este canal esta nuestra plantilla de presentación por si piensas presentar el servidor a un amigo.\n> .\n> **<#840364744228995092>**: este canal es en el que te encuentras ahora, en el podrás obtener información casi de cualquier canal, rol, o sistema del servidor.`
                },
                {
                    valor: `categoría-estadísticas`,
                    color: `#05D5AF`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982215094323/estadisticas.png`,
                    titulo: `📊 Estadísticas`,
                    descripcion: `Categoría **<#823349416882339921>**: en esta categoría encontrarás canales que muestran datos del servidor.\n\n> **<#823349420106973204>**: este canal de voz muestra la cantidad de miembros totales en el servidor.\n> .\n> **<#823349423349301318>**: este canal de voz muestra solo los miembros que no son bots.\n> .\n> **<#823349426264997919>**: este canal de voz muestra en su nombre la cantidad de bots que hay en el servidor.`
                },
                {
                    valor: `roles-exclusivos`,
                    color: `#0590D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971912850186596382/Roles_Exclusivos.png`,
                    titulo: `🏆 Roles exclusivos`,
                    descripcion: `> **<@&865666783217713162>**: al obtener este rol consigues un canal exclusivo en la categoría **<#913490278529261619>** en el cual solo tu lo usaras, podrás publicar contenido cada **4** horas pero solo **1** vez al día con el ping @everyone o @here, podrás gestionar el canal, cambiarle de nombre, editar la descripción, tambien obtendrás un rol personalizado si lo deseas, el rol tendrá un nombre y color personalizado.\n\n> **Para obtener el rol solo hay una forma**\n> **1.** Donar **4** dólares vía [PayPal](https://www.paypal.com/paypalme/srvers).\nUna vez que hayas donado crea un ticket en el canal <#830165896743223327> reclama el rol y los beneficios.\n\n\n> **<@&826197551904325712>**: este rol te da acceso al canal <#826193847943037018> canal en el cual podrás publicar tu promoción cada **6** horas y podrás usar **2** veces a la semana el ping @everyone o @here **Martes** y **Viernes** en tu promoción el día, además que obtendrás un rol personalizado si lo deseas, el rol tendrá un nombre y color personalizado.\n\n> **Para obtener el rol hay 5 formas:**\n> **1. Invitar a **20** miembros al servidor**, para ver la cantidad de invitaciones que has hecho ejecuta el comando de barra diagonal \`\`/información miembro\`\` en el canal <#834956208112795668>, el rol se te será removido cuando los miembros que invitaste se vallan del servidor.\n> **2. Pagar 3 dólares por [PayPal](https://www.paypal.com/paypalme/srvers)**, para hacerlo abre un ticket en <#830165896743223327> o habla con <@717420870267830382>, el rol te durara **2** meses.\n> **3. Comprar el rol en economía**, en el canal <#834893418403725342>.\n> **4. Boostear el servidor o mejorarlo**.\n> **5. Ganarse el rol en un sorteo en el canal** <#826205120173310032>, *no hacemos con frecuencia sorteos de roles*.\nPara resolver cualquier duda o reclamar el rol y los beneficios abre un ticket en el canal <#830165896743223327>.`
                },
                {
                    valor: `roles-personales`,
                    color: `#0551D5`,
                    miniatura: ``,
                    titulo: `🧑 Roles personales`,
                    descripcion: `> **<@&823372926707171358>:** Este rol es el que se te otorga automáticamente al entrar al servidor.\n> **<@&828720340719894579>,<@&828720200924790834>**: Con estos roles determinas tu edad edentro del servidor.\n\n> **<@&828720344869240832>,<@&828720347246624769>**: Con estos roles determinas tu genero dentro del servidor.\n\n> **<@&886331637690953729>, <@&886331642074005545>, <@&886331630690631691>, <@&885005724307054652>, <@&886331626643152906>, <@&886331634272587806>**: Estos roles por ahora no tienen alguna utilidad en el servidor solo son para determinar los videojuegos que te gustan.\nTodos los roles anteriores los puedes obtener en el canal <#823639152922460170>.`
                },
                {
                    valor: `roles-ping`,
                    color: `#4D05D5`,
                    miniatura: `https://media.discordapp.net/attachments/842856076009144381/879941892123533322/notificacion.png?width=480&height=480`,
                    titulo: `🔔 Roles de ping`,
                    descripcion: `> **<@&850932923573338162>**: Este rol te notificará cuando se necesite **revivir el canal <#773404850972524615>**.\n> .\n> **<@&840704358949584926>**: Este rol te notificará cuando haya un nuevo **anuncio** en el canal <#826205120173310032>.\n> .\n> **<@&840704364158910475>**: Este rol te notificará cuando se haya echo una **alianza** con un servidor grande en el canal <#826863938057797633>.\n> .\n> **<@&840704367467954247>**: Este rol te notificará cuando haya un nueva **sugerencia** en el canal <#828300239488024587>.\n> .\n> **<@&840704372911505418>**: Este rol te notificará cuando haya una nueva **encuesta** en el canal <#826205120173310032>.\n> .\n> **<@&840704370387451965>**: Este rol te notificará cuando haya un nuevo **sorteo** en el canal <#826205120173310032>.\n> .\n> **<@&840704375190061076>**: Este rol te notificará cuando este activa alguna **postulación** a algún rol en el canal <#826205120173310032>.\n\nEstos puedes obtener estos roles en el canal <#823639152922460170>.`
                },
                {
                    valor: `roles-nivel`,
                    color: `#9905D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924983066533908/nivel.png`,
                    titulo: `🎖️ Roles de nivel`,
                    descripcion: `> **<@&971515126144442448>\n> <@&971515118837956699>\n> <@&971515112567476354>\n> <@&971515101502902283>\n> <@&891446820851564584>\n> <@&891446815700967434>\n> <@&876274137239265340>\n> <@&876274096990724097>\n> <@&876273903452975134>\n> <@&876273805494988821>\n> <@&838498329650003969>\n> <@&838498326512140329>\n> <@&831671377396367360>\n> <@&831671368776024104>**\n> Estos roles se te otorgan automáticamente conforme aumentes de nivel en el servidor, por ahora no tienen ninguna utilidad ni ventaja solo determinan tu nivel.`
                },
                {
                    valor: `roles-color`,
                    color: `#CC05D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981728563260/colores.png`,
                    titulo: `🌈 Roles de color`,
                    descripcion: `> **<@&825913849504333874>**\n> **<@&825913855392743444>**\n> **<@&825913858446327838>**\n> **<@&825913837944438815>**\n> **<@&823639766226436146>**\n> **<@&823639778926395393>**\n> **<@&825913846571991100>**\n> **<@&823639775499386881>**\n> **<@&825913860992270347>**\n> **<@&825913843645546506>**\n> **<@&823639769300467724>**\n> **<@&825913834803560481>**\n> **<@&825913840981901312>**\n> **<@&825913852654780477>**\n> Estos roles te permiten cambiar el color de tu nombre dentro del servidor solo ve al canal <#823639152922460170> para obtener uno de ellos y cambiar el color de tu nombre.`
                },
                {
                    valor: `roles-economía`,
                    color: `#D50589`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982483546142/economia.png`,
                    titulo: `💸 Roles de economía`,
                    descripcion: `Rol y su paga:\n> **<@&880110963955740742>**: ${emoji.money} **2,000** cada **1** hora.\n> **<@&885005987751297054>**: ${emoji.money} **6,000** cada **1** hora.\n> **<@&880880076072300656>**: ${emoji.money} **18,000** cada **2** horas.\n> **<@&885005729495400448>**: ${emoji.money} **55,000** cada **2** horas.\n> **<@&885304820951580693>**: ${emoji.money} **171,000** cada **3** horas.\n> **<@&885006286809333760>**: ${emoji.money} **533,000** cada **3** horas.\n> **<@&885004466246516756>**: ${emoji.money} **1,726,000** cada **4** horas.\n> **<@&885005037091291166>**: ${emoji.money} **5,695,000** cada **4** horas.\n> **<@&886330270293315624>**: ${emoji.money} **19,135,000** cada **5** horas.\n> **<@&886330276207296652>**: ${emoji.money} **65,441,000** cada **5** horas.\n> **<@&886330280506454057>**: ${emoji.money} **227,734,000** cada **6** horas.\n> **<@&864525011423461376>**: ${emoji.money} **806,178,000** cada **6** horas.\n> **<@&885005727129808906>**: ${emoji.money} **2,902,240,000** cada **7** horas.\n> **<@&880110972365324288>**: ${emoji.money} **8,000,000,000** cada **7** horas.\n> Estos roles de economía los puedes obtener comprando items en la tienda del sistema de economía del bot **<@292953664492929025>** en el canal <#834893418403725342>.`
                },
                {
                    valor: `roles-personal`,
                    color: `#F00505`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925159789350912/soporte.png`,
                    titulo: `👮 Roles del personal`,
                    descripcion: `> Los miembros con el rol **<@&887444598715219999>** son los miembros del personal del servidor, los cuales pueden tener  uno de los siguientes roles que determinan su rango.\n\n> **<@&896039467046023169>**: Los miembros con este rol son los que se encargan exclusivamente de hacer **alianzas** para el servidor.\n\n> **<@&831669132607881236>**: Los miembros que tienen este rol son los que resuelven las dudas de los miembros, ayudan a los **moderadores**, **administradores**, **creadores**, responden **Tickets**, entre otras acciones.\n\n> **<@&773271945894035486>**: Los miembros con este rol mayor mente se encargan de **moderar**, sancionar a miembros que no respetan las reglas, mantener el servidor en orden, etc.\n\n> **<@&847302489732153354>**: Los miembros con este rol se encargan de revisar verificar si todo funciona bien, si los bots funcionan, si los moderadores están realizando las tareas correctamente, si los ayudantes están realizando sus tareas correctamente, brindar **información** a los moderadores, ayudantes y usuarios, realizar acciones de moderadores o de ayudantes, etc.\n\n> **<@&907807597011279923>**: Los miembros con este rol pueden realizar todas las acciones que pueden hacer los miembros con los roles anteriores y tomar decisiones importantes en caso de que no este disponible el dueño.\n\n*Para mas información de como ser un ayudante o cazador de alianzas abre un ticket en <#830165896743223327>.*`
                },
                {
                    valor: `otros-roles`,
                    color: `#F04C05`,
                    miniatura: ``,
                    titulo: `♻️ Otros roles`,
                    descripcion: `> **<@&941731411684122625>**: Este rol es el rol que se le otorga a los miembros con los que hacemos **afiliaciones**.\n> .\n> **<@&895394175481159680>**: Este rol es el rol que se le otorga a los miembros con los que hacemos **alianzas**.\n> .\n> **<@&946139081367240714>**: Este rol se le otorga a los miembros que han echo una sugerencia y su sugerencia a sido **implementada** en el servidor.\n> .\n> **<@&830260561044176896>**: Este rol se le otorga a los miembros que han echo una sugerencia y su sugerencia a sido **aprobada** para ser publicada en el canal <#828300239488024587>.\n> .\n> **<@&830260566861545492>**: Este rol se le otorga a todos los **exstaffs** que tuvieron el rango moderador en adelante.\n> .\n> **<@&830260549098405935>** Este rol se le otorga a los miembros que son enviados a la **cárcel**, por alguna acción mala que han echo.`
                },
                {
                    valor: `bot-servidor`,
                    color: guild?.members.me?.displayHexColor || 'White',
                    miniatura: client.user?.displayAvatarURL({ size: 1024 }) || '',
                    titulo: `🤖 Bot del servidor`,
                    descripcion: `Hola, soy **<@${client.user?.id}>** el bot oficial del servidor, creado por <@717420870267830382>, el <t:${Math.floor((client.user?.createdAt.valueOf() || 0) / 1000)}:F> con la finalidad de hacer el trabajo pesado o difícil de los moderadores y administradores, remplazar a otros bots, hacer acciones complejas que otros bots no pondrían.\n*El objetivo de mi creador es seguir mejorándome hasta remplazar la máxima cantidad de bots que pueda.*`
                },
            ];
            infos.forEach((info) => {
                const embInformacion = new discord_js_1.EmbedBuilder()
                    .setThumbnail(info.miniatura || null)
                    .setTitle(info.titulo)
                    .setDescription(info.descripcion)
                    .setColor(info.color);
                if (int.values[0] == "categoría-importante" && info.valor == "categoría-importante") {
                    const embImportante = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **<#936444065426325577>**: en este canal se colocan las plantillas de los servidores con los que hacemos **afiliaciones**, **¿quieres hacer una afiliación?**, antes revisa los requisitos que están en los mensajes fijados del canal, si cumples con los requisitos abre un ticket en <#830165896743223327> y pide la afiliación.\n> .\n> **<#826863938057797633>**: en este canal se colocan las alianzas con otros servidores, **¿quieres hacer una alianza?**, antes revisa los requisitos que están en la descripción del canal, si cumples con los requisitos abre un ticket en <#830165896743223327> y pide la alianza.\n> .\n> **<#828300239488024587>**: en este canal se publican las sugerencias que hacen los miembros sobre el servidor, **¿Quieres hacer una sugerencia?**, la puedes hacer usando el comando de barra diagonal \`\`/sugerir\`\` en el canal <#834956208112795668>, para evitar perderte de cualquier nueva sugerencia ve al canal <#823639152922460170> y obtén el rol <@&840704367467954247> el cual te notificara en cada nueva sugerencia. `)
                        .setColor(info.color);
                    int.reply({ ephemeral: true, embeds: [embInformacion, embImportante] });
                }
                else if (int.values[0] == "categoría-promociónate" && info.valor == "categoría-promociónate") {
                    const embPromocionate = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **<#833750719307579392>**: en este canal puedes publicar todo lo relacionado con **trabajo**, tu estado laborar *(desempleado y buscas trabajo, buscas empleados, tus conocimientos)*, una página o portafolio donde explique a que te dedicas, tus conocimientos, experiencia, etc.\n> .\n> **<#842893188867817562>**: en este canal solo puedes promocionar **bots** ya sean bots de esta plataforma o otras, su enlace de invitación o página del bot.\n> .\n> **<#899328778566783058>**: en este canal solo puedes promocionar contenido **NSFW** o **+18** ya sean servidores de Discord, redes sociales, páginas web, etc.`)
                        .setColor(info.color);
                    int.reply({ ephemeral: true, embeds: [embInformacion, embPromocionate] });
                }
                else if (int.values[0] == "roles-exclusivos" && info.valor == "roles-exclusivos") {
                    const embExclusivos1 = new discord_js_1.EmbedBuilder()
                        .setDescription(`> **<@&826197378229993503>**: este rol te da acceso al canal <#826193730578153472> canal en el cual podrás publicar cualquier tipo de contenido cada **4** horas exceptuando contenido explicito.\n\n> **Para conseguirlo hay **5** formas:**\n> **1. Invitar a **10** miembros al servidor**, para ver la cantidad de invitaciones que has hecho ejecuta el comando de barra diagonal \`\`/información miembro\`\` en el canal <#834956208112795668>, el rol se te será removido cuando los miembros que invitaste se vallan del servidor.\n> **2. Pagar 2 dólares por [PayPal](https://www.paypal.com/paypalme/srvers)**, el rol te durara **2** meses.\n> **3. Comprar el rol en economía**, en el canal <#834893418403725342>.\n> **4. Boostear el servidor o mejorarlo**, el rol sete será removido si eliminas la mejora o cuando caduque.\n> **5. Ganarse el rol en un sorteo en el canal** <#826205120173310032>, *no hacemos con frecuencia sorteos de roles*.\nPara resolver cualquier duda o reclamar el rol abre un ticket en el canal <#830165896743223327>.\n\n\n> **<@&839549487877062698>**: este rol te representa como **YouTuber**, para conseguirlo tienes que tener un canal de **YouTube** tener mínimo **200** subscriptores y tener tu cuenta de **YouTube** enlazada con la de **Discord**.\n> Si tienes todos los anteriores tienes que abrir un **Ticket** en <#830165896743223327> y pídele el rol a un administrador, el confirmará los datos y te dará el rol.\n\n\n> **<@&839549494659252244>**: Este rol te representa como **Streamer** de **Twitch**, para conseguirlo tienes que tener una media de **60** visitas en cada directo no necesariamente en vivo, tener tu cuanta de **Twitch** enlazada con la de **Discord**.\n> Si tienes los requisitos crea un **Ticket** en <#830165896743223327> y pídele el rol a un administrador, el confirmará los datos y te dará el rol.`)
                        .setColor(info.color);
                    const embExclusivos2 = new discord_js_1.EmbedBuilder()
                        .setDescription(`**<@&851577906828148766>**: Este rol por ahora no te da ninguna ventaja dentro del servidor.\n\n> Se consigue invitando al bot <@935707268090056734> a tu servidor para invitarlo ve al perfil del bot en el encontraras un botón para invitarlo en caso de no encontrarlo usa el comando \`\`u!invite\`\` o menciona al bot, para reclamar el rol habré un **ticket** en  <#830165896743223327>, ayudas bastante al creador del bot invitándolo a tu servidor.`)
                        .setColor(info.color);
                    int.reply({ ephemeral: true, embeds: [embInformacion, embExclusivos1, embExclusivos2] });
                }
                else if (info.valor == int.values[0]) {
                    int.reply({ ephemeral: true, embeds: [embInformacion] });
                }
            });
        }
    }
};
exports.interactionEvent = interactionEvent;
