import { Client, Collection } from 'discord.js'
import { FrogDb } from './data'
import { readdirSync } from 'fs'
import { BotClient } from '../shared/classes'
import { ModDb } from './types'

export class SecondClient extends BotClient {
  public data = FrogDb  
  public modDb: ModDb[] = []
  public exemptMessagesIds: string[] = []
  public getGuildById(guildId: string) {
    return this.guilds.cache.get(guildId)
  }
  public getChannelById(channelId: string) {
    return this.channels.cache.get(channelId)
  }

  private rootPath = ''
  private rootFolderName = ''
  
  public async start(token: string | undefined){  
    try {
      const rootPath = __dirname.includes('src') ? `src/second` : `dist/second`
      console.log({dirname: __dirname})
      this.rootPath = rootPath
      console.log({rootPath: this.rootPath})
  
      this.loadEvents()
      // this.loadCommands('slash', this.slashCommands)
      // this.loadCommands('context', this.contextCommands)
      this.loadCommands('text', this.textCommands)
      this.login(token)
      // this.on()
      
    } catch (error) {
      // console.log("🔴 An error occurred while connecting to the database", error)
      console.log("❌ An error occurred while starting the bot", error)
    }
  }

  private loadCommands(folderName: string, commandCollection: Collection<string, any>) {
    const { rootPath, rootFolderName } = this
    readdirSync(`./${rootPath}/commands/${folderName}/`).forEach(file => {
      const command = new (require(`./commands/${folderName}/${file}`).default)()
      commandCollection.set(command.struct.name, command)
    })
  }

  private loadEvents() {
    const { rootPath, rootFolderName } = this
    console.log({rootPath})
    readdirSync(`./${rootPath}/events/`).forEach(async file=> {
      const event = await import(`./events/${file}`)

      if(event.once) this.once(event.name, async (...args) => await event.execute(...args, this))
      else this.on(event.name, async (...args) => await event.execute(...args, this))
    })
  }
}