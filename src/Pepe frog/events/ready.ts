import { ActivitiesOptions, ActivityType, AttachmentBuilder, ChannelType, Client, EmbedBuilder } from "discord.js";
import { setGuildStatus } from "../utils/functions";
import { frogDb } from "../db";
import { isDevelopment } from "../../config";
import { commands } from "./interactionCreate";
import { presences } from "../../shared/functions";

import { registerFont, createCanvas, loadImage } from "canvas";
registerFont("tipo.otf", {family: 'MADE TOMMY'})

export const readyEvent = async (client: Client) => {
  const { serverId, principalServerId } = frogDb
  console.log(client.user?.username+' Estoy listo')
  const principalServer = client.guilds.cache.get(principalServerId)
  const server = client.guilds.cache.get(serverId)
  
  const readyChannel = client.channels.cache.get('1053425705385467904')
  const ReadyEb = new EmbedBuilder()
  .setTitle('✅ I am ready')
  .setColor('DarkGold')
  .setDescription('Connected again')
  if(!isDevelopment && readyChannel?.type == ChannelType.GuildText){
    readyChannel.sendTyping()
    setTimeout(()=> readyChannel.send({embeds: [ReadyEb]}), 2000)
  } 

  const logos = client.channels.cache.get('1064289166462042137')
  let imagen = "https://media.discordapp.net/attachments/1064289166462042137/1067870216157147156/banner_2023-01.jpg?width=468&height=468"
  const canvas = createCanvas(1000, 1000);
  const fondo = await loadImage(imagen);
  const context = canvas.getContext("2d");

  context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
  // context.strokeStyle = "#000000";
  // context.strokeRect(0,0, canvas.width, canvas.height);

  // context.textAlign = "center"
  context.font = "10px MADE TOMMY"
  context.fillStyle = "#ffffff"
  context.fillText("David200409", 20, 980)

  const finalImg = new AttachmentBuilder(canvas.toBuffer(), {name: 'welcome.png'})
  // if(logos?.isTextBased()) logos.send({files: [finalImg]})


  const suggestionsChannel = server?.channels.cache.get('1053401642915082392')
  if(suggestionsChannel?.type == ChannelType.GuildText) suggestionsChannel.messages.fetch({limit: 100})

  ;[principalServer, server].forEach(async sv=> {
    commands.forEach(async cmd=> {
      if(!(await sv?.commands.fetch())?.some(s=> s.name == cmd.name)){
        sv?.commands.create(cmd).then(c=> console.log(`Se creo el comando ${c.name}`))
      }
    })
  })

  const dayStates: ActivitiesOptions[] = [
    {
      name: "moans",
      type: ActivityType.Listening
    },
    {
      name: "orgasms",
      type: ActivityType.Watching
    },
    {
      name: "with the girls",
      type: ActivityType.Playing
    },
    {
      name: server?.memberCount.toLocaleString()+" members.",
      type: ActivityType.Watching
    },
    {
      name: "vaginas",
      type: ActivityType.Watching
    },
    {
      name: "boobs",
      type: ActivityType.Watching
    },
    {
      name: "ass",
      type: ActivityType.Watching
    },
  ]

  const nightStates: ActivitiesOptions[] = [
    {
      name: `naked women.`,
      type: ActivityType.Watching
    },
    {
      name: `moans.`,
      type: ActivityType.Listening
    },
    {
      name: 'the beauty of women',
      type: ActivityType.Watching
    }
  ]

  presences(dayStates, nightStates, client)

  const statsChannel = server?.channels.cache.get('1053389468993851472')
  const sendStats = async () => {
    if(statsChannel?.type != ChannelType.GuildText) return
    const { topic } = statsChannel, nowTime = Date.now()

    if(topic){
      const oldTime = parseInt(topic) + 24*60*60*1000
      if((oldTime-(60*60*1000)) < nowTime){
        const { joins, leaves } = frogDb, members = joins-leaves
        const porcentMembers = Math.floor(members*100/joins)
        let barr = ''
        for(let i=1; i<=20; i++){
          if(i*5 <= porcentMembers) barr+='█'
          else barr+=' '
        }

        frogDb.joins = 0, frogDb.leaves = 0
        statsChannel.edit({topic: nowTime.toString()})

        const StatsEb = new EmbedBuilder()
        .setTitle('Estadisticas diarias del servidor')
        .setDescription(`Se unieron ${joins}, ${leaves} se fueron y ${members} se quedaron.\n\n**Miembros: ${porcentMembers}%**\n\`\`${barr}\`\``)
        .setColor(server?.members.me?.displayHexColor || 'White')
        statsChannel.send({embeds: [StatsEb]})
      }
    }else statsChannel.edit({topic: nowTime.toString()})
  }
  sendStats()


  setInterval(()=> {
    presences(dayStates, nightStates, client)
    sendStats()
  }, 60*60000)

  setGuildStatus(client)
  setInterval(()=> {
    setGuildStatus(client)
  }, 6*60*60000)
}