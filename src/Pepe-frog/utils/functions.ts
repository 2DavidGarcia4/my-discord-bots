import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, Client, Collection, EmbedBuilder, Guild, GuildMember, Message } from "discord.js"
import { FrogDb } from "../db"
import { VerifiedsData } from "../types"

const getCategoryChannels = (id: string, server: Guild | undefined) => {
  return server?.channels.cache.filter(f=> f.parentId == id).size.toLocaleString()
}

export const setGuildStatus = (client: Client) => {
  const snackServer = client.guilds.cache.get(FrogDb.serverId)
  const online = snackServer?.members.cache.filter(f=> f.presence?.status == 'dnd' || f.presence?.status == 'idle' || f.presence?.status == 'online' || f.presence?.status == 'invisible').size
  const allMembers = snackServer?.memberCount, nsfwChannels = getCategoryChannels('1053401638494289931', snackServer)
  const vipChannels = getCategoryChannels('1054485238413266965', snackServer)
  const packChannels = getCategoryChannels('1061436779707773070', snackServer)

  const onlineName = `🟢│en linea: ${online?.toLocaleString()}`, 
    membersName = `👥│todos: ${allMembers?.toLocaleString()}`, 
    nsfwName = `🔞│NSFW canales: ${nsfwChannels}`,
    vipName = `🌟│VIP canales: ${vipChannels}`,
    packName = `📂│Packs canales: ${packChannels}`

  const onlineChanel = snackServer?.channels.cache.get('1053426402361352269')
  const membersChanel = snackServer?.channels.cache.get('1053426454538493993')
  const nsfwChanel = snackServer?.channels.cache.get('1053426479607849112')
  const vipCahnnel = snackServer?.channels.cache.get('1072305855447441428')
  const packChannel = snackServer?.channels.cache.get('1072325996314902660')
   
  if(onlineChanel?.name != onlineName) onlineChanel?.edit({name: onlineName})
  if(membersChanel?.name != membersName) membersChanel?.edit({name: membersName})
  if(nsfwChanel?.name != nsfwName) nsfwChanel?.edit({name: nsfwName})
  if(vipCahnnel?.name != nsfwName) vipCahnnel?.edit({name: vipName})
  if(packChannel?.name != nsfwName) packChannel?.edit({name: packName})
}

//? Verifieds data
const verifiedsChanneId = '1083064332260212768', verifiedsMessageId = '1083069070896812154'
export const getVerifiedsData = async (client: Client): Promise<VerifiedsData[] | undefined> => {
  const channelDb = client.channels.cache.get(verifiedsChanneId)
  if(channelDb?.isTextBased()) {
    const message = (await channelDb.messages.fetch(verifiedsMessageId)).content
    const data = JSON.parse(message)
    return data
  }
}

export const updateVerifiedsData = async (client: Client, newData: VerifiedsData[]) => {
  const channelDb = client.channels.cache.get(verifiedsChanneId)
  if(channelDb?.isTextBased()) {
    const newDataStr = JSON.stringify(newData)
    const message = await channelDb.messages.fetch(verifiedsMessageId)
    if(newDataStr != message.content) message.edit({content: JSON.stringify(newData)})
  }
}

export const inspectVerifieds = async (client: Client) => {
  const verifiedsData = await getVerifiedsData(client)
  const server = client.guilds.cache.get(FrogDb.serverId)
  const channelLog = client.channels.cache.get('1100110861244301382')
  
  if(verifiedsData){
    for(let v of verifiedsData) {
      const channel = client.channels.cache.get(v.channelId)
      const verified = server?.members.cache.get(v.id)
      const day = 24*60*60000

      if(verified){
        if(channel?.type == ChannelType.GuildText) {
          if((!v.contentHidden) && v.lastActivityAt < Math.floor(Date.now() - (day*30))) await channel.permissionOverwrites.edit(FrogDb.serverId, {ReadMessageHistory: false}).then(ed=> {
            v.contentHidden = true
      
            
            const VerifiedLog = new EmbedBuilder()
            .setDescription(`Los miembro ya no pueden ver el contenido de tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **30** días.`)
            .setColor('Blue')
            if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
          })
      
          if((!v.channelHidden) && v.lastActivityAt < Math.floor(Date.now() - (day*40))) await channel.permissionOverwrites.edit(FrogDb.serverId, {ViewChannel: false}).then(ed=> {
            v.channelHidden = true
            
            const VerifiedLog = new EmbedBuilder()
            .setDescription(`Los miembro ya no pueden ver tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **40** días.`)
            .setColor('Orange')
            if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
          })
        
          if(!v.ping) {
            if(Math.floor(v.pinedAt + (FrogDb.verifiedsCooldown)) <= Date.now()){
              if(channel?.type == ChannelType.GuildText) channel.permissionOverwrites.edit(v.id, {MentionEveryone: true})
              v.ping = true
        
              const VerifiedLog = new EmbedBuilder()
              .setDescription(`Ya puedes utilizar ping en tu canal <#${v.channelId}>`)
              .setColor('Green')
              if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
            }
          } 
        }

      }else{
        if(channel?.type == ChannelType.GuildText) await channel.permissionOverwrites.edit(FrogDb.serverId, {ViewChannel: false}).then(()=> {
          verifiedsData.splice(verifiedsData.findIndex(f=> f.id == v.id), 1)
          
          const VerifiedLog = new EmbedBuilder()
          .setDescription(`La verificada <@${v.id}> no se encuentra en el servidor, ha sido eliminada de la base de datos y su canal ha sido cerrado.`)
          .setColor('Red')
          if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
        })
      }
    }
    
    await updateVerifiedsData(client, verifiedsData)
  }
}

type Languages = 'es' | 'en'

const messagesIndexByLanguages = {
  es: 1,
  en: 0
}

export async function getInfoMessage({client, channelId, language}: {
  client: Client
  channelId: string,
  language: Languages
}) {  
  const channel = client.channels.cache.get(channelId)

  if(channel?.type == ChannelType.GuildText) {
    const infoMessages = (await channel.messages.fetch({limit: 6})).map(m=> m)
    let index = messagesIndexByLanguages[language]

    return infoMessages?.find((_, i)=> i == index)?.content
  }
}

export function defaultInfoMessageBody(msg: Message<boolean>, {title, description, name, extraButtons}: {
  title: string
  description: string
  name: string,
  extraButtons?: ButtonBuilder[]
}) {
  const RulesEb = new EmbedBuilder()
  .setTitle(title)
  .setDescription(description)
  .setFooter({text: "you don't speak Spanish?, Click blue button below"})
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const RulesArb = new ActionRowBuilder<ButtonBuilder>()
  if(extraButtons){
    RulesArb.addComponents(
      new ButtonBuilder()
      .setCustomId(`en-${name}-btn`)
      .setEmoji('👅')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary),
      ...extraButtons
    )

  }else{
    RulesArb.addComponents(
      new ButtonBuilder()
      .setCustomId(`en-${name}-btn`)
      .setEmoji('👅')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary),
    )
  }

  msg.channel.send({embeds: [RulesEb], components: [RulesArb]})
}

export function autoChangeNicknames(members: GuildMember[], client: Client) {
  const includes = ['!', '¡', '?', '¿']
  let updatedMembers = 0
  
  members.forEach(m=> {
    if(m.nickname){
      if(includes.some(s=> m.nickname?.startsWith(s))){
        m.edit({nick: m.nickname.replace(/[!¡¿?]/, '').trim()}).then(mr=> {
          updatedMembers++
        })
      }
    } else if(includes.some(s=> m.user.username.startsWith(s))){
      m.edit({nick: m.user.username.replace(/[!¡¿?]/, '').trim()}).then(mr=> {
        updatedMembers++
      })
    }
  })

  if(updatedMembers){
    const UpdatedMembersEb = new EmbedBuilder()
    .setTitle('Update members nicknames')
    .setDescription(`**${updatedMembers}**`)
    .setColor('Blue')

    const channelLog = client.channels.cache.get('1053389522253127720')
    if(channelLog?.isTextBased()) channelLog.send({embeds: [UpdatedMembersEb]})
  }
}

export function handlePreviewChannels(this: {
  accessRoles: string[]
  previewRol: string
}, int: ButtonInteraction<CacheType>) {
  const inEnglish = int.locale == 'en-US'
  const author = int.guild?.members.cache.get(int.user.id)

  const VIPPreviewEb = new EmbedBuilder()
  .setTitle('👁️ '+(inEnglish ? 'Channels preview' : 'Vista previa de canales'))
  
  if(this.accessRoles.some(s=> author?.roles.cache.has(s))){
    VIPPreviewEb
    .setDescription(inEnglish ?
      `You already have access to all channels in this category, you have upgraded the server or you have paid for access.` :
      `Ya tienes acceso a todos los canales de esta categoría, has mejorado el servidor o has pagado por el acceso.`  
    )
    .setColor('Blurple')

  }else if(author?.roles.cache.has(this.previewRol)) {
    VIPPreviewEb
    .setDescription(inEnglish ?
      `You already have channel preview enabled for this category.` :
      `Ya tienes habilitada la vista previa de canales de este acategoría.`  
    )
    .setColor('Blurple')

  }else{
    author?.roles.add(this.previewRol).then(()=> setTimeout(()=> {
      author.roles.remove(this.previewRol)
    }, 10*60000))

    VIPPreviewEb
    .setDescription(inEnglish ?
      `You have been enabled to preview channels for this category, you can only see the channels, not the content.` :
      `Se the ha habilitado la vista previa de canales para esta categoría, solo puedes ver los canales no el contenido.`  
    )
    .setFooter({text: inEnglish ? 
      'The channel preview is disabled in 10 minutes' : 
      'La vista previa de canales se te deshabilita en 10 minutos'
    })
    .setColor('Yellow')
  }

  int.reply({ephemeral: true, embeds: [VIPPreviewEb]})
}