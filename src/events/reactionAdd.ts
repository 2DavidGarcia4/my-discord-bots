import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { botDB } from "../db";
import { rafflesModel, suggestionsModel, surveysModel, ticketsModel } from "../models";

export const reactionAddEvent = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: Client) => {
  const { serverId, emoji } = botDB
  if(reaction.message.guildId != serverId || user.bot) return;

  //? Sistema de encuestas
  let dataEnc = await surveysModel.findById(serverId), arrayEn = dataEnc?.encuestas
  if(arrayEn?.filter(f=> f.activa).some(s=>s.id == reaction.message.id) && arrayEn?.find(f=> f.id == reaction.message.id)?.opciones.some(s=> s.emoji==reaction.emoji.name)){
    const encuesta = arrayEn.find(f=> f.id == reaction.message.id)
    let totalVotos = 0, tabla = []
    encuesta?.opciones.filter(f=> f.emoji!=reaction.emoji.name).map(m=> reaction.message.reactions.cache.get(m.emoji)?.users.remove(user.id))
    if(encuesta){
      for(let c of encuesta.opciones){
        const reactionCounts = (reaction.message.reactions.cache.get(c.emoji)?.count || 2)
        if(c.emoji!=reaction.emoji.name && reaction.message.reactions.cache.get(c.emoji)?.users.cache.has(user.id)){
          totalVotos += reactionCounts-2
          c.votos = reactionCounts-2
        }else{
          totalVotos+=reactionCounts-1
          c.votos=reactionCounts-1
        }
      }
      await surveysModel.findByIdAndUpdate(serverId, {encuestas: arrayEn})

      for(let o of encuesta.opciones){
        const porcentaje = (o.votos*100/totalVotos).toFixed(2), carga = "█", vacio = " "
        let diseño = ""
        
        for(let i=0; i<20; i++){
          if(i < parseInt(porcentaje)/100*20) diseño = diseño.concat(carga)
          else diseño = diseño.concat(vacio)
        }
        tabla.push(`${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
      }
    }
      

    const embed = reaction.message.embeds[0]
    embed.fields[0].value = tabla.join("\n\n")
    reaction.message.edit({embeds: [embed]})
  }


  //? Sistema de sorteos
  const dataSor = await rafflesModel.findById(serverId), arraySo = dataSor?.sorteos
  if(arraySo?.filter(f=> f.activo).some(s=> s.id == reaction.message.id) && reaction.emoji.id==dataSor?.datos.emojiID){
    const sorteo = arraySo?.find(f=> f.id == reaction.message.id)
    if(!sorteo?.participantes.some(s=> s==user.id)){
      sorteo?.participantes.push(user.id)
      await rafflesModel.findByIdAndUpdate(serverId, {sorteos: arraySo})
    }
  }


  //? Sistema de tickets
  // const starsEmojis = [{id: "963478022369980517", reaccion: false}, {id: "963478099578728448", reaccion: false}, {id: "963478146089377872", reaccion: false}, {id: "963478173562052628", reaccion: false}, {id: "963478195498254387", reaccion: false}]
  // const dataTs = await ticketsModel.findById(serverId), arrayTs = dataTs?.tickets, arrayMs = dataTs?.miembros

  // arrayTs?.forEach(async (ticket) => {
  //   if(starsEmojis.some(e=> e.id == reaction.emoji.id) && ticket.msgValoracionID == reaction.message.id){
  //     if(user.id == ticket.miembroID){
  //       reaction.message.reactions.cache.map(m=> m).forEach((tsReaction, ps) =>{
  //         if(tsReaction.users.cache.some(s=> s.id == ticket.miembroID) && !starsEmojis.find(f=> f.id == tsReaction.emoji.id)?.reaccion){
  //           const starEmoji = starsEmojis.find(f=>f.id == tsReaction.emoji.id)
  //           starEmoji && (starEmoji.reaccion = true)
  //         }
  //       })

  //       arrayMs?.forEach((objetoMs) => {
  //         if(objetoMs.id == user.id){
  //           objetoMs.reseñas.forEach((objRes) => {
  //             if(objRes.ticketID == ticket.id){
  //               if(starsEmojis.filter(f=> f.reaccion).length==1){
  //                 objRes.starsEmojis = starsEmojis.findIndex(f=> f.reaccion)+1
  //               }else{
  //                 objRes.starsEmojis = starsEmojis.filter(f=> f.reaccion).length
  //               }
  //             }
  //           })
  //         }
  //       })
  //       if(!ticket.valoracion) ticket.valoracion = true
        
  //       await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs, miembros: arrayMs})
  //     }else reaction.users.remove(user.id)
  //   }
  // })


  //? sistema de sugerencias
  const dataSug = await suggestionsModel.findById(serverId), msgsSug = dataSug?.mensajes

  msgsSug?.forEach(async msgSug => {
    if(msgSug.id == reaction.message.id){
      if(reaction.emoji.id == "946826193032851516"){
        reaction.message.reactions.cache.get("946826212960010251")?.users.remove(user.id)

        let positivas = (reaction.count || 1)-1, negativas = msgSug.negativas, totales = positivas + negativas

        let porcentajePositivo = (positivas*100/totales).toFixed(2)
        let porcentajeNegativo = (negativas*100/totales).toFixed(2)

        let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = ""
        
        for(let i=0; i<20; i++){
          if(i < parseInt(porcentajePositivo)/100*20){
            diseñoPositivo = diseñoPositivo.concat(carga)
          }else{
            diseñoPositivo = diseñoPositivo.concat(vacio)
          }

          if(i < parseInt(porcentajeNegativo)/100*20){
            diseñoNegativo = diseñoNegativo.concat(carga)
          }else{
            diseñoNegativo = diseñoNegativo.concat(vacio)
          }
        }

        const fileName = `📊 Votos: **${totales}**`
        const fileDescription = `${emoji.like} ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n${emoji.dislike} ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`

        if(reaction.message.embeds[0].fields.length <= 0){
          const embed = reaction.message.embeds[0]
          embed.fields.push({
            name: fileName, 
            value: fileDescription
          })
          reaction.message.edit({embeds: [embed]})
        }else{
          const embed = reaction.message.embeds[0]

          embed.fields[0].name = fileName
          embed.fields[0].value = fileDescription
          reaction.message.edit({embeds: [embed]})
        }

        msgSug.positivas = positivas
        msgSug.negativas = negativas

        await suggestionsModel.findByIdAndUpdate(serverId, {mensajes: msgsSug})
      }

      if(reaction.emoji.id == "946826212960010251"){
        reaction.message.reactions.cache.get("946826193032851516")?.users.remove(user.id)

        let positivas = msgSug.positivas, negativas = (reaction.count || 1)-1, totales = positivas + negativas

        let porcentajePositivo = String(positivas*100/totales).slice(0,5)
        let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


        let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = ""

        for(let i=0; i<20; i++){
          if(i < Number(porcentajePositivo)/100*20){
            diseñoPositivo = diseñoPositivo.concat(carga)
          }else{
            diseñoPositivo = diseñoPositivo.concat(vacio)
          }

          if(i < Number(porcentajeNegativo)/100*20){
            diseñoNegativo = diseñoNegativo.concat(carga)
          }else{
            diseñoNegativo = diseñoNegativo.concat(vacio)
          }
        }

        const fileName = `📊 Votos: **${totales}**`
        const fileDescription = `${emoji.like} ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n${emoji.dislike} ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`

        if(reaction.message.embeds[0].fields.length <= 0){
          const embed = reaction.message.embeds[0]
          embed.fields.push({
            name: fileName, 
            value: fileDescription
          })
          reaction.message.edit({embeds: [embed]})
        }else{
          const embed = reaction.message.embeds[0]

          embed.fields[0].name = fileName
          embed.fields[0].value = fileDescription
          reaction.message.edit({embeds: [embed]})
        }

        msgSug.positivas = positivas
        msgSug.negativas = negativas

        await suggestionsModel.findByIdAndUpdate(serverId, {mensajes: msgsSug})
      }
    }
  })
}