import { Client, Collection } from 'discord.js'
import { FrogDb } from './data'
import { readdirSync } from 'fs'
import { ContextCommand, SlashCommand, TextCommand } from '.'

export class PepeFrogClient extends Client {
  public data = FrogDb  
  public slashCommands: Collection<string, SlashCommand> = new Collection()
  public contextCommands: Collection<string, ContextCommand> = new Collection()
  public textCommands: Collection<string, TextCommand> = new Collection()
  public getGuildById(guildId: string) {
    return this.guilds.cache.get(guildId)
  }
  public getChannelById(channelId: string) {
    return this.channels.cache.get(channelId)
  }

  constructor(){
    super({intents: 131071,})
  }
  
  public async start(token: string | undefined){  
    try {
      const isDist = __dirname.includes('src') ? 'src/Pepe-frog' : 'dist/Pepe-frog'
  
      this.loadEvents(isDist)
      this.loadTextCommands(isDist)
      this.loadSlashCommands(isDist)
      this.loadContextCommands(isDist)
      this.login(token)
      // this.on()
      
    } catch (error) {
      // console.log("🔴 An error occurred while connecting to the database", error)
      console.log("🔴 An error occurred while starting the bot", error)
    }
  }
  
  private loadTextCommands(isDist: string): void {
    readdirSync(`./${isDist}/commands/text/`).forEach(file=> {
      const textCommand: TextCommand = new (require(`./commands/text/${file}`).default)()
      this.textCommands.set(textCommand.name, textCommand)
    })
  }

  private loadSlashCommands(isDist: string){
    readdirSync(`./${isDist}/commands/slash/`).forEach(file => {
      const slashCommand: SlashCommand = new (require(`./commands/slash/${file}`).default)()
      this.slashCommands.set(slashCommand.struct.name, slashCommand)
    })
  }

  private loadContextCommands(isDist: string){
    readdirSync(`./${isDist}/commands/context/`).forEach(file => {
      const contextCommand: ContextCommand = new (require(`./commands/context/${file}`).default)()
      this.contextCommands.set(contextCommand.struct.name, contextCommand)
    })
  }

  private loadEvents(isDist: string) {
    readdirSync(`./${isDist}/events/`).forEach(async file=> {
      const event = await import(`./events/${file}`)

      if(event.once) this.once(event.name, async (...args) => await event.execute(...args, this))
      else this.on(event.name, async (...args) => await event.execute(...args, this))
    })
  }
}