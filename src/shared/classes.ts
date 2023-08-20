import { readdirSync } from 'fs'
import { Client, Collection } from 'discord.js'
import { SlashCommand, ContextCommand, TextCommand, BotEvent } from '..'

export class BotClient extends Client {
  public slashCommands: Collection<string, SlashCommand> = new Collection()
  public contextCommands: Collection<string, ContextCommand> = new Collection()
  public textCommands: Collection<string, TextCommand> = new Collection()

  public getGuildById(guildId: string) {
    return this.guilds.cache.get(guildId)
  }
  public getChannelById(channelId: string) {
    return this.channels.cache.get(channelId)
  }

  private rootPath = ''
  private rootFolderName = ''

  constructor(rootFolderName: string){
    super({
      intents: 131071
    })

    this.rootFolderName = rootFolderName
  }

  public async start(token: string | undefined){  
    const { rootFolderName } = this
    try {
      const rootPath = __dirname.includes('src') ? `src/${rootFolderName}` : `dist/${rootFolderName}`
      this.rootPath = rootPath
  
      this.loadEvents()
      this.loadCommands('slash', this.slashCommands)
      this.loadCommands('context', this.contextCommands)
      this.loadCommands('text', this.textCommands)
      this.login(token)
      // this.on()
      
    } catch (error) {
      // console.log("🔴 An error occurred while connecting to the database", error)
      console.log(`❌ An error occurred while starting the bot ${rootFolderName}`, error)
    }
  }

  private loadCommands(folderName: string, commandCollection: Collection<string, any>) {
    const { rootPath, rootFolderName } = this
    readdirSync(`./${rootPath}/commands/${folderName}/`).forEach(file => {
      const command = new (require(`../${rootFolderName}/commands/${folderName}/${file}`).default)()
      commandCollection.set(command.struct.name, command)
    })
  }

  private loadEvents() {
    const { rootPath, rootFolderName } = this
    readdirSync(`./${rootPath}/events/`).forEach(async file=> {
      const event: BotEvent = new (await import(`../${rootFolderName}/events/${file}`)).default()

      if(event.isOnce) this.once(event.name, async (...args) => await event.execute(...args, this))
      else this.on(event.name, async (...args) => await event.execute(...args, this))
    })
  }
}