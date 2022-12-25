import { ChannelType, Client, EmbedBuilder } from "discord.js";
import { setGuildStatus } from "../utils/functions";
import { frogDb } from "../db";
import { isDevelopment } from "../../config";
import { commands } from "./interactionCreate";

export const readyEvent = async (client: Client) => {
  console.log(client.user?.username+' Estoy listo')
  const principalServer = client.guilds.cache.get('1028793496674500659')
  const server = client.guilds.cache.get(frogDb.serverId)
  
  
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
}