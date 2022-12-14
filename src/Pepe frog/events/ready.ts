import { ChannelType, Client, EmbedBuilder } from "discord.js";
import { setGuildStatus } from "../utils/functions";

export const readyEvent = async (client: Client) => {
  console.log(client.user?.username+' Estoy listo')

  const readyChannel = client.channels.cache.get('1052421775805386782')
  const ReadyEb = new EmbedBuilder()
  .setTitle('✅ I am ready')
  .setColor('DarkGold')
  .setDescription('Connected again')
  if(readyChannel?.type == ChannelType.GuildText){
    readyChannel.sendTyping()
    setTimeout(()=> readyChannel.send({embeds: [ReadyEb]}), 2000)
  }

  setGuildStatus(client)
  setInterval(()=> {
    setGuildStatus(client)

  }, 60*60*1000)
}