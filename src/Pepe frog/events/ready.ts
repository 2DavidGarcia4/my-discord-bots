import { ActivitiesOptions, ActivityType, ChannelType, Client, EmbedBuilder } from "discord.js";
import { setGuildStatus } from "../utils/functions";
import { frogDb } from "../db";
import { isDevelopment } from "../../config";
import { commands } from "./interactionCreate";
import { presences } from "../../utils/functions";

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

  // setGuildStatus(client)
  setInterval(()=> {
    setGuildStatus(client)
  }, 6*60*60*1000)


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
  setInterval(()=> presences(dayStates, nightStates, client), 30*60*60*1000)
}