import { ChannelType, EmbedBuilder } from 'discord.js'
import { autoChangeNicknames, inspectVerifieds, setGuildStatus, handlePresences } from '../lib/services'
import { defaultReady } from '../../shared/functions'
import { getSnackData } from '../lib/notion'
import { PepeFrogClient } from '../client'
import { EventName } from '../../globals'

export const once = true
export const name: EventName = 'ready'

export async function execute(client: PepeFrogClient) {
  const { serverId, backupServerId, publishingServerId } = client.data
  const SnackData = await getSnackData()
  // console.log(SnackData)
  defaultReady(client, SnackData.channels.ready, 'DarkGold')

  const server = client.guilds.cache.get(serverId)
  const backupServer = client.guilds.cache.get(backupServerId)
  const publishedServer = client.guilds.cache.get(publishingServerId)
  const allServers = [server, backupServer, publishedServer]
  client.data.serverIconUrl = server?.iconURL() || ''

  const suggestionsChannel = server?.channels.cache.get(SnackData.channels.suggestions)
  if(suggestionsChannel?.type == ChannelType.GuildText) suggestionsChannel.messages.fetch({limit: 100})

  allServers.forEach(async sv=> {
    [...client.slashCommands.map(sc=> sc), ...client.contextCommands.map(cc=> cc)].forEach(async cmd=> {
      if(cmd.guildsIds.some(id=> id == sv?.id)){
        if(!(await sv?.commands.fetch())?.some(s=> s.name == cmd.struct.name)){
          sv?.commands.create(cmd.struct).then(c=> console.log(`➕ Se creo el comando ${c.name} en el servidor ${sv.name}`))
        }
      }
    })
  })

  handlePresences(client)

  const statsChannel = server?.channels.cache.get(SnackData.channels.stats)
  const sendStats = async () => {
    if(statsChannel?.type != ChannelType.GuildText) return
    const { topic } = statsChannel, nowTime = Date.now()

    if(topic){
      const oldTime = parseInt(topic) + 24*60*60*1000
      if((oldTime-(60*60*1000)) < nowTime){
        const { joins, leaves } = client.data, members = joins-leaves
        const porcentMembers = Math.floor(members*100/joins)
        let barr = ''
        for(let i=1; i<=20; i++){
          if(i*5 <= porcentMembers) barr+='█'
          else barr+=' '
        }

        client.data.joins = 0, client.data.leaves = 0
        statsChannel.edit({topic: nowTime.toString()})

        const StatsEb = new EmbedBuilder()
        .setTitle('Estadisticas diarias del servidor')
        .setDescription(`Se unieron ${joins}, ${leaves} se fueron y ${members} se quedaron.\n\n**Miembros: ${porcentMembers}%**\n\`\`${barr}\`\``)
        .setColor(server?.members.me?.displayHexColor || 'White')
        statsChannel.send({embeds: [StatsEb]})
      }
    }else statsChannel.edit({topic: nowTime.toString()})
  }
  sendStats()

  if(server?.members) autoChangeNicknames(server.members.cache.map(m=> m), client)

  inspectVerifieds(client)
  setInterval(()=> {
    handlePresences(client)
    sendStats()
    inspectVerifieds(client)
  }, 60*60000)

  setGuildStatus(client)
  setInterval(()=> {
    setGuildStatus(client)
    if(server?.members) autoChangeNicknames(server.members.cache.map(m=> m), client)
  }, 6*60*60000)
}