import { Client, Guild } from "discord.js"
import { frogDb } from "../db"

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