import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { alliancesModel, ticketsModel } from "../../../models";
import { sendMessageSlash } from "../../../../utils/functions";

export const clasificacionesScb = new SlashCommandBuilder()
.setName('clasificaciones')
.setDescription(`📑 Accede a las clasificaciones de los sistemas del bot.`)
.addSubcommand(sub1=> sub1.setName(`alianzas`).setDescription(`🤝 Muestra una tabla de clasificaciones de todos los miembros que han echo alianzas.`))
.addSubcommand(sub2=> sub2.setName(`tickets`).setDescription(`🎫 Muestra una tabla de clasificaciones de todos los miembros que han creado tickets.`)).toJSON()

export const clasificacionesSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { options, user, guild } = int, subCommand = options.getSubcommand(true)

  if(subCommand == 'alianzas'){
    const dataAli = await alliancesModel.findById(botDB.serverId)
    let ordenado = dataAli?.miembros.sort((a,b)=> b.cantidad - a.cantidad), topC: any[] = []
    
    await int.deferReply()
    estadisticas.comandos++

    if(!dataAli || !ordenado) return

    dataAli.miembros.forEach((valor, ps) => {
      let usuario = client.users.cache.get(valor.id)
      if(usuario){
        if(usuario.id == int.user.id){
          topC.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}. [${usuario.tag}](${usuario.displayAvatarURL({ size: 4096})}) - ${(valor.cantidad).toLocaleString()}**\n**ID: ${usuario.id}**`)
        }else{
          topC.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}.** [${usuario.tag}](${usuario.displayAvatarURL({ size: 4096})}) - **${(valor.cantidad).toLocaleString()}**\n**ID:** ${usuario.id}`)
        }
      }
    })
     
    let allPages = 0
    if(ordenado && String(ordenado.length).slice(-1) == '0'){
      allPages = Math.floor(ordenado.length / 10)
    }else{
      allPages = Math.floor(ordenado.length / 10 + 1)
    }

    let start = 0, end = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta": "miembros que están"} en la tabla.\n\n`

    const alliancesEb = new EmbedBuilder()
    .setTitle(`🤝 Tabla de clasificaciones del sistema de alianzas`)
    .setColor(int.guild?.members.me?.displayHexColor || 'White')
    .setTimestamp()

    if(ordenado.length <= 10){
      alliancesEb
      .setDescription(descripcion+topC.slice(start, end).join("\n\n"))
      .setFooter({text: `Pagina ${pagina}/${allPages}` , iconURL: int.guild?.iconURL() || undefined})
      sendMessageSlash(int, {embeds: [alliancesEb]})

    }else{
      alliancesEb
      .setDescription(descripcion+topC.slice(start, end).join("\n\n"))
      .setFooter({text: `Pagina ${pagina}/${allPages}` , iconURL: int.guild?.iconURL() || undefined})

      const alliancesButtons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        [
          new ButtonBuilder()
          .setCustomId('previous')
          .setLabel("Anterior")
          .setEmoji(botDB.emoji.leftArrow)
          .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
          .setCustomId('next')
          .setLabel("Siguiente")
          .setEmoji(botDB.emoji.rightArrow)
          .setStyle(ButtonStyle.Primary)
        ]
      ).toJSON()
         
      setTimeout(async ()=>{
        const alliansesMessage = await int.editReply({embeds: [alliancesEb], components: [alliancesButtons]})
        const alliancesCollection = alliansesMessage.createMessageComponentCollector({time: allPages*60000})
        
        alliancesCollection.on('collect', async btn => {
          if (btn.customId == 'previous') {
            if (end - 10 <= 10) {
              alliancesButtons.components[0].style = ButtonStyle.Secondary
              alliancesButtons.components[0].disabled = true
              alliancesButtons.components[1].disabled = false
              alliancesButtons.components[1].style = ButtonStyle.Primary
              
            } else {
              alliancesButtons.components[0].style = ButtonStyle.Primary
              alliancesButtons.components[0].disabled = false
              alliancesButtons.components[1].disabled = false
              alliancesButtons.components[1].style = ButtonStyle.Primary
            }
            start -= 10, end -= 10, pagina--

            alliancesEb
            .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            await btn.update({ embeds: [alliancesEb], components: [alliancesButtons] })
          }

          if(btn.customId == 'next') {
            if(end + 10 >= topC.length){
              alliancesButtons.components[0].disabled = false
              alliancesButtons.components[0].style = ButtonStyle.Primary
              alliancesButtons.components[1].style = ButtonStyle.Secondary
              alliancesButtons.components[1].disabled = true

            }else{
              alliancesButtons.components[0].style = ButtonStyle.Primary
              alliancesButtons.components[0].disabled = false
              alliancesButtons.components[1].disabled = false
              alliancesButtons.components[1].style = ButtonStyle.Primary
            }
            start += 10, end += 10, pagina++

            alliancesEb
            .setDescription(descripcion + topC.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            await btn.update({ embeds: [alliancesEb], components: [alliancesButtons] })
          }
        })

        alliancesCollection.on("end", () => {
          int.editReply({embeds: [alliancesEb], components: []})
        })
      }, 600)
    }  
  }

  if(subCommand == 'tickets'){
    const dataTs = await ticketsModel.findById(botDB.serverId), ordenado = dataTs?.miembros.sort((a,b)=> b.ticketsCreados - a.ticketsCreados), topTs: any[] = []
    let cantidadDereseñas = 0, allPages = 0
    
    await int.deferReply()
    estadisticas.comandos++

    if(!dataTs || !ordenado) return

    for(const i in ordenado){
      let reseñas = ordenado[i].reseñas.filter((f: any)=> f.reseña!=false).length
      cantidadDereseñas += reseñas
      let miembro = int.guild?.members.cache.get(ordenado[i].id)
      if(miembro){
        if(miembro.id == int.user.id){
          topTs.push(`**${Number(i)+1}. [${miembro.user.tag}](${miembro.displayAvatarURL({size: 4096})})**\n**ID:** ${miembro.id}\nTickets: **${ordenado[i].ticketsCreados.toLocaleString()}**\nReseñas: **${reseñas.toLocaleString()}**`)
        }else{
          topTs.push(`**${Number(i)+1}.** [${miembro.user.tag}](${miembro.displayAvatarURL({size: 4096})})\n**ID:** ${miembro.id}\nTickets: **${ordenado[i].ticketsCreados.toLocaleString()}**\nReseñas: **${reseñas.toLocaleString()}**`)
        }
      }
    }
     
    if(ordenado && String(ordenado.length).slice(-1) == '0'){
      allPages = Math.floor(ordenado.length / 10)
    }else{
      allPages = Math.floor(ordenado.length / 10 + 1)
    }

    let start = 0, end = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta": "miembros que están"} en la tabla y **${cantidadDereseñas}** reseñas.\n\n`

    const ticketsEb = new EmbedBuilder()
    .setTitle(`${botDB.emoji.ticket} Tabla de clasificaciones del sistema de tickets`)
    .setColor(int.guild?.members.me?.displayHexColor || 'White')
    .setTimestamp()

    if(ordenado.length <= 10){
      ticketsEb
      .setDescription(descripcion+topTs.slice(start, end).join("\n\n"))
      .setFooter({text: `Pagina ${pagina}/${allPages}` , iconURL: int.guild?.iconURL() || undefined})
      sendMessageSlash(int, {embeds: [ticketsEb]})

    }else{
      ticketsEb
      .setDescription(descripcion+topTs.slice(start, end).join("\n\n"))
      .setFooter({text: `Pagina ${pagina}/${allPages}` , iconURL: int.guild?.iconURL() || undefined})

      const ticketsButtons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        [
          new ButtonBuilder()
          .setCustomId('previous')
          .setLabel("Anterior")
          .setEmoji(botDB.emoji.leftArrow)
          .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
          .setCustomId('next')
          .setLabel("Siguiente")
          .setEmoji(botDB.emoji.rightArrow)
          .setStyle(ButtonStyle.Primary)
        ]
      ).toJSON()
         
      setTimeout(async ()=>{
        const alliansesMessage = await int.editReply({embeds: [ticketsEb], components: [ticketsButtons]}), { components } = ticketsButtons
        const alliancesCollection = alliansesMessage.createMessageComponentCollector({time: allPages*60000})
        
        alliancesCollection.on('collect', async btn => {
          if (btn.customId == 'previous') {
            if (end - 10 <= 10) {
              components[0].style = ButtonStyle.Secondary
              components[0].disabled = true
              components[1].disabled = false
              components[1].style = ButtonStyle.Primary
              
            } else {
              components[0].style = ButtonStyle.Primary
              components[0].disabled = false
              components[1].disabled = false
              components[1].style = ButtonStyle.Primary
            }
            start -= 10, end -= 10, pagina--

            ticketsEb
            .setDescription(descripcion + topTs.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            await btn.update({ embeds: [ticketsEb], components: [ticketsButtons] })
          }

          if(btn.customId == 'next') {
            if(end + 10 >= topTs.length){
              components[0].style = ButtonStyle.Primary
              components[0].disabled = false
              components[1].disabled = true
              components[1].style = ButtonStyle.Secondary

            }else{
              components[0].style = ButtonStyle.Primary
              components[0].disabled = false
              components[1].disabled = false
              components[1].style = ButtonStyle.Primary
            }
            start += 10, end += 10, pagina++

            ticketsEb
            .setDescription(descripcion + topTs.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${pagina}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            await btn.update({ embeds: [ticketsEb], components: [ticketsButtons] })
          }
        })

        alliancesCollection.on("end", () => {
          int.editReply({embeds: [ticketsEb], components: []})
        })
      }, 600)
    }  
  }
}