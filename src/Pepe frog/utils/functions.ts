import { Client, Status } from "discord.js"

export const setGuildStatus = (client: Client) => {
  const snackServer = client.guilds.cache.get('1028794417076764693')
  const online = snackServer?.members.cache.filter(f=> f.presence?.status == 'dnd' || f.presence?.status == 'idle' || f.presence?.status == 'online' || f.presence?.status == 'invisible').size
  const allMembers = snackServer?.memberCount, nsfwChannels = snackServer?.channels.cache.filter(f=> f.parentId == '1028795913788993547').size
  const onlineChanel = snackServer?.channels.cache.get('1048643827084308551')
  const membersChanel = snackServer?.channels.cache.get('1048643787431346316')
  const nsfwChanel = snackServer?.channels.cache.get('1048645170238861402')
  const onlineName = `🟢│en linea: ${online?.toLocaleString()}`, membersName = `👥│todos: ${allMembers?.toLocaleString()}`, nsfwName = `🔞│canales nsfw: ${nsfwChannels}`

  if(onlineChanel?.name != onlineName) onlineChanel?.edit({name: onlineName})
  if(onlineChanel?.name != membersName) membersChanel?.edit({name: membersName})
  if(onlineChanel?.name != nsfwName) nsfwChanel?.edit({name: nsfwName})
}