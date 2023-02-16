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
exports.clasificacionesSlashCommand = exports.clasificacionesScb = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("../../../db");
const models_1 = require("../../../models");
const functions_1 = require("../../../../shared/functions");
exports.clasificacionesScb = new discord_js_1.SlashCommandBuilder()
    .setName('clasificaciones')
    .setDescription(`📑 Accede a las clasificaciones de los sistemas del bot.`)
    .addSubcommand(sub1 => sub1.setName(`alianzas`).setDescription(`🤝 Muestra una tabla de clasificaciones de todos los miembros que han echo alianzas.`)).toJSON();
const clasificacionesSlashCommand = (int, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { options, user, guild } = int, subCommand = options.getSubcommand(true);
    if (subCommand == 'alianzas') {
        const dataAli = yield models_1.alliancesModel.findById(db_1.botDB.serverId);
        let ordenado = dataAli === null || dataAli === void 0 ? void 0 : dataAli.members.sort((a, b) => b.amount - a.amount), topC = [];
        yield int.deferReply();
        if (!dataAli || !ordenado)
            return;
        dataAli.members.forEach((valor, ps) => {
            let usuario = client.users.cache.get(valor.id);
            if (usuario) {
                if (usuario.id == int.user.id) {
                    topC.push(`**${ps == 0 ? "🥇" : ps == 1 ? "🥈" : ps == 2 ? "🥉" : ps + 1}. [${usuario.tag}](${usuario.displayAvatarURL({ size: 4096 })}) - ${(valor.amount).toLocaleString()}**\n**ID: ${usuario.id}**`);
                }
                else {
                    topC.push(`**${ps == 0 ? "🥇" : ps == 1 ? "🥈" : ps == 2 ? "🥉" : ps + 1}.** [${usuario.tag}](${usuario.displayAvatarURL({ size: 4096 })}) - **${(valor.amount).toLocaleString()}**\n**ID:** ${usuario.id}`);
                }
            }
        });
        let allPages = 0;
        if (ordenado && String(ordenado.length).slice(-1) == '0') {
            allPages = Math.floor(ordenado.length / 10);
        }
        else {
            allPages = Math.floor(ordenado.length / 10 + 1);
        }
        let start = 0, end = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta" : "miembros que están"} en la tabla.\n\n`;
        const alliancesEb = new discord_js_1.EmbedBuilder()
            .setTitle(`🤝 Tabla de clasificaciones del sistema de alianzas`)
            .setColor(((_b = (_a = int.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.displayHexColor) || 'White')
            .setTimestamp();
        if (ordenado.length <= 10) {
            alliancesEb
                .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: ((_c = int.guild) === null || _c === void 0 ? void 0 : _c.iconURL()) || undefined });
            (0, functions_1.sendMessageSlash)(int, { embeds: [alliancesEb] });
        }
        else {
            alliancesEb
                .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: ((_d = int.guild) === null || _d === void 0 ? void 0 : _d.iconURL()) || undefined });
            const alliancesButtons = new discord_js_1.ActionRowBuilder()
                .addComponents([
                new discord_js_1.ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel("Anterior")
                    .setEmoji(db_1.botDB.emoji.leftArrow)
                    .setStyle(discord_js_1.ButtonStyle.Secondary),
                new discord_js_1.ButtonBuilder()
                    .setCustomId('next')
                    .setLabel("Siguiente")
                    .setEmoji(db_1.botDB.emoji.rightArrow)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
            ]).toJSON();
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const alliansesMessage = yield int.editReply({ embeds: [alliancesEb], components: [alliancesButtons] });
                const alliancesCollection = alliansesMessage.createMessageComponentCollector({ time: allPages * 60000 });
                alliancesCollection.on('collect', (btn) => __awaiter(void 0, void 0, void 0, function* () {
                    var _e, _f;
                    if (btn.customId == 'previous') {
                        if (end - 10 <= 10) {
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Secondary;
                            alliancesButtons.components[0].disabled = true;
                            alliancesButtons.components[1].disabled = false;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        else {
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                            alliancesButtons.components[0].disabled = false;
                            alliancesButtons.components[1].disabled = false;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start -= 10, end -= 10, pagina--;
                        alliancesEb
                            .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: ((_e = int.guild) === null || _e === void 0 ? void 0 : _e.iconURL()) || undefined });
                        yield btn.update({ embeds: [alliancesEb], components: [alliancesButtons] });
                    }
                    if (btn.customId == 'next') {
                        if (end + 10 >= topC.length) {
                            alliancesButtons.components[0].disabled = false;
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Secondary;
                            alliancesButtons.components[1].disabled = true;
                        }
                        else {
                            alliancesButtons.components[0].style = discord_js_1.ButtonStyle.Primary;
                            alliancesButtons.components[0].disabled = false;
                            alliancesButtons.components[1].disabled = false;
                            alliancesButtons.components[1].style = discord_js_1.ButtonStyle.Primary;
                        }
                        start += 10, end += 10, pagina++;
                        alliancesEb
                            .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: ((_f = int.guild) === null || _f === void 0 ? void 0 : _f.iconURL()) || undefined });
                        yield btn.update({ embeds: [alliancesEb], components: [alliancesButtons] });
                    }
                }));
                alliancesCollection.on("end", () => {
                    int.editReply({ embeds: [alliancesEb], components: [] });
                });
            }), 600);
        }
    }
});
exports.clasificacionesSlashCommand = clasificacionesSlashCommand;
