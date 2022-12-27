import { SlashCommandBuilder, EmbedBuilder, CacheType, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from "discord.js"
import { estadisticas } from "../../.."
import { botDB } from "../../../db"
import { collaboratorsModel, personalModel } from "../../../models"
import { sendMessageSlash, setSlashError, setSlashErrors } from "../../../../utils/functions"

export const historialSmb = new SlashCommandBuilder()
.setName(`historial`)
.setDescription(`🗒️ Historial, DX`)
.addSubcommand(colaboradores=> colaboradores.setName(`colaboradores`).setDescription(`💎 Muestra una lista de todos los colaboradores actuales y los antiguos.`))
.addSubcommand(personal=> personal.setName(`personal`).setDescription(`🦺 Muestra tu historial o el de un miembro del personal.`)
  .addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`👮 Miembro del personal del servidor a ver su historial.`).setRequired(false))
).toJSON()

export const historialSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { options, guild, user } = int, subCommand = options.getSubcommand(true), author = guild?.members.cache.get(user.id), { emoji, serverId } = botDB

  if(subCommand == "colaboradores"){
    estadisticas.comandos++
    let dataCol = await collaboratorsModel.findById(serverId), bueltas = 1, tabla: any[] = []
    if(!dataCol) return
    for(let c of dataCol.colaboradores.filter(f=> guild?.members.cache.get(f.id))){
      let miembro = guild?.members.cache.get(c.id)
      if(miembro){
        if(c.colaborador){
          tabla.push(`**${bueltas}.** [${miembro.user.tag}](${miembro.displayAvatarURL({size: 2048})}) - es colaborador desde <t:${Math.floor(c.fecha/1000)}:R>\n**ID:** ${c.id}`)
        }else{
          tabla.push(`**${bueltas}.** [${miembro.user.tag}](${miembro.displayAvatarURL({size: 2048})}) - *era colaborador <t:${Math.floor(c.fecha/1000)}:R>*\n**ID:** ${c.id}`)
        }
      }
      bueltas++
    }

    await int.deferReply()
    let allPages = 0
    if(String(tabla.length).slice(-1) == '0'){
      allPages = Math.floor(tabla.length / 10)
    }else{
      allPages = Math.floor(tabla.length / 10 + 1)
    }

    let start = 0, end = 10, page = 1, descripcion = `Hay un total de **${tabla.length.toLocaleString()}** ${tabla.length <= 1 ? "colaborador.": "colaboradores."}\n\n`
    const collaboratorsEb = new EmbedBuilder()
    .setTitle(`💎 Historial de los colaboradores`)
    .setColor(int.guild?.members.me?.displayHexColor || 'White')
    .setFooter({text: `Pagina ${page}/${allPages}`, iconURL: guild?.iconURL() || undefined})
    .setTimestamp()

    if(tabla.length <= 10){
      collaboratorsEb
      .setDescription(descripcion+tabla.slice(start, end).join("\n\n"))
      sendMessageSlash(int, {embeds: [collaboratorsEb]})

    }else{
      collaboratorsEb
      .setDescription(descripcion+tabla.slice(start, end).join("\n\n"))

      const collaboratorsArb = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        [
          new ButtonBuilder()
          .setCustomId('previous')
          .setLabel("Anterior")
          .setEmoji(emoji.leftArrow)
          .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
          .setCustomId('next')
          .setLabel("Siguiente")
          .setEmoji(emoji.rightArrow)
          .setStyle(ButtonStyle.Primary)
        ]
      ).toJSON()
           
      setTimeout(async ()=>{
        const collaboratorsMessage = await int.editReply({embeds: [collaboratorsEb], components: [collaboratorsArb]}), { components } = collaboratorsArb
        const collaboratorsCollector = collaboratorsMessage.createMessageComponentCollector({filter: f=> f.user.id == user.id, time: allPages*60000})


        collaboratorsCollector.on('collect', async btn => {
          if(btn.customId == 'previous'){
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
            start -= 10, end -= 10, page--

            collaboratorsEb
            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            btn.update({ embeds: [collaboratorsEb], components: [collaboratorsArb] })
          }

          if(btn.customId == 'next'){
            if (end + 10 >= tabla.length) {
              components[0].style = ButtonStyle.Primary
              components[0].disabled = false
              components[1].disabled = true
              components[1].style = ButtonStyle.Secondary
              
            } else {
              components[0].style = ButtonStyle.Primary
              components[0].disabled = false
              components[1].disabled = false
              components[1].style = ButtonStyle.Primary
            }
            start -= 10, end -= 10, page--

            collaboratorsEb
            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            btn.update({ embeds: [collaboratorsEb], components: [collaboratorsArb] })
          }
        })

        collaboratorsCollector.on('end', (asd) => {
          int.editReply({embeds: [collaboratorsEb], components: []})
        })
      }, 600)
    }
  }

  if(subCommand == 'personal'){
    let dataPer = await personalModel.findById(serverId), memberOption = options.getUser('miembro'), member = memberOption ? guild?.members.cache.get(memberOption.id || ''): undefined

    if(!dataPer) return

    if(setSlashErrors(int, [
      [
        Boolean(member && member.user.bot),
        `El miembro que has proporcionado *(${member})* es un bot, un bot no puede ser miembro del personal del servidor.`
      ],
      [
        Boolean(member && !dataPer.personal.some(s=>s.id == member?.id)),
        `El miembro que has proporcionado *(${member})* no es miembro del personal del servidor o no esta registrado en el sistema.`
      ],
      [
        !member && !dataPer.personal.some(s=>s.id == int.user.id),
        `No eres miembro del personal del servidor o no estas registrado en el sistema.`
      ]
    ])) return
    
    await int.deferReply()

    let bueltas = 1, tabla: any[] = []
    let persona = dataPer.personal.find(f=>f.id == (member ? member.id: int.user.id))
    if(!persona) return
    for(let h of persona.historial){
      tabla.push(`> **${bueltas}.** <t:${Math.floor(h.fecha/1000)}:F> *(<t:${Math.floor(h.fecha/1000)}:R>)*\n> ${h.accion}`)
      bueltas++
    }
    
    let allPages = 0
    if(String(tabla.length).slice(-1) == '0'){
      allPages = Math.floor(tabla.length / 10)
    }else{
      allPages = Math.floor(tabla.length / 10 + 1)
    }

    let start = 0, end = 10, page = 1, descripcion = member ? member.id == int.user.id ? `Tu historial ${member}\n\n`: `Historial de ${member}\n\n`: `Tu historial ${int.user}\n\n`, footerURL = member ? member.id==int.user.id ? guild?.iconURL() : member?.displayAvatarURL(): int.user.displayAvatarURL() 
    
    const staffEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || user.username, iconURL: user.displayAvatarURL()})
    .setTitle(`🦺 Historial del personal`)
    .setColor(guild?.members.me?.displayHexColor || 'White')
    .setFooter({text: `Pagina ${page}/${allPages}`, iconURL: footerURL || undefined})
    .setTimestamp()
    
    if(tabla.length <= 10){
      staffEb
      .setDescription(descripcion+tabla.slice(start, end).join("\n\n"))
      sendMessageSlash(int, {embeds: [staffEb]})

    }else{
      const staffArb = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        [
          new ButtonBuilder()
          .setCustomId('previous')
          .setLabel("Anterior")
          .setEmoji(emoji.leftArrow)
          .setStyle(ButtonStyle.Secondary),
      
          new ButtonBuilder()
          .setCustomId('next')
          .setLabel("Siguiente")
          .setEmoji(emoji.rightArrow)
          .setStyle(ButtonStyle.Primary)
        ]
      ).toJSON()
           
      setTimeout(async ()=>{
        const staffMessage = await int.editReply({embeds: [staffEb], components: [staffArb]}), { components } = staffArb
        const staffCollector = staffMessage.createMessageComponentCollector({time: allPages*60000})

        staffCollector.on('collect', btn => {
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
            start -= 10, end -= 10, page--

            staffEb
            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            btn.update({ embeds: [staffEb], components: [staffArb] })
          }

          if(btn.customId == 'next') {
            if(end + 10 >= tabla.length){
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
            start += 10, end += 10, page++

            staffEb
            .setDescription(descripcion + tabla.slice(start, end).join("\n\n"))
            .setFooter({text: `Pagina - ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
            btn.update({ embeds: [staffEb], components: [staffArb] })
          }
        })

        staffCollector.on('end', () => {
          int.editReply({embeds: [staffEb], components: []})
        })
      }, 400)
    }
  }
}