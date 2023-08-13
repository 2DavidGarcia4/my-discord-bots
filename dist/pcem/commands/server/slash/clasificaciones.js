"use strict";
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
const clasificacionesSlashCommand = async (int, client) => {
    const { options, user, guild } = int, subCommand = options.getSubcommand(true);
    if (subCommand == 'alianzas') {
        const dataAli = await models_1.alliancesModel.findById(db_1.botDB.serverId);
        let ordenado = dataAli?.members.sort((a, b) => b.amount - a.amount), topC = [];
        await int.deferReply();
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
            .setColor(int.guild?.members.me?.displayHexColor || 'White')
            .setTimestamp();
        if (ordenado.length <= 10) {
            alliancesEb
                .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
            (0, functions_1.sendMessageSlash)(int, { embeds: [alliancesEb] });
        }
        else {
            alliancesEb
                .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
                .setFooter({ text: `Pagina ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
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
            setTimeout(async () => {
                const alliansesMessage = await int.editReply({ embeds: [alliancesEb], components: [alliancesButtons] });
                const alliancesCollection = alliansesMessage.createMessageComponentCollector({ time: allPages * 60000 });
                alliancesCollection.on('collect', async (btn) => {
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
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
                        await btn.update({ embeds: [alliancesEb], components: [alliancesButtons] });
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
                            .setFooter({ text: `Pagina - ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined });
                        await btn.update({ embeds: [alliancesEb], components: [alliancesButtons] });
                    }
                });
                alliancesCollection.on("end", () => {
                    int.editReply({ embeds: [alliancesEb], components: [] });
                });
            }, 600);
        }
    }
};
exports.clasificacionesSlashCommand = clasificacionesSlashCommand;
