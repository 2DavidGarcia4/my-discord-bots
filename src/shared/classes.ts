import { readdirSync } from 'fs'
import { Client, Collection } from 'discord.js'
import { SlashCommand, ContextCommand, TextCommand } from '..'

export class BotClient extends Client {
  public slashCommands: Collection<string, SlashCommand> = new Collection()
  public contextCommands: Collection<string, ContextCommand> = new Collection()
  public textCommands: Collection<string, TextCommand> = new Collection()

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

  // private loadSlashCommands(isDist: string){
  //   readdirSync(`./${isDist}/commands/slash/`).forEach(file => {
  //     const slashCommand: SlashCommand = new (require(`./commands/slash/${file}`).default)()
  //     this.slashCommands.set(slashCommand.struct.name, slashCommand)
  //   })
  // }

  // private loadContextCommands(isDist: string){
  //   readdirSync(`./${isDist}/commands/context/`).forEach(file => {
  //     const contextCommand: ContextCommand = new (require(`./commands/context/${file}`).default)()
  //     this.contextCommands.set(contextCommand.struct.name, contextCommand)
  //   })
  // }

  // private loadTextCommands(isDist: string): void {
  //   readdirSync(`./${isDist}/commands/text/`).forEach(file=> {
  //     const textCommand: TextCommand = new (require(`./commands/text/${file}`).default)()
  //     this.textCommands.set(textCommand.struct.name, textCommand)
  //   })
  // }

  private loadEvents() {
    const { rootPath, rootFolderName } = this
    readdirSync(`./${rootPath}/events/`).forEach(async file=> {
      const event = await import(`../${rootFolderName}/events/${file}`)

      if(event.once) this.once(event.name, async (...args) => await event.execute(...args, this))
      else this.on(event.name, async (...args) => await event.execute(...args, this))
    })
  }
}