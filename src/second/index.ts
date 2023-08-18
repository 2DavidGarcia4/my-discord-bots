import { Message } from 'discord.js'
import { pepeFrog } from '../config'
import { SecondClient } from './client'
export type SecondClientData = SecondClient 

//? Text commands
export type MessageProp = Message<boolean>

export abstract class TextCommand{
  public readonly struct: {
    name: string
    users?: string[]
    aliases?: string[]
  }

  constructor(options: {
    name: string
    aliases?: string[]
    users?: string[]
  }) {
    this.struct = options
  }

  public abstract execute({message, client, args}: {
    message: MessageProp
    client?: SecondClientData
    args?: string[]
  }): Promise<void>
}

//? Start
new SecondClient().start(pepeFrog)
console.log({__dirname})