import { type ActivitiesOptions, ActivityType } from 'discord.js'
import { botDB } from '../data'
import { getBotData, getGuildsData } from '../utils'
import { defaultReady } from '../../shared/functions'
import { BotEvent } from '../..'
import { FirstClientData } from '..'

export default class ReadyEvent extends BotEvent {
  constructor() {
    super('ready')
  }

  async execute(client: FirstClientData) {
    if (!client.user) return
  
    const guildsDB = await getGuildsData(client)
    if(guildsDB) botDB.guilds = guildsDB 
    
    const dataBot = await getBotData(client)
    // console.log(botDB)
    defaultReady(client, dataBot?.logs.connections || '', botDB.color.afirmative)
    botDB.color = {...botDB.color, ...dataBot?.color}
  
    const servidor = client.guilds.cache.get(botDB.serverId)
  
    function presencias() {
      const estadosDia: ActivitiesOptions[] = [
        {
          name: botDB.prefix+"ayuda",
          type: ActivityType.Listening
        },
        {
          name: "/ayuda",
          type: ActivityType.Listening
        },
        {
          name: `${client.users.cache.size.toLocaleString()} users.`,
          type: ActivityType.Watching
        },
        {
          name: `moderar con ${client.users.cache.get('935707268090056734')?.username}`,
          type: ActivityType.Playing
        }
      ]
  
      const estadosNoche: ActivitiesOptions[] = [
        {
          name: `mis sueños.`,
          type: ActivityType.Watching
        },
        {
          name: `zzz`,
          type: ActivityType.Playing
        }
      ]
      let tiempo = new Date()
      if (tiempo.getHours() > 1 && tiempo.getHours() < 13) {
        client.user?.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)]] })
      } else {
        client.user?.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)]] })
      }
    }
    presencias()
  
    setInterval(async () => {
      presencias()
    }, 60 * 60000)
  
    setInterval(async () => {
    }, 30 * 60000)
  
  
    // console.log(svInteractionCommands.map(m=> m))
    // console.log(interactionCommands.map(m=> ({name: m.struct.name, pr: m.struct.default_member_permissions})))
  
    // ;[...client.slashCommands.map(sc=> sc), ...client.contextCommands.map(cc=> cc)].forEach(async cmd=> {
    //   if(!(await client.application?.commands.fetch())?.some(c=> c.name == cmd.struct.name)){
    //     client.application?.commands.create(cmd.struct)
    //   }
    // })
    
    // console.log((await servidor?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
    // console.log((await client.application?.commands.fetch())?.map(m=> ({id: m.id, name: m.name})))
  
    // const command = svInteractionCommands.get('crear')?.struct.options as ApplicationCommandOptionData[] | undefined
  
    // (await servidor?.commands.fetch('971218630631129168', {force: true}))?.edit({options: command}).then(c=> console.log('Comando actualizado'))
    // (await servidor?.commands.fetch('974763995837894687', {force: true}))?.delete().then(c=> console.log(`Comando ${c.name} eliminado`))
    
    //! Public
    // const command = interactionCommands.get('set')
    
    // (await client.application?.commands.fetch('1076941760753840200', {force: true}))?.edit({options: command?.struct.options, defaultMemberPermissions: PermissionFlagsBits.ManageGuild}).then(c=> console.log(`Comando publico ${c.name} actualizado`))
    // (await client.application?.commands.fetch('1076941760753840200', {force: true}))?.delete().then(c=> console.log(`Comando publico ${c.name} eliminado`))
  }
}