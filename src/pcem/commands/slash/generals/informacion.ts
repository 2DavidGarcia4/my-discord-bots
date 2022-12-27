import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, User, GuildMember, AutocompleteInteraction } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { alliancesModel, invitesModel, suggestionsModel, ticketsModel } from "../../../models";
import { sendMessageSlash, setSlashError } from "../../../../utils/functions";

export const informacionScb = new SlashCommandBuilder()
.setName("información")
.setDescription(`📖 Muestra información de cosas.`)
.addSubcommand(afiliacion=> afiliacion.setName(`afiliaciones`).setDescription(`✨ Información sobre como hacer una afiliación.`))
.addSubcommand(alianzas=> alianzas.setName(`alianzas`).setDescription(`🤝 Información sobre como hacer una alianza.`))
.addSubcommand(miembro=> miembro.setName(`miembro`).setDescription(`🧑 Muestra información de un miembro sobre los sistemas del bot.`)
  .addUserOption(usuario=> usuario.setName(`usuario`).setDescription(`👤 Proporciona un usuario para ver su información.`).setRequired(false))).toJSON()


export const informacionSlashCommand = async (int: ChatInputCommandInteraction<CacheType>) => {
  const { options, guild, user } = int, subCommand = options.getSubcommand(true), author = guild?.members.cache.get(user.id), { emoji } = botDB

  if(subCommand == "afiliaciones"){
    await int.deferReply()
    estadisticas.comandos++

    const membershipEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
    .setTitle(`${emoji.information} Información sobre afiliaciones`)
    .addFields(
      {name: `📋 **Requisitos para afiliación:**`, value: `**1.** Tener mínimo **1,500** miembros en su servidor.\n**2.** Utilizar ping @everyone o @here obligatorio.\n**3.** Tener una plantilla bien organizada y una invitación qué no expire.\n**4.** Un representante en el servidor.\n**5.** Prohibidos servidores de raid/gore/CP/doxxeo/etc.`},
      {name: `👮 **Soporte:**`, value: `Una vez cumplas con los requisitos para realizar la afiliación abre un ticket en el canal <#830165896743223327> y pide una afiliación, otra forma de pedir una afiliación es pedírsela un miembro del equipo de soporte por su MD *(mensaje directo)* a cualquiera de los miembros que tengan los siguientes roles <@&847302489732153354>, <@&907807597011279923> y <@&839549500237938748>.`},
      {name: `❓ **Datos:**`, value: `Puedes renovar la afiliación despues de un mes.`}
    )
    .setColor(guild?.roles.cache.get('941731411684122625')?.hexColor || 'White')
    .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})
    .setTimestamp()
    
    sendMessageSlash(int, {embeds: [membershipEb]})
  }

  if(subCommand == "alianzas"){
    await int.deferReply()
    estadisticas.comandos++

    const alliancesEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
    .setTitle(`${emoji.information} Información sobre alianzas`)
    .addFields(
      {name: `📋 **Requisitos para alianza:**`, value: `**1.** Servidor con mas de **50** miembros.\n**2.** Servidor no toxico, que no fomente ninguna práctica mala como el raideo.\n**3.** Servidor sin contenido **NSFW** en canales normales debe de estar en canales **NSFW** con restricción de edad.\n**4.** No eliminar la alianza, en caso de hacerlo nosotros lo haremos de la misma manera.\n**5.** Proporcionar su plantilla con una invitación a su servidor que no expire, en caso de que expire eliminaremos su plantilla.`},
      {name: `👮 **Soporte:**`, value: `Una vez cumplas con los requisitos para realizar la alianza abre un ticket en el canal <#830165896743223327> y pide una alianza, otra forma de pedir una alianza es pedírsela un miembro del equipo de soporte por su MD *(mensaje directo)* a cualquiera de los miembros que tenga el rol <@&887444598715219999>.`},
      {name: `❓ **Datos:**`, value: `Puedes renovar tu alianza cada semana.\nSi tu servidor supera los **600** al hacer una alianza con nosotros utilizaremos en tu plantilla la mención del rol <@&895394175481159680> el cual notifica a todos los usuarios que lo tienen.`}
    )
    .setColor(guild?.roles.cache.get('840704364158910475')?.hexColor || 'White')
    .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})
    .setTimestamp()
    
    sendMessageSlash(int, {embeds: [alliancesEb]})
  }

  if(subCommand == "miembro"){
    const dataAli = await alliancesModel.findById(botDB.serverId), dataSug = await suggestionsModel.findById(botDB.serverId), dataTs = await ticketsModel.findById(botDB.serverId), dataInv = await invitesModel.findById(botDB.serverId), userOption = options.getUser('usuario')
    let member = userOption ? (guild?.members.cache.get(userOption.id) || undefined) : undefined
    
    estadisticas.comandos++

    if(member?.user.bot) return setSlashError(int, `El miembro proporcionado *(${member})* es un bot, no puedo mostrar información de los bots.`)

    if(!dataAli) return
    if(!dataSug) return
    if(!dataTs) return
    if(!ticketsModel) return
    if(!invitesModel) return


    const memberInfoEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
    .setColor(int.guild?.members.me?.displayHexColor || 'White')
    .addFields()
    .setTimestamp()

    
    await int.deferReply()
    const isStaff = member ? member.permissions.has('Administrator') || member.roles.cache.has('887444598715219999') : author?.permissions.has('Administrator') || author?.roles.cache.has('887444598715219999')
    if(member){
      let alianzasDB = dataAli.miembros.some(s=> s.id == member?.id), sugerenciasDB = dataSug.miembros.some(s=>s.id == member?.id), ticketsDB = dataTs?.miembros.some(s=>s.id == member?.id), invitesDB = dataInv?.miembros.some(s=> s.id==member?.id)
      let miembroAli = dataAli.miembros.find(f=> f.id == member?.id), miembroSug = dataSug.miembros.find(f=>f.id == member?.id), miembroTik = dataTs?.miembros.find(f=>f.id == member?.id), miembroInv = dataInv?.miembros.find(f=> f.id==member?.id)

      if(member.id == user?.id){
        memberInfoEb
        .setTitle(`${emoji.information} Tu información`)
        .setDescription(`<@${member.id}>`)
        .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})

        if(isStaff && alianzasDB) memberInfoEb.data.fields?.push({name: `🤝 **Alianzas:**`, value: `Has creado ${(miembroAli?.cantidad || 0) <=1 ? `**${miembroAli?.cantidad}** alianza.`: `**${miembroAli?.cantidad}** alianzas.`}`})
        if(sugerenciasDB) memberInfoEb.data.fields?.push({name: `🗳️ **Sugerencias:**`, value: `Has creado ${(miembroSug?.sugerencias || 0)<=1 ? `**${miembroSug?.sugerencias}** sugerencia que aha sido ${miembroSug?.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug?.sugerencias}** sugerencias de las cuales ${miembroSug?.aceptadas==1 ? `**${miembroSug?.aceptadas}** ha sido aceptada`: `**${miembroSug?.aceptadas}** han sido aceptadas`} y ${miembroSug?.denegadas==1 ? `**${miembroSug?.denegadas}** denegada.`: `**${miembroSug?.denegadas}** denegadas.`}`}`})
        if(ticketsDB) memberInfoEb.data.fields?.push({name: `${emoji.ticket} **Tickets:**`, value: `Has creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik?.ticketsCreados}** ticket.`: `**${miembroTik?.ticketsCreados}** tickets.`}`})
        if(invitesDB) memberInfoEb.data.fields?.push({name: `${emoji.invitation} **Invitaciones:**`, value: `Has invitado un total de **${miembroInv?.totales.toLocaleString()}** ${miembroInv?.totales==1 ? `usuario`: `usuarios`} de esos **${miembroInv?.verdaderas.toLocaleString()}** ${miembroInv?.verdaderas==1 ? `aun esta aquí`: `aun están aquí`}, **${miembroInv?.restantes.toLocaleString()}** ${miembroInv?.restantes==1 ? "se ha salido": "se han salido"} y **${miembroInv?.falsas.toLocaleString()}** ${miembroInv?.falsas==1 ? "es una invitación falsa.": "son invitaciones falsas."}`})
        

      }else{
        memberInfoEb
        .setTitle(`${emoji.information} Información de`)
        .setDescription(`<@${member.id}>`)
        .setFooter({text: member.nickname || member.user.username, iconURL: member.displayAvatarURL()})

        if(isStaff && alianzasDB) memberInfoEb.data.fields?.push({name: `🤝 **Alianzas:**`, value: `Ha creado ${(miembroAli?.cantidad || 0) <=1 ? `**${miembroAli?.cantidad}** alianza.`: `**${miembroAli?.cantidad}** alianzas.`}`})
        if(sugerenciasDB) memberInfoEb.data.fields?.push({name: `🗳️ **Sugerencias:**`, value: `Ha creado ${(miembroSug?.sugerencias || 0)<=1 ? `**${miembroSug?.sugerencias}** sugerencia que aha sido ${miembroSug?.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug?.sugerencias}** sugerencias de las cuales ${miembroSug?.aceptadas==1 ? `**${miembroSug?.aceptadas}** ha sido aceptada`: `**${miembroSug?.aceptadas}** han sido aceptadas`} y ${miembroSug?.denegadas==1 ? `**${miembroSug?.denegadas}** denegada.`: `**${miembroSug?.denegadas}** denegadas.`}`}`})
        if(ticketsDB) memberInfoEb.data.fields?.push({name: `${emoji.ticket} **Tickets:**`, value: `Ha creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik?.ticketsCreados}** ticket.`: `**${miembroTik?.ticketsCreados}** tickets.`}`})
        if(invitesDB) memberInfoEb.data.fields?.push({name: `${emoji.invitation} **Invitaciones:**`, value: `Ha invitado un total de **${miembroInv?.totales.toLocaleString()}** ${miembroInv?.totales==1 ? `usuario`: `usuarios`} de esos **${miembroInv?.verdaderas.toLocaleString()}** ${miembroInv?.verdaderas==1 ? `aun esta aquí`: `aun están aquí`}, **${miembroInv?.restantes.toLocaleString()}** ${miembroInv?.restantes==1 ? "se ha salido": "se han salido"} y **${miembroInv?.falsas.toLocaleString()}** ${miembroInv?.falsas==1 ? "es una invitación falsa.": "son invitaciones falsas."}`})
        
      }
      // sendMessageSlash(int, {embeds: [memberInfoEb]})

    }else{
      let alianzasDB = dataAli.miembros.some(s=> s.id == user.id), sugerenciasDB = dataSug.miembros.some(s=>s.id == int.user.id), ticketsDB = dataTs?.miembros.some(s=>s.id == int.user.id), invitesDB = dataInv?.miembros.some(s=> s.id == int.user.id)
      let miembroAli = dataAli.miembros.find(f=> f.id == user.id), miembroSug = dataSug.miembros.find(f=>f.id == int.user.id), miembroTik = dataTs?.miembros.find(f=>f.id == int.user. id), miembroInv = dataInv?.miembros.find(f=> f.id==int.user.id)
            
      memberInfoEb
      .setTitle(`${emoji.information} Tu información`)
      .setDescription(`<@${user.id}>`)
      .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})

      if(isStaff && alianzasDB) memberInfoEb.data.fields?.push({name: `🤝 **Alianzas:**`, value: `Has creado ${(miembroAli?.cantidad || 0)<=1 ? `**${miembroAli?.cantidad}** alianza.`: `**${miembroAli?.cantidad}** alianzas.`}`}) 
      if(sugerenciasDB) memberInfoEb.data.fields?.push({name: `🗳️ **Sugerencias:**`, value: `Has creado ${(miembroSug?.sugerencias || 0)<=1 ? `**${miembroSug?.sugerencias}** sugerencia que aha sido ${miembroSug?.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug?.sugerencias}** sugerencias de las cuales ${miembroSug?.aceptadas==1 ? `**${miembroSug?.aceptadas}** ha sido aceptada`: `**${miembroSug?.aceptadas}** han sido aceptadas`} y ${miembroSug?.denegadas==1 ? `**${miembroSug?.denegadas}** denegada.`: `**${miembroSug?.denegadas}** denegadas.`}`}`})
      if(ticketsDB) memberInfoEb.data.fields?.push({name: `${emoji.ticket} **Tickets:**`, value: `Has creado ${miembroTik?.ticketsCreados==1 ? `**${miembroTik?.ticketsCreados}** ticket.`: `**${miembroTik?.ticketsCreados}** tickets.`}`})
      if(invitesDB) memberInfoEb.data.fields?.push({name: `${emoji.invitation} **Invitaciones:**`, value: `Has invitado un total de **${miembroInv?.totales.toLocaleString()}** ${miembroInv?.totales==1 ? `usuario`: `usuarios`} de esos **${miembroInv?.verdaderas.toLocaleString()}** ${miembroInv?.verdaderas==1 ? `aun esta aquí`: `aun están aquí`}, **${miembroInv?.restantes.toLocaleString()}** ${miembroInv?.restantes==1 ? "se ha salido": "se han salido"} y **${miembroInv?.falsas.toLocaleString()}** ${(miembroInv?.falsas || 0)==1 ? "es una invitación falsa.": "son invitaciones falsas."}`})
    }
    sendMessageSlash(int, {embeds: [memberInfoEb]})
  }
} // 178 a 131