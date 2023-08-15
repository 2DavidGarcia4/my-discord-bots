import { Message, EmbedBuilder } from "discord.js"
import { FILE_EXTENSIONS, FrogDb, SANCTIONS } from "../data"
import { modDb } from ".."
import { getSnackData } from "../lib/notion"

export async function Moderation(msg: Message<boolean>) {
  const { guildId } = msg
  
  if(msg.author.bot) return
  if(guildId != FrogDb.serverId) return

  const { categories, roles } = await getSnackData()

  const verifiedsCahnnels = msg.guild?.channels.cache.filter(f=> f.parentId == categories.verifieds)

  const handleModerateAction = (Embed: EmbedBuilder, timeoutReason: string) => {
    Embed.setColor('Red')
    msg.channel.send({content: `${msg.author}`, embeds: [Embed]}).then(re=> {
      msg.delete()
      setTimeout(()=> re.delete(), 10000)
    })

    const member = modDb.find(f=> f.id == msg.author.id)
    if(member){
      member.warns++
      if(member.warns >= 3){
        msg.member?.roles.add(roles.spamer)
      }

      SANCTIONS.forEach(sanction=> {
        if(sanction.warns == member.warns){
          msg.member?.timeout(sanction.time, timeoutReason.replace('{warns}', sanction.warns+''))
        }
      })
    }else{
      modDb.push({id: msg.author.id, warns: 1, message: '', messages: []})
    }
  }

  //? Auto moderation links
  const enlaceActivators = ['http://', 'https://']
  if(!verifiedsCahnnels?.some(s=> s.id == msg.channelId) && !msg.member?.permissions.has('Administrator') && enlaceActivators.some(s=> msg.content.includes(s))){
    const texts = msg.content.split(/ +/g).map(m=> m.includes('\n') ? m.split('\n') : m).flat()
    const filter = texts.filter(f=> enlaceActivators.some(s=> f.includes(s))) 
    
    if(filter.some(f=> !FILE_EXTENSIONS.some(s=> f.endsWith('.'+s)))){
      const AutoModEb = new EmbedBuilder()
      .setTitle('Auto moderation')
      .setDescription('Only links to images, videos and gifs are allowed.')
  
      handleModerateAction(AutoModEb, `Auto moderation of links, {warns} warns`)
    }

    return
  }
  
  //? Auto moderation discord invites
  const discordInvites = ['discord.gg/', 'discord.com/invite/']
  if(!verifiedsCahnnels?.some(s=> s.id == msg.channelId) && !msg.member?.permissions.has('Administrator') && discordInvites.some(s=> msg.content.includes(s))){
    const AutoModEb = new EmbedBuilder()
    .setTitle('Auto moderation')
    .setDescription('Discord server invites are not allowed.')

    handleModerateAction(AutoModEb, `Auto moderation of discord invites, {warns} warns`)

    return
  }

  //? Automoderation spam
  if(msg.content.length){
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
        msg.member?.roles.add(roles.spamer)
      }

    }else{
      modDb.push({id: msg.author.id, message: '' , warns: 0, messages: [{id: msg.id, content: msg.content, channelId: msg.channelId}]})
      
      setTimeout(()=> {
        const user = modDb.find(f=> f.id == msg.author.id)
        user?.messages.splice(user.messages.findIndex(f=> f.id == msg.id), 1)
      }, 20*60000)
    }
  }
}