import './db'
import { Client, ClientEvents, type CacheType, ChatInputCommandInteraction, Message, MessageContextMenuCommandInteraction, type RESTPostAPIChatInputApplicationCommandsJSONBody, type RESTPostAPIContextMenuApplicationCommandsJSONBody, UserContextMenuCommandInteraction } from 'discord.js'

type EventName = keyof ClientEvents

export abstract class BotEvent {
  public readonly name: EventName
  public readonly isOnce?: boolean

  constructor(name: EventName, isOnce?: boolean) {
    this.name = name
    this.isOnce = isOnce
  }

  public abstract execute(...args: any[]): Promise<void>
}

//? Slash commands
export type SlashInteraction = ChatInputCommandInteraction<CacheType>

export abstract class SlashCommand {
  public readonly struct: RESTPostAPIChatInputApplicationCommandsJSONBody
  public readonly guildsIds?: string[]
  public readonly description?: string

  constructor ({struct, guildsIds, description}: {
    struct: RESTPostAPIChatInputApplicationCommandsJSONBody
    guildsIds?: string[]
    description?: string 
  }){
    this.struct = struct
    this.guildsIds = guildsIds
    this.description = description
  }

  public abstract execute(interaction: SlashInteraction, client?: Client): Promise<void>
}

//? Context commands
export type ContextInteraction = UserContextMenuCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>

export abstract class ContextCommand {
  public readonly struct: RESTPostAPIContextMenuApplicationCommandsJSONBody
  public readonly guildsIds?: string[]

  constructor ({struct, guildsIds}: {
    struct: RESTPostAPIContextMenuApplicationCommandsJSONBody
    guildsIds?: string[]
  }){
    this.struct = struct
    this.guildsIds = guildsIds
  }

  public abstract execute(interaction: ContextInteraction, client?: Client): Promise<void>
}

//? Text commands
export type MessageProp = Message<boolean>

export abstract class TextCommand {
  public readonly struct: {
    name: string
    users?: string[]
    aliases?: string[]
  }

  constructor(struct: {
    name: string
    aliases?: string[]
    users?: string[]
  }) {
    this.struct = struct
  }

  public abstract execute({message, client, args}: {
    message: MessageProp
    client?: Client
    args?: string[]
  }): Promise<void>
}

process.on("unhandledRejection", async (reason, promise) => {
  console.log(reason)
  promise.then(pr=> console.error('Promise: ', pr))
  .catch(er=> console.error('Promise error: ', er))
})

import './first'
import './second'