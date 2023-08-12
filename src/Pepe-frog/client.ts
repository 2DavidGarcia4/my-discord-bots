import { Client, Collection, EmbedBuilder } from "discord.js";
import { FrogDb } from "./db";
import { readdirSync } from 'fs'
import { ContextCommand, SlashCommand, TextCommand } from ".";

export class PepeFrogClient extends Client {
  public data = FrogDb  
  public slashCommands: Collection<string, SlashCommand> = new Collection()
  public contextCommands: Collection<string, ContextCommand> = new Collection()
  public textCommands: Collection<string, TextCommand> = new Collection()

  constructor(){
    super({
      intents: 131071,
      allowedMentions: {repliedUser: true},
      failIfNotExists: false,
    })
  }
  
  public async start(token: string | undefined){  
    try {
      // await connect(moongoseURL || '')
      // console.log("🟢 Connected to the database.")

      const isDist = __dirname.includes('src') ? 'src/Pepe-frog' : 'dist/Pepe-frog'
      console.log(isDist)
  
      this.loadEvents(isDist)
      // this.loadTextCommands(isDist)
      // this.loadSlashCommands(isDist)
      // this.loadContextCommands(isDist)
      this.login(token)
      
    } catch (error) {
      console.log("🔴 An error occurred while connecting to the database", error)
    }
  }
  
  private loadTextCommands(isDist: string): void {
    readdirSync(`./${isDist}/commands/text/`).forEach(folder=> {
      readdirSync(`./${isDist}/commands/text/${folder}`).forEach(async file=> {
        const textCommand: TextCommand = new (require(`./commands/text/${folder}/${file}`).default)();
        this.textCommands.set(textCommand.name, textCommand);
      })
    })
  }

  private loadSlashCommands(isDist: string){
    readdirSync(`./${isDist}/commands/slash/`).forEach(folder => {
      readdirSync(`./${isDist}/commands/slash/${folder}`).filter(d=> !['add', 'remove', 'set'].some(s=> s==d)).forEach(async file=> {
        const slashCommand: SlashCommand = new (require(`./commands/slash/${folder}/${file}`).default)();
        this.slashCommands.set(slashCommand.struct.name, slashCommand)
      })
    })
  }

  private loadContextCommands(isDist: string){
    readdirSync(`./${isDist}/commands/context/`).forEach(folder => {
      readdirSync(`./${isDist}/commands/context/${folder}`).forEach(async file=> {
        const contextCommand: ContextCommand = new (require(`./commands/context/${folder}/${file}`).default)();
        this.contextCommands.set(contextCommand.struct.name, contextCommand)
      })
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