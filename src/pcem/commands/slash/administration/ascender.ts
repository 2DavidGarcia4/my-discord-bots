import { CacheType, ChannelType, ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { botDB } from "../../../db";
import { botModel, personalModel } from "../../../models";
import { setSlashErrors } from "../../../../utils/functions";

export const ascenderScb = new SlashCommandBuilder()
.setName(`ascender`)
.setDescription(`🛗 Haciende de rango a un miembro del personal.`)
.addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`🧑 Miembro del personal a ascender.`).setRequired(true)).toJSON()

export const ascenderSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { options, guild, user } = int, { serverId } = botDB, author = guild?.members.cache.get(user.id)
  const dataPer = await personalModel.findById(serverId), arrayPr = dataPer?.personal
  const dataBot = await botModel.findById(client.user?.id), channelLog = client.channels.cache.get(dataBot?.logs.staff || '') 
  const member = guild?.members.cache.get(options.getUser('miembro', true).id)
 
  if(setSlashErrors(int, [
    [
      Boolean(member?.id == int.user.id),
      `El miembro que has proporcionado *(${member})* eres tu, no te puedens ascender a ti mismo.`
    ],
    [
      Boolean(member?.user.bot),
      `El miembro que has proporcionado *(${member})* es un bot, no puedes ascender a un bot.`
    ],
    [
      Boolean(!arrayPr?.some(s=>s.id == member?.id)),
      `El miembro que has proporcionado *(${member})* no es miembro del personal por lo tanto no lo pueden ascender.`
    ],
    [
      Boolean(arrayPr?.find(f=>f.id == member?.id)?.rango == 5),
      `El miembro que has proporcionado *(${member})* no puede ser ascendido ya que tiene el rango mas alto el cual es **Ejecutivo**.`
    ]
  ])) return

  const persona = arrayPr?.find(f=>f.id == member?.id)
  if(!persona) return

  const rol = dataPer?.datos.roles[persona.rango]
  dataPer?.datos.roles.filter((f: any)=> f!=rol)?.map((m: any)=> member?.roles.remove(m))
  member?.roles.add(rol || '')
  if(!member?.roles.cache.has(dataPer?.datos.rolID || '')){
    member?.roles.add(dataPer?.datos.rolID || '')
  }
  persona.rango++
  persona.historial.push({fecha: Date.now(), accion: `Fue ascendido/a al rango ${persona.rango==2 ? "**Ayudante**": persona.rango==3 ? "**Moderador**": persona.rango==4 ? "**Administrador**": "**Ejecutivo**"} por **${int.user.tag}** *(id: ${int.user.id})*.`})
  const embAcenso = new EmbedBuilder()
  .setAuthor({name: author?.nickname || user.username, iconURL: int.user.displayAvatarURL()})
  .setTitle(`🛗 Acendido`)
  .setDescription(`${member} ha sido ascendido de rango al rango ${persona.rango==2 ? "**Ayudante**": persona.rango==3 ? "**Moderador**": persona.rango==4 ? "**Administrador**": "**Ejecutivo**"} por ${int.user}.`)
  .setColor(int.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: member?.nickname || member?.user.username || 'undefined', iconURL: member?.displayAvatarURL()})
  .setTimestamp()
  int.reply({embeds: [embAcenso]})

  const embRegistro = new EmbedBuilder()
  .setAuthor({name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
  .setTitle(`📝 Registro del comando /ascender`)
  .addFields(
    {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
    {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
    {name: `🛗 **Miembro del personal ascendido:**`, value: `${member}\n**ID:** ${member?.id}`},
    {name: `🎖️ **Rango:**`, value: `${persona.rango==2 ? "Ayudante": persona.rango==3 ? "Moderador": persona.rango==4 ? "Administrador": "Ejecutivo"}`}
  )
  .setColor("#00C624")
  .setFooter({text: member?.user.username || 'undefined', iconURL: member?.displayAvatarURL()})
  .setTimestamp()

  if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embRegistro]})
  await personalModel.findByIdAndUpdate(serverId, {personal: arrayPr})
}