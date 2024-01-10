import { Message, EmbedBuilder } from "discord.js"
import { FILE_EXTENSIONS, FrogDb, TIMEOUT_SANCTIONS } from "../data"
import { type SecondClientData } from ".."

const ENLACE_IDENTIFIERS = ['http://', 'https://']
const DISCORD_INVITES_IDENTIFIERS = ['discord.gg/', 'discord.com/invite/']

export async function Moderation(msg: Message<boolean>, client: SecondClientData) {
  const { guildId, channelId } = msg
  
  if(msg.author.bot) return
  if(guildId != FrogDb.serverId) return

  const { categories, roles, invitationCodes } = client.data

  const verifiedsCahnnels = msg.guild?.channels.cache.filter(f=> f.parentId == categories.verifieds)

  const handleModerateAction = (Embed: EmbedBuilder, timeoutReason: string) => {
    Embed.setColor('Red')
    msg.channel.send({content: `${msg.author}`, embeds: [Embed]}).then(re=> {
      msg.delete()
      setTimeout(()=> re.delete(), 20000)
    })

    const member = client.modDb.find(f=> f.id == msg.author.id)
    if(member){
      member.warns++
      if(member.warns === 3){
        msg.member?.roles.add(roles.prisoner)
      }

      if(member.warns === 4){
        msg.member?.roles.add(roles.muted)
      }

      TIMEOUT_SANCTIONS.forEach(sanction=> {
        if(sanction.warns == member.warns){
          msg.member?.timeout(sanction.time, timeoutReason.replace('{warns}', sanction.warns+''))
        }
      })
    }else{
      client.modDb.push({id: msg.author.id, warns: 1, message: '', messages: []})
    }
  }

  //? Auto moderation discord invites
  if(!verifiedsCahnnels?.some(s=> s.id == channelId) && !msg.member?.permissions.has('Administrator') && DISCORD_INVITES_IDENTIFIERS.some(s=> msg.content.includes(s))){
    const texts = msg.content.split(/ +/g).map(m=> m.includes('\n') ? m.split('\n') : m).flat()
    const invites = texts.filter(f=> DISCORD_INVITES_IDENTIFIERS.some(s=> f.includes(s))) 

    if (invites.some(i=> invitationCodes.some(s => i.includes(s)))) {
      msg.member?.roles.add([roles.prisoner, roles.muted])
    }

    const AutoModEb = new EmbedBuilder()
    .setTitle('Auto moderation')
    .setDescription('Discord server invites are not allowed.')

    handleModerateAction(AutoModEb, `Auto moderation of discord invites, {warns} warns`)

    return
  }

  //? Auto moderation links
  if(!verifiedsCahnnels?.some(s=> s.id == msg.channelId) && !msg.member?.permissions.has('Administrator') && ENLACE_IDENTIFIERS.some(s=> msg.content.includes(s))){
    const texts = msg.content.split(/ +/g).map(m=> m.includes('\n') ? m.split('\n') : m).flat()
    const links = texts.filter(f=> ENLACE_IDENTIFIERS.some(s=> f.includes(s))) 
    
    if(links.some(l=> !FILE_EXTENSIONS.some(s=> l.endsWith('.'+s)))){      
      const AutoModEb = new EmbedBuilder()
      .setTitle('Auto moderation')
      .setDescription('Only links to images, videos and gifs are allowed.')
  
      handleModerateAction(AutoModEb, `Auto moderation of links, {warns} warns`)
    }

    return
  }

  //? Automoderation spam
  if(msg.content.length){
    const member = client.modDb.find(f=> f.id == msg.author.id)
    if(member){
      const duplicatedMessages = member.messages.filter(f=> f.content == msg.content && f.channelId != msg.channelId).length
      // console.log(member.messages.length)

      member.messages.push({id: msg.id, content: msg.content, channelId})
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
        msg.member?.roles.add(roles.prisoner)
      }

    }else{
      client.modDb.push({id: msg.author.id, message: '' , warns: 0, messages: [{id: msg.id, content: msg.content, channelId: msg.channelId}]})
      
      setTimeout(()=> {
        const user = client.modDb.find(f=> f.id == msg.author.id)
        user?.messages.splice(user.messages.findIndex(f=> f.id == msg.id), 1)
      }, 20*60000)
    }
  }
}