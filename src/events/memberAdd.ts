import { ChannelType, Client, EmbedBuilder, AttachmentBuilder, GuildMember, WebhookClient } from "discord.js";
import { estadisticas } from "..";
import { botDB } from "../db";
import { botModel, invitesModel } from "../models";
import { registerFont, createCanvas, loadImage } from "canvas";
registerFont("tipo.otf", {family: 'MADE TOMMY'})

export const memberAddEvent = async (gmd: GuildMember, client: Client) => {
  if(gmd.guild.id != botDB.serverId) return
  estadisticas.entradas++

  const { color, emoji, serverId, creatorId, mainRoles } = botDB
  const dataBot = await botModel.findById(client.user?.id), dataInv = await invitesModel.findById(serverId), arrayMi = dataInv?.miembros
  if(!dataBot) return
  const welcomeLog = client.channels.cache.get(dataBot.logs.entry)

  if(gmd.user.bot){
    const botEb = new EmbedBuilder()

    if(!gmd.user.flags?.has('VerifiedBot')){
      gmd.kick("Razon: Bot no verificado.")

      botEb
      .setAuthor({name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL()})
      .setTitle("Anti bots no verificados")
      .setDescription(`Se ha expulsado un bot no verificado que ha entrado en ${gmd.guild.name}`)
      .setColor(gmd.guild?.members.me?.displayHexColor || 'White')
      .setFooter({text: gmd.guild?.name || 'undefined', iconURL: gmd.guild?.iconURL() || undefined})
      .setTimestamp()

      client.users.cache.get(creatorId)?.send({embeds: [botEb]})

    }else{
      
      botEb
      .setTitle("🤖 Se unio un bot")
      .setThumbnail(gmd.displayAvatarURL())
      .setDescription(`${gmd}\n${gmd.user.tag}\nCreado <t:${Math.floor(gmd.user.createdAt.valueOf()/1000)}:R>`)
      .setColor("#0084EC")
      .setTimestamp()

      if(welcomeLog?.type == ChannelType.GuildText) welcomeLog.send({embeds: [botEb]})
    }

  }else {
    const usBanner = await client.users.fetch(gmd.id, {force: true})
    const welcomeChannel = client.channels.cache.get(dataBot.logs.welcome)
    if(welcomeChannel?.type != ChannelType.GuildText) return
    welcomeChannel.sendTyping()

    let webhook = (await welcomeChannel.fetchWebhooks()).find(f=> f.owner?.id==client.user?.id)
    if(!webhook) webhook = await welcomeChannel.createWebhook({name: 'Welcome', avatar: 'https://cdn-icons-png.flaticon.com/512/5167/5167400.png', reason: 'Para las bienvenidas.'})
    const welcomeMsg = new WebhookClient({url: webhook.url})

    let imagen = "https://cdn.discordapp.com/attachments/901313790765854720/902607815359758356/fondoBienv.png"
    const canvas = createCanvas(1000, 500);
    const fondo = await loadImage(imagen);
    const context = canvas.getContext("2d");

    context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.strokeRect(0,0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(500, 160, 145, 0, Math.PI * 2, true);
    context.fillStyle = `${gmd.guild.members.me?.displayHexColor}`;
    context.stroke();
    context.fill();

    context.textAlign = "center"
    context.font = "80px MADE TOMMY"
    context.fillStyle = "#ffffff"
    context.fillText("Bienvenid@", 500, 375)

    context.font = '45px MADE TOMMY';
    context.fillStyle = '#ffffff';
    context.fillText(`${gmd.user.tag}`, 500, 435);

    context.font = '38px MADE TOMMY'
    context.fillStyle = '#ffffff';
    context.fillText(`disfruta del servidor`, 500, 480);

    context.beginPath();
    context.arc(500, 160, 140, 0, Math.PI * 2, true);
    context.fillStyle = `${gmd.guild.members.me?.displayHexColor}`;
    context.closePath();
    context.clip();

    const avatar = await loadImage(gmd.displayAvatarURL({size: 2048, extension: 'png'}))
    context.drawImage(avatar, 360, 20, 280, 280);

    const finalImg = new AttachmentBuilder(canvas.toBuffer(), {name: 'welcome.png'})

    const embBienvenida = new EmbedBuilder()
    .setAuthor({name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL()})
    .setImage(`attachment://welcome.png`)
    .setTitle("👋 ¡Bienvenido/a!")
    .setDescription(`*No se por quien has sido invitado.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
    .setColor(gmd.guild.members.me?.displayHexColor || 'White')
    .setFooter({text: `Bienvenido/a a ${gmd.guild.name}`, iconURL: gmd.guild.iconURL() || undefined})
    .setTimestamp()

    const embBien = new EmbedBuilder()
    .setAuthor({name: gmd.user.tag, iconURL: gmd.user.displayAvatarURL()})
    .setThumbnail(gmd.user.displayAvatarURL({size: 4096}))
    .setImage(usBanner?.bannerURL({size: 4096}) || null)
    .setTitle("📥 Se unió un usuario")
    .setDescription(`Se unió ${gmd} *(no se por quien fue invitado/a)*.\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`)
    .setColor(color.negative)
    .setFooter({text: gmd.guild.name, iconURL: gmd.guild.iconURL() || undefined})
    .setTimestamp()

    await gmd.guild.invites.fetch().then(async invites=> {
      // console.log(invites.map(m => `${m.code} || ${m.uses}`))
      if(!arrayMi) return
      const invitacion = invites.find(f=> arrayMi.find(fm=> fm.id==f.inviterId)?.codes.find(fc=> fc.code==f.code) ? (arrayMi?.find(fm=> fm.id==f.inviterId)?.codes.find(fc=> fc.code==f.code)?.usos || 0) < (f.uses || 0) : false)
      // console.log(invitacion)

      let miembro = arrayMi.find(f=> f.id==invitacion?.inviterId)
      if(miembro){
        if(miembro.codes.some(s=> s.code==invitacion?.code)){
          let invite = miembro.codes.find(f=> f.code==invitacion?.code)
          if(!invitacion?.uses || !invite) return
          if(invitacion?.uses > invite?.usos){
            if(miembro.id == gmd.user.id){
              miembro.falsas++
              embBienvenida.setDescription(`*Has sido invitado/a por ti mismo con una invitación creada por ti.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
              embBien.data.description = `Se unió ${gmd} *ha sido invitado/a por el mismo con una invitación suya.*\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`
            
            }else{
              miembro.verdaderas++
              if(miembro.invitados.some(s=> s.id==gmd.user.id)){
                let invitado = miembro.invitados.find(f=> f.id==gmd.user.id)
                if(invitado?.miembro) invitado.miembro = true
                
              }else{
                miembro.invitados.push({id: gmd.user.id, tag: gmd.user.tag, miembro: true})
              }

              const miembroSV = gmd.guild.members.cache.get(invitacion.inviterId || '')
              const channelLog = client.channels.cache.get(dataBot.logs.bot)
              if(miembroSV && !miembroSV.user.bot){
                const rolVIPEb = new EmbedBuilder()
                .setThumbnail(miembroSV.displayAvatarURL({size: 1024}))
                .setTitle("➕ Rol agregado a miembro")
                .setColor(color.afirmative)
                .setTimestamp()

                if(!miembroSV.roles.cache.has(dataInv.datos.roles[0].id) && miembro.verdaderas>=10){
                  miembroSV.roles.add(dataInv.datos.roles[0].id)
                  rolVIPEb
                  .setDescription(`Le he agregado el rol <@&${dataInv.datos.roles[0].id}> a <@${miembroSV.id}> ya que ha invitado a **${dataInv.datos.roles[0].invitaciones}** miembros.`)
                  if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [rolVIPEb]})
                }

                if(!miembroSV.roles.cache.has(dataInv.datos.roles[1].id) && miembro.verdaderas>=20){
                  miembroSV.roles.add(dataInv.datos.roles[1].id)
                  rolVIPEb
                  .setDescription(`Le he agregado el rol <@&${dataInv.datos.roles[1].id}> a <@${miembroSV.id}> ya que ha invitado a **${dataInv.datos.roles[1].invitaciones}** miembros.`)
                  if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [rolVIPEb]})
                }
              }

              embBienvenida.setDescription(`*Has sido invitado/a por <@${miembro.id}> quien ahora tiene **${miembro.verdaderas.toLocaleString()}** ${miembro.verdaderas==1 ? "invitación": "invitaciones"}.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
              embBien.data.description = `Se unió ${gmd} *ha sido invitado/a por <@${miembro.id}> quien ahora tiene **${miembro.verdaderas.toLocaleString()}** ${miembro.verdaderas==1 ? "invitación": "invitaciones"}.*\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt.valueOf() / 1000)}:R>`
            }
            
            miembro.totales++
            if(invite.usos) invite.usos = invitacion.uses     
          }
        }
      }
    })

    welcomeMsg.send({embeds: [embBienvenida], files: [finalImg], content: `**¡Hola ${gmd}!**`})
    if(welcomeLog?.type == ChannelType.GuildText) welcomeLog.send({embeds: [embBien]})
    let miembroInv = arrayMi?.find(f=> f.id==gmd.user.id)
    if(miembroInv) miembroInv.tiempo = null
    
    await invitesModel.findByIdAndUpdate(serverId, {miembros: arrayMi})

    gmd.roles.add(mainRoles)
  }
}