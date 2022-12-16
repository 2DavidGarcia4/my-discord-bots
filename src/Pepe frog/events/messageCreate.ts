import { ChannelType, Client, Message } from "discord.js";
import { frogDb } from "../db";

import { evalCommand } from "../commands/text/eval";
import { rolesCommand } from "../commands/text/roles";
import { rulesCommand } from "../commands/text/rules";
import { girlsCommand } from "../commands/text/girls";

export const messageCreateEvent = async (msg: Message<boolean>, client: Client) => {
  const { prefix, serverId, principalServerId } = frogDb

  if(msg.guildId == principalServerId){
    if(msg.channel.type != ChannelType.GuildText) return
    if(msg.channel.parentId == '1028793497295261828'){
      console.log('parent')
      const server = client.guilds.cache.get(serverId), channelName = msg.channel.name, serverChannel = server?.channels.cache.find(f=>  f.name == channelName) 
      if(serverChannel?.type == ChannelType.GuildText) serverChannel.send({content: msg.content || ' ', files: msg.attachments.map(m=> m)})
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