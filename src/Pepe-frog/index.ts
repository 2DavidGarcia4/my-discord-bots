import { type CacheType, ChatInputCommandInteraction, Message, MessageContextMenuCommandInteraction, type RESTPostAPIChatInputApplicationCommandsJSONBody, type RESTPostAPIContextMenuApplicationCommandsJSONBody, UserContextMenuCommandInteraction } from 'discord.js'
import { pepeFrog } from '../config'
import type { ModDb } from './types'

import { PepeFrogClient } from './client'

export const modDb: ModDb[] = []
export const exemptMessagesIds: string[] = []
export type CommandClient = PepeFrogClient 

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

  public abstract execute(interaction: SlashInteraction, client?: CommandClient): Promise<void>
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

  public abstract execute(interaction: ContextInteraction, client?: CommandClient): Promise<void>
}

//? Text commands
export type MessageProp = Message<boolean>

export abstract class TextCommand {
  public readonly name: string
  public readonly aliases?: string[]
  public readonly users?: string[]

  constructor(options: {name: string, aliases?: string[], users?: string[]}) {
    this.name = options.name
    this.aliases = options.aliases
    this.users = options.users
  }

  public abstract execute({message, client, args}: {
    message: MessageProp
    client?: CommandClient
    args?: string[]
  }): Promise<void>
} 

//? Start
new PepeFrogClient().start(pepeFrog)