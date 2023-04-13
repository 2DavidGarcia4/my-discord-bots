import { ChannelType, Client, EmbedBuilder, Message } from "discord.js";
import { frogDb } from "../db";
import { modDb } from "../index";

import { evalCommand } from "../commands/text/eval";
import { rolesCommand } from "../commands/text/roles";
import { rulesCommand } from "../commands/text/rules";
import { girlsCommand } from "../commands/text/girls";
import { infoCommand } from "../commands/text/info";
import { getVerifiedsData, updateVerifiedsData } from "../utils/functions";

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
  const { prefix, serverId, principalServerId, owners, verifiedsCooldown } = frogDb
  if(msg.mentions.roles.first()?.id == '1053411182935023657') msg.react('1053444752340680817')

  if(msg.author.bot) return
  if(msg.mentions.members?.has('942860991698436156')) msg.react('1061737573959094422')

  if(msg.guildId == principalServerId){
    if(msg.channel.type != ChannelType.GuildText) return
    const { parentId } = msg.channel
    if(['1028793497295261828', '1054489737097908364', '1061436780500496394'].some(s=> s==parentId)){
      const server = client.guilds.cache.get(serverId), channelName = msg.channel.name, serverChannel = server?.channels.cache.find((f)=>  f.name == channelName) 
      if(serverChannel?.type == ChannelType.GuildText) serverChannel.send({content: msg.content || ' ', files: msg.attachments.map(m=> m)})
    }
  }

  
  if(msg.guildId == serverId){
    if(!msg.channel.isTextBased()) return
    const verifiedsCahnnels = msg.guild?.channels.cache.filter(f=> f.parentId == '1053401639454773338')

    
    //? Auto moderation links
    const enlaceActivators = ['http://', 'https://']
    const filesLinks = ['png', 'jpg', 'gif', 'jpeg', 'mov', 'mp4', 'mp3']
    if(!verifiedsCahnnels?.some(s=> s.id == msg.channelId) && !msg.member?.permissions.has('Administrator') && enlaceActivators.some(s=> msg.content.includes(s))){
      const texts = msg.content.split(/ +/g).map(m=> m.includes('\n') ? m.split('\n') : m).flat()
      const filter = texts.filter(f=> enlaceActivators.some(s=> f.includes(s))) 
      
      if(filter.some(f=> !filesLinks.some(s=> f.endsWith('.'+s)))){
        const AutoModEb = new EmbedBuilder()
        .setTitle('Auto moderation')
        .setDescription('Only links to images, videos and gifs are allowed.')
        .setColor('Red')
  
        msg.channel.send({content: `${msg.author}`, embeds: [AutoModEb]}).then(re=> {
          msg.delete()
          setTimeout(()=> re.delete(), 10000)
        })
  
        const member = modDb.find(f=> f.id == msg.author.id)
        if(member){
          member.warns++
          if(member.warns >= 7){
            msg.member?.roles.add('1053430826823594106')
          }
          sanctions.forEach(sanction=> {
            if(sanction.warns == member.warns){
              msg.member?.timeout(sanction.time, `Auto moderation of links, ${sanction.warns} warns`)
            }
          })
        }else{
          modDb.push({id: msg.author.id, warns: 1, message: '', messages: []})
        }
      }
      return
    }

    //? Auto moderation discord invites
    const discordInvites = ['discord.gg/', 'discord.com/invite/']
    if(!verifiedsCahnnels?.some(s=> s.id == msg.channelId) && !msg.member?.permissions.has('Administrator') && discordInvites.some(s=> msg.content.includes(s))){
      const AutoModEb = new EmbedBuilder()
      .setTitle('Auto moderation')
      .setDescription('Discord server invites are not allowed.')
      .setColor('Red')

      msg.channel.send({content: `${msg.author}`, embeds: [AutoModEb]}).then(re=> {
        msg.delete()
        setTimeout(()=> re.delete(), 10000)
      })

      const member = modDb.find(f=> f.id == msg.author.id)
      if(member){
        member.warns++
        if(member.warns >= 7){
          msg.member?.roles.add('1053430826823594106')
        }
        sanctions.forEach(sanction=> {
          if(sanction.warns == member.warns){
            msg.member?.timeout(sanction.time, `Auto moderation of discord invites, ${sanction.warns} warns`)
          }
        })
      }else{
        modDb.push({id: msg.author.id, warns: 1, message: '', messages: []})
      }
      return
    }

    //? Auto reactions to suggestions
    if(msg.channelId == '1053401642915082392' && !msg.member?.permissions.has('Administrator')) msg.react('1059641676798377995'), msg.react('1059641726387626015')
    

    if(msg.channel.type == ChannelType.GuildText && msg.attachments.size && msg.channel.parentId != '1054485238413266965' && msg.attachments.some(s=> s.size < 8000000)){
      const principalServer = client.guilds.cache.get(principalServerId), channelName = msg.channel.name, serverChannel = principalServer?.channels.cache.find(f=>  f.name == channelName) 
      if(serverChannel?.type == ChannelType.GuildText) serverChannel.send({content: `${msg.author} | \`\`${msg.author.id}\`\``, files: msg.attachments.filter(f=> f.size < 8000000).map(m=> m)})
    }

    if(msg.content.split(/ +/g).length >= 3){
      //? Automoderation spam
      const member = modDb.find(f=> f.id == msg.author.id)
      if(member){
        const duplicatedMessages = member.messages.filter(f=> f.content == msg.content && f.channelId != msg.channelId).length
        // console.log(member.messages.length)
  
        member.messages.push({id: msg.id, content: msg.content, channelId: msg.channelId})
        setTimeout(()=> {
          member.messages.splice(member.messages.findIndex(f=> f.id == msg.id), 1)
        }, 4*60000)
        
        const ar: string[] = []
        const channels = member.messages.filter((f)=> {
          ar.push(f.channelId)
          const channelIds = ar.filter(ci=> ci == f.channelId).length
          return f.content == msg.content && channelIds <= 1
        }).map(m=> `<#${m.channelId}>`)
        
        const AutoModEb = new EmbedBuilder()
        .setTitle('Auto moderation')
        .setDescription(`Don't send the same message on different channels\n\nYou have sent the message in the following channels ${channels.join(', ')}`)
        .setColor('Red')
  
        if(duplicatedMessages >= 2 || member.message == msg.content) {
          member.warns++
          if(!member.message){
            member.message = msg.content
            setTimeout(()=> member.message = '', 4*60000)
          }
          
          member.messages.filter(f=> f.content == msg.content && f.id != msg.id).forEach(async message=> {
            const channel = msg.guild?.channels.cache.get(message.channelId)
            if(channel?.isTextBased()) (await channel.messages.fetch(message.id)).delete().then(dem=> {
              member.messages.splice(member.messages.findIndex(f=> f.id == dem.id), 1)
            }).catch()
          })
          
          msg.reply({embeds: [AutoModEb]}).then(tmsg=> {
            setTimeout(()=> {
              msg.delete().catch()
              tmsg.delete()
            }, 10000)
          })
        }
        
        if(member.warns == 2) {
          msg.member?.timeout(4*60*60000, 'Spam auto moderation')
        }
  
        if(member.warns == 3) {
          msg.member?.roles.add('1053430826823594106')
        }
  
      }else{
        modDb.push({id: msg.author.id, message: '' , warns: 0, messages: [{id: msg.id, content: msg.content, channelId: msg.channelId}]})
        
        setTimeout(()=> {
          const user = modDb.find(f=> f.id == msg.author.id)
          user?.messages.splice(user.messages.findIndex(f=> f.id == msg.id), 1)
        }, 20*60000)
      }
  
      if(msg.channel.type == ChannelType.GuildText){
        //? Auto reactions for verified messages
        if(msg.channel.parentId == '1053401639454773338' && msg.channel.position > 1) msg.react('1061464848967401502'), msg.react('1061467211329458216'), msg.react('1061467145122369596')
        

        if(msg.channel.parentId == '1053401639454773338' && msg.member?.roles.cache.has('1057720387464593478')){
          if(msg.mentions.everyone){
            const verifiedsData = await getVerifiedsData(client)
            const channelLog = client.channels.cache.get('1083075799634157669')
            
            msg.channel.permissionOverwrites.edit(msg.author.id, {MentionEveryone: false})
            const verifiedUser = verifiedsData?.find(f=> f.id == msg.author.id)
            if(verifiedUser){
              verifiedUser.ping = false
              verifiedUser.pinedAt = Date.now()
            
            }else{
              verifiedsData?.push({
                id: msg.author.id,
                ping: false,
                pinedAt: Date.now(),
                channelId: msg.channelId
              })
            }
      
            if(verifiedsData) await updateVerifiedsData(client, verifiedsData)
            const VerifiedLog = new EmbedBuilder()
            .setAuthor({name: `New ping for ${msg.author.username}`, iconURL: msg.author.displayAvatarURL()})
            .setDescription(`${msg.author} podrás utilizar nuevamente ping <t:${Math.floor(Date.now()/1000)+(verifiedsCooldown)}:R>`)
            .setColor('Yellow')
            if(channelLog?.isTextBased()) channelLog.send({embeds: [VerifiedLog]})
          }else{
            msg.reply({allowedMentions: { repliedUser: false }, content: '**<@&1083060304054849676>**'})
          }
        }
      }
    }
  }

  if(msg.author.bot || !msg.content.toLowerCase().startsWith(prefix)) return
  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift()?.toLowerCase()

  if(owners.some(s=> s == msg.author.id)){
    if(command == 'eval') evalCommand(msg, client, args.join(' '))

    if(command == 'rules') rulesCommand(msg, client)

    if(command == 'roles') rolesCommand(msg)

    if(command == 'girls') girlsCommand(msg)

    if(command == 'info') infoCommand(msg)
  }
}