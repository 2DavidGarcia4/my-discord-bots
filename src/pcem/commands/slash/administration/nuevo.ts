import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ChannelType } from "discord.js";
import { botDB } from "../../../db";
import { botModel, personalModel } from "../../../models";
import { sendMessageSlash, setSlashErrors } from "../../../../utils/functions";

export const nuevoScb = new SlashCommandBuilder()
.setName('nuevo')
.setDescription(`Nuevo algo`)
.addSubcommand(cazador=> 
  cazador.setName(`cazador-alianzas`)
  .setDescription(`🏹 Se registra al nuevo cazador de alianzas y se le da los roles correspondientes.`)
  .addUserOption(miembro=> miembro.setName(`cazador`).setDescription(`🧑 Nuevo cazador de alianzas.`).setRequired(true))
)
.addSubcommand(ayudante=> 
  ayudante.setName(`ayudante`)
  .setDescription(`🔷 Se registra al nuevo ayudante en la DB y se le da los roles correspondientes.`)
  .addUserOption(miembro=> miembro.setName(`ayudante`).setDescription(`🧑 Nuevo ayudante.`).setRequired(true))
).toJSON()

export const nuevoSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, options } = int, subCommand = options.getSubcommand(true), author = guild?.members.cache.get(user.id), { serverId } = botDB
  const dataBot = await botModel.findById(client.user?.id), channelLog = client.channels.cache.get(dataBot?.logs.staff || '')
  const dataPer = await personalModel.findById(serverId), arrayPr = dataPer?.personal

  if(subCommand == "cazador-alianzas"){
    const member = guild?.members.cache.get(options.getUser("cazador", true).id)
    if(!dataPer) return
    const miembroPr = arrayPr?.find(f=> f.id==member?.id)

    if(setSlashErrors(int, [
      [
        Boolean(member?.user.bot),
        `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser cazador de alianzas.`
      ],
      [
        Boolean(miembroPr?.miembro),
        `El miembro que has proporcionado *(${member})* ya es miembro del personal.`
      ]
    ])) return

    await int.deferReply()

    if(miembroPr){
      member?.roles.add([dataPer.datos.rolID , dataPer.datos.roles[0]])
      miembroPr.miembro = true
      miembroPr.rango = 1

    }else{
      member?.roles.add([dataPer.datos.rolID, dataPer.datos.roles[0]])
      arrayPr?.push({id: member?.id || '', tag: member?.user.tag || '' , rango: 1, miembro: true, historial: [{fecha: Date.now(), accion: (miembroPr ? `Volvió a formar parte del personal del servidor con el rango **Cazador/a de alianzas** por **${int.user.tag}** *(id: ${int.user.id})*.`: `Formo parte del personal del servidor con el rango **Cazador/a de alianzas** por **${int.user.tag}** *(id: ${int.user.id})*.`)}]})
    }
    await personalModel.findByIdAndUpdate(serverId, {personal: arrayPr})

    const NuevoCazadorEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || user.username, iconURL: user.displayAvatarURL()})
    .setTitle(`🏹 Nuevo cazador de alianzas`)
    .setDescription(miembroPr ? `${member} volvió a ser miembro del personal del servidor con el rango **Cazador/a de alianzas**.`: `Ahora ${member} es nuevo/a miembro del personal del servidor con el rango **Cazador/a de alianzas**.`)
    .setColor(guild?.members.me?.displayHexColor || 'White')
    .setFooter({text: member?.nickname || member?.user.username || 'undefined', iconURL: member?.displayAvatarURL()})
    .setTimestamp()

    sendMessageSlash(int, {embeds: [NuevoCazadorEb]})

    const LogEb = new EmbedBuilder()
    .setAuthor({name: `Ejecutado por ${user.tag}`, iconURL: user.displayAvatarURL()})
    .setTitle(`📝 Registro del comando /nuevo cazador-alianzas`)
    .addFields(
      {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
      {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
      {name: `🏹 **Nuevo cazador de alianzas:**`, value: `${member}\n**ID:** ${member?.id}`},
    )
    .setColor("#00F0FF")
    .setFooter({text: member?.user.username || 'undefined', iconURL: member?.displayAvatarURL()})
    .setTimestamp()
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [LogEb]})
  }

  if(subCommand == "ayudante"){
    const member = guild?.members.cache.get(options.getUser("ayudante", true).id)
    if(!dataPer) return
    const miembroPr = arrayPr?.find(f=> f.id==member?.id)

    if(setSlashErrors(int, [
      [
        Boolean(member?.user.bot),
        `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser ayudante.`
      ],
      [
        Boolean(miembroPr?.miembro),
        `El miembro que has proporcionado *(${member})* ya es miembro del personal.`
      ]
    ])) return

    await int.deferReply()

    if(miembroPr){
      member?.roles.add([dataPer.datos.rolID, dataPer.datos.roles[1]])
      miembroPr.miembro = true
      miembroPr.rango = 2
    }else if(member){
      member?.roles.add([dataPer.datos.rolID, dataPer.datos.roles[1]])
      arrayPr?.push({id: member.id, tag: member.user.tag, rango: 2, miembro: true, historial: [{fecha: Date.now(), accion: (miembroPr ? `Volvió a formar parte del personal del servidor con el rango **Ayudante** por **${int.user.tag}** *(id: ${int.user.id})*.`: `Formo parte del personal del servidor con el rango **Ayudante** por **${int.user.tag}** *(id: ${int.user.id})*.`)}]})
    }
    await personalModel.findByIdAndUpdate(serverId, {personal: arrayPr})

    const NuevoAyudanteEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || user?.username || 'undefined', iconURL: user?.displayAvatarURL()})
    .setTitle(`🔷 Nuevo ayudante`)
    .setDescription(miembroPr ? `${member} volvió a ser miembro del personal del servidor con el rango **Ayudante**.`: `Ahora ${member} es nuevo/a miembro del personal del servidor con el rango **Ayudante**.`)
    .setColor(guild?.members.me?.displayHexColor || 'White')
    .setFooter({text: member?.nickname || member?.user.username || 'undefined', iconURL: member?.displayAvatarURL()})
    .setTimestamp()
    
    sendMessageSlash(int, {embeds: [NuevoAyudanteEb]})

    const logEb = new EmbedBuilder()
    .setAuthor({name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
    .setTitle(`📝 Registro del comando /nuevo ayudante`)
    .addFields(
        {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: `🔷 **Nuevo ayudante:**`, value: `${member}\n**ID:** ${member?.id}`},
    )
    .setColor("#00FF83")
    .setFooter({text: member?.user.username || 'undefined', iconURL: member?.displayAvatarURL()})
    .setTimestamp()
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [logEb]})
  }
}