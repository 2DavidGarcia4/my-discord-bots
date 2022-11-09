import { ChannelType, Client, EmbedBuilder, GuildMember, PartialGuildMember } from "discord.js";
import ms from "ms";
import { estadisticas } from "..";
import { botDB } from "../db";
import { botModel, collaboratorsModel, invitesModel, personalModel, promoLevelModel } from "../models";

export const memberRemoveEvent = async (gmr: GuildMember | PartialGuildMember, client: Client) => {
  if(gmr.guild.id != botDB.serverId) return;
  estadisticas.salidas++
  
  const dataBot = await botModel.findById(client.user?.id)
  const dataInv = await invitesModel.findById(botDB.serverId), arrayMi = dataInv?.miembros
  if(!dataBot) return

  const leaveLog = client.channels.cache.get(dataBot.logs.exit)
  if(leaveLog?.type != ChannelType.GuildText) return
  
  const leaveLogEb = new EmbedBuilder()
  if(gmr.user.bot){
    leaveLogEb
    .setTitle("🤖 Se fue un bot")
    .setThumbnail(gmr.displayAvatarURL())
    .setDescription(`${gmr}\n${gmr.user.tag}\nSeunio: <t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`)
    .setColor('Orange')
    .setTimestamp()

  }else{
    // if(leaveLog?.type != ChannelType.GuildText) return
    const mbanner = await client.users.fetch(gmr.id, {force: true})
    leaveLogEb
    .setAuthor({name: gmr.user.username, iconURL: gmr.user.displayAvatarURL({size: 2048})})
    .setThumbnail(gmr.user.displayAvatarURL())
    .setImage(mbanner.bannerURL({size: 2048}) || null)
    .setTitle("📤 Se fue un miembro")
    .setDescription(`Se fue ${gmr} (*no se por quien fue invitado/a*).\n📥 **Seunio:**\n<t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`)
    .setColor("#ff0000")
    .setFooter({text: gmr.guild.name, iconURL: gmr.guild.iconURL() || undefined})
    .setTimestamp()

    if(arrayMi){
      for(let m of arrayMi){
        if(m.invitados.some(s=> s.id==gmr.user.id)){
          const invitado = m.invitados.find(f=> f.id==gmr.user.id)
          if(invitado?.miembro){
            m.verdaderas--
            m.restantes++
            invitado.miembro = false
            leaveLogEb.data.description = `Se fue ${gmr} *había sido invitado/a por <@${m.id}> quien ahora tiene **${m.verdaderas.toLocaleString()}** ${m.verdaderas==1 ? "invitación": "invitaciones"}.*\n📥 **Seunio:**\n<t:${Math.round((gmr.joinedAt?.valueOf() || 0) / 1000)}:R>`
          }
        }
      }

    }
    leaveLog.send({embeds: [leaveLogEb]})

    const miembro = arrayMi?.find(f=> f.id==gmr.user.id)
    if(miembro){
      miembro.tiempo = Math.floor(Date.now()+ms("30d"))
    }
    await invitesModel.findByIdAndUpdate(botDB.serverId, {miembros: arrayMi})

    // Colaboradores
    let dataCol = await collaboratorsModel.findById(botDB.serverId), arrayCo = dataCol?.colaboradores
    if(arrayCo?.some(s=>s.id == gmr.id)){
      arrayCo.splice(arrayCo.findIndex(f=>f.id == gmr.id),1)
      await collaboratorsModel.findByIdAndUpdate(botDB.serverId, {colaboradores: arrayCo})
    }

    // Personal
    let dataPer = await personalModel.findById(botDB.serverId), arrayPr = dataPer?.personal
    if(arrayPr?.some(s=> s.id==gmr.id)){
      let persona = arrayPr.find(f=> f.id==gmr.id)
      if(persona) persona.miembro = false
      await personalModel.findByIdAndUpdate(botDB.serverId, {personal: arrayPr})
    }

    // PromoNvl
    let dataPrl = await promoLevelModel.findById(botDB.serverId), arrayPl = dataPrl?.miembros
    if(arrayPl?.some(s=> s.id==gmr.id)){
      arrayPl.splice(arrayPl.findIndex(f=> f.id==gmr.id),1)
      await promoLevelModel.findByIdAndUpdate(botDB.serverId, {miembros: arrayPl})
    }
  }
}