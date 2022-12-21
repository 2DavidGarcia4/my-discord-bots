import { ChannelType, Client, EmbedBuilder, Message } from "discord.js";
import { frogDb } from "../db";

import { evalCommand } from "../commands/text/eval";
import { rolesCommand } from "../commands/text/roles";
import { rulesCommand } from "../commands/text/rules";
import { girlsCommand } from "../commands/text/girls";
import { ModDb } from "../types";

export const modDb: ModDb[] = []
const sanctions = [
  {
    time: 4*60*60*1000,
    warns: 3 
  },
  {
    time: 8*60*60*1000,
    warns: 4 
  },
  {
    time: 16*60*60*1000,
    warns: 5 
  },
  {
    time: 24*60*60*1000,
    warns: 6 
  },
  {
    time: 48*60*60*1000,
    warns: 7 
  },
]

export const messageCreateEvent = async (msg: Message<boolean>, client: Client) => {
  const { prefix, serverId, principalServerId } = frogDb

  if(msg.guildId == principalServerId){
    if(msg.channel.type != ChannelType.GuildText) return
    const { parentId } = msg.channel
    if(['1028793497295261828', '1054489737097908364'].some(s=> s==parentId)){
      const server = client.guilds.cache.get(serverId), channelName = msg.channel.name, serverChannel = server?.channels.cache.find(f=>  f.name == channelName) 
      if(serverChannel?.type == ChannelType.GuildText) serverChannel.send({content: msg.content || ' ', files: msg.attachments.map(m=> m)})
    }

  }
  
  if(msg.guildId == serverId){
    const enlaceActivators = ['http://', 'https://']
    const filesSinks = ['png', 'jpg', 'gif', 'jpeg', 'mov', 'mp4', 'mp3']
    if(!msg.member?.permissions.has('Administrator') && enlaceActivators.some(s=> msg.content.includes(s))){
      const texts = msg.content.split(/ +/g).map(m=> m.includes('\n') ? m.split('\n') : m).flat()
      const filter = texts.filter(f=> enlaceActivators.some(s=> f.includes(s))) 
      
      if(filter.some(f=> !filesSinks.some(s=> f.endsWith('.'+s)))){
        const AutoModEb = new EmbedBuilder()
        .setTitle('Auto moderation')
        .setDescription('Only links to images, videos and gifs are allowed.')
        .setColor('Red')
  
        msg.reply({embeds: [AutoModEb]}).then(re=> {
          msg.delete()
          setTimeout(()=> re.delete(), 10000)
        })
  
        const member = modDb.find(f=> f.id == msg.author.id)
        if(member){
          member.warns++
          sanctions.forEach(sanction=> {
            if(sanction.warns == member.warns){
              msg.member?.timeout(sanction.time, `Auto moderation of links, ${sanction.warns} warns`)
            }
          })
        }else{
          modDb.push({id: msg.author.id, warns: 1})
        }
      }
    }
  }

  if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return
  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift()?.toLowerCase()

  if(msg.member?.permissions.has('Administrator')){
    if(command == 'eval') evalCommand(msg, client, args.join(' '))

    if(command == 'rules') rulesCommand(msg)

    if(command == 'roles') rolesCommand(msg)

    if(command == 'girls') girlsCommand(msg)
  }
}