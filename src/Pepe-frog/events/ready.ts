import { type ActivitiesOptions, ActivityType, ChannelType, Client, EmbedBuilder } from "discord.js";
import { autoChangeNicknames, getVerifiedsData, inspectVerifieds, setGuildStatus, updateVerifiedsData } from "../utils/functions";
import { FrogDb } from "../db";
import { commands } from "./interactionCreate";
import { defaultReady, presences } from "../../shared/functions";

// import { registerFont, createCanvas, loadImage } from "canvas";
// registerFont("tipo.otf", {family: 'MADE TOMMY'})

export const readyEvent = async (client: Client) => {
  const { serverId, principalServerId } = FrogDb
  defaultReady(client, '1053425705385467904', 'DarkGold')
  
  const principalServer = client.guilds.cache.get(principalServerId)
  const server = client.guilds.cache.get(serverId)

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
        const { joins, leaves } = FrogDb, members = joins-leaves
        const porcentMembers = Math.floor(members*100/joins)
        let barr = ''
        for(let i=1; i<=20; i++){
          if(i*5 <= porcentMembers) barr+='█'
          else barr+=' '
        }

        FrogDb.joins = 0, FrogDb.leaves = 0
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

  if(server?.members) autoChangeNicknames(server.members.cache.map(m=> m), client)

  inspectVerifieds(client)
  setInterval(()=> {
    presences(dayStates, nightStates, client)
    sendStats()
    inspectVerifieds(client)
  }, 60*60000)

  setGuildStatus(client)
  setInterval(()=> {
    setGuildStatus(client)
    if(server?.members) autoChangeNicknames(server.members.cache.map(m=> m), client)
  }, 6*60*60000)
}