import './db'
import { Client, ClientEvents, type CacheType, ChatInputCommandInteraction, Message, MessageContextMenuCommandInteraction, type RESTPostAPIChatInputApplicationCommandsJSONBody, type RESTPostAPIContextMenuApplicationCommandsJSONBody, UserContextMenuCommandInteraction } from 'discord.js'

export type EventName = keyof ClientEvents

//? Slash commands
export type SlashInteraction = ChatInputCommandInteraction<CacheType>

export abstract class SlashCommand {
  public readonly struct: RESTPostAPIChatInputApplicationCommandsJSONBody
  public readonly guildsIds: string[]
  public readonly description?: string

  constructor (
    struct: RESTPostAPIChatInputApplicationCommandsJSONBody,
    guildsIds: string[],
    description?: string 
  ){
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
  public readonly guildsIds: string[]

  constructor (
    struct: RESTPostAPIContextMenuApplicationCommandsJSONBody,
    guildsIds: string[]
  ){
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

import './first'
import './second'