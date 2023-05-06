import { ChannelType, Client, EmbedBuilder, Guild } from "discord.js"
import { frogDb } from "../db"
import { VerifiedsData } from "../types"
import { botDB } from "../../pcem/db"

const getCategoryChannels = (id: string, server: Guild | undefined) => {
  return server?.channels.cache.filter(f=> f.parentId == id).size.toLocaleString()
}

export const setGuildStatus = (client: Client) => {
  const snackServer = client.guilds.cache.get(frogDb.serverId)
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
  const channelLog = client.channels.cache.get('1100110861244301382')
  
  if(verifiedsData){
    for(let v of verifiedsData) {
      const channel = client.channels.cache.get(v.channelId)
      const day = 24*60*60000
      
      if(channel?.type == ChannelType.GuildText) {
        if((!v.contentHidden) && v.lastActivityAt < Math.floor(Date.now() - (day*30))) await channel.permissionOverwrites.edit(frogDb.serverId, {ReadMessageHistory: false}).then(ed=> {
          v.contentHidden = true
    
          
          const VerifiedLog = new EmbedBuilder()
          .setDescription(`Los miembro ya no pueden ver el contenido de tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **30** días.`)
          .setColor('Blue')
          if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
        })
    
        if((!v.channelHidden) && v.lastActivityAt < Math.floor(Date.now() - (day*40))) await channel.permissionOverwrites.edit(frogDb.serverId, {ViewChannel: false}).then(ed=> {
          v.channelHidden = true
          
          const VerifiedLog = new EmbedBuilder()
          .setDescription(`Los miembro ya no pueden ver tu canal <#${v.channelId}> ya que has estado inactiva durante mas de **40** días.`)
          .setColor('Orange')
          if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
        })
      
        if(!v.ping) {
          if(Math.floor(v.pinedAt + (frogDb.verifiedsCooldown)) <= Date.now()){
            if(channel?.type == ChannelType.GuildText) channel.permissionOverwrites.edit(v.id, {MentionEveryone: true})
            v.ping = true
      
            const VerifiedLog = new EmbedBuilder()
            .setDescription(`Ya puedes utilizar ping en tu canal <#${v.channelId}>`)
            .setColor('Green')
            if(channelLog?.isTextBased()) channelLog.send({content: `<@${v.id}>`, embeds: [VerifiedLog]}) 
          }
        } 
      }
    }
    
    await updateVerifiedsData(client, verifiedsData)
  }
}

const rulesChannelId = '1090736733047492638'
export const getRules = async (client: Client, language: 'es' | 'en') => {
  const rulesChannel = client.channels.cache.get(rulesChannelId)
  if(rulesChannel?.isTextBased()) {
    const rules = (await rulesChannel.messages.fetch(language == 'en' ? '1090751484754415726' : '1090737102045597788')).content
    return rules
  }
}

const varifiedChannelId = '1053399734582263938'
export const getVerifiedsInfo = async (client: Client, language: 'es' | 'en') => {
  const rulesChannel = client.channels.cache.get(varifiedChannelId)
  if(rulesChannel?.isTextBased()) {
    const rules = (await rulesChannel.messages.fetch(language == 'en' ? '1101591835576639549' : '1101591652440735894')).content
    return rules
  }
}