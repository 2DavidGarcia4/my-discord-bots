"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesCommand = void 0;
const discord_js_1 = require("discord.js");
const rolesCommand = (msg, client) => {
    var _a, _b;
    const color = ((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White';
    const embGenero = new discord_js_1.EmbedBuilder()
        .setTitle("♀️♂️ Roles de género")
        .setDescription(`Elige una opción en el menú de abajo para agregarte un rol y así determinar tu género dentro del servidor.\n\n**<@&828720344869240832>\n\n<@&828720347246624769>**`)
        .setColor(color);
    const menuGenero = new discord_js_1.ActionRowBuilder()
        .addComponents([
        new discord_js_1.SelectMenuBuilder()
            .setCustomId("genero")
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
    const embEdad = new discord_js_1.EmbedBuilder()
        .setTitle("🔢 Roles de edad")
        .setDescription(`Elije una opción en el menú de abajo para agregarte un rol de edad y así determinar tu edad dentro del servidor.\n\n**<@&828720200924790834>\n\n<@&828720340719894579>**`)
        .setColor(color);
    const menuEdad = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.SelectMenuBuilder()
        .setCustomId("edad")
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
    const embVideojuegos = new discord_js_1.EmbedBuilder()
        .setTitle("🎮 Roles de videojuegos")
        .setDescription(`Elige una o más opciones en el menú de abajo para obtener un rol del videojuego que te guste y así los demás miembros sabrán que videojuegos te gustan.\n\n**<@&886331637690953729>\n\n<@&886331642074005545>\n\n<@&886331630690631691>\n\n<@&885005724307054652>\n\n<@&886331626643152906>\n\n<@&886331634272587806>**`)
        .setColor(color);
    const menuVideojuegos = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.SelectMenuBuilder()
        .setCustomId("videojuegos")
        .setPlaceholder("📑 Elige una opción para obtener un rol.")
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
    const embColores = new discord_js_1.EmbedBuilder()
        .setTitle("🌈 Roles de colores")
        .setDescription(`Elige una opción para obtener un rol que cambiará el color de tu nombre dentro del servidor.\n\n**<@&825913849504333874>\n\n<@&825913858446327838>\n\n<@&825913837944438815>\n\n<@&823639766226436146>\n\n<@&823639778926395393>\n\n<@&825913846571991100>\n\n<@&823639775499386881>\n\n<@&825913860992270347>\n\n<@&825913843645546506>\n\n<@&823639769300467724>\n\n<@&825913834803560481>\n\n<@&825913840981901312>\n\n<@&825913855392743444>\n\n<@&825913852654780477>**`)
        .setColor(color);
    const menuColores = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.SelectMenuBuilder()
        .setCustomId("colores")
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
    const embNotificaciones = new discord_js_1.EmbedBuilder()
        .setTitle("🔔 Roles de notificaciones")
        .setDescription(`Elige una opción para obtener un rol que te notificará de nuevos anuncios, alianzas, sorteos, encuestas, eventos, sugerencias de la comunidad o postulaciones a staff del servidor o puedes obtener un rol que te notifica cuando se necesite revivir el chat general el cual es <@&850932923573338162> y puede ser muy usado.\n\n**<@&840704358949584926>\n\n<@&840704364158910475>\n\n<@&840704370387451965>\n\n<@&840704372911505418>\n\n<@&915015715239637002>\n\n<@&840704367467954247>\n\n<@&840704375190061076>\n\n<@&850932923573338162>**`)
        .setColor(color);
    const menuNotificaciones = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.SelectMenuBuilder()
        .setCustomId("notificaciones")
        .setPlaceholder("📑 Elige una opción para obtener un rol.")
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
            label: "Postulaciones",
            emoji: "📝",
            description: "Te notifica cuándo haya una actualización sobre las Postulaciones.",
            value: "postulacion"
        },
        {
            label: "Revivir chat",
            emoji: "❇️",
            description: "Te notifica cuándo se necesite Revivir el chat general.",
            value: "revivir"
        },
    ]));
    msg.channel.send("https://cdn.discordapp.com/attachments/901313790765854720/941377157521883216/roles_svsp.gif").then(tm => {
        msg.channel.send({ embeds: [embGenero], components: [menuGenero] });
        msg.channel.send({ embeds: [embEdad], components: [menuEdad] });
        msg.channel.send({ embeds: [embVideojuegos], components: [menuVideojuegos] });
        msg.channel.send({ embeds: [embColores], components: [menuColores] });
        msg.channel.send({ embeds: [embNotificaciones], components: [menuNotificaciones] });
    });
};
exports.rolesCommand = rolesCommand;
