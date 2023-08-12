import { CacheType, ChatInputCommandInteraction, Client, Message, MessageContextMenuCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPostAPIContextMenuApplicationCommandsJSONBody, UserContextMenuCommandInteraction } from "discord.js";
import { pepeFrog } from "../config";
import { ModDb } from "./types";

//! Events
// import { readyEvent } from "./events/ready";
// import { interactionCreateEvent } from "./events/interactionCreate";
// import { messageCreateEvent } from "./events/messageCreate";
// import { roleCreateEvent } from "./events/roleCreate";
// import { roleUpdateEvent } from "./events/roleUpdate";
// import { roleDeleteEvent } from "./events/roleDelete";
// import { channelDeleteEvent } from "./events/channelDelete";
// import { channelCreateEvent } from "./events/channelCreate";
// import { channelUpdateEvetn } from "./events/channelUpdate";
// import { memberAddEvent } from "./events/memberAdd";
// import { memberRemoveEvent } from "./events/memberRemove";
// import { messageUpdateEvent } from "./events/messageUpdate";
// import { messageDeleteEvent } from "./events/messageDelete";
// import { reactionAddEvent } from "./events/reactionAdd";
// import { memberUpdateEvent } from "./events/memberUpdate";
import { PepeFrogClient } from "./client";


export const modDb: ModDb[] = []
export const exemptMessagesIds: string[] = []

//? Slash commands
export abstract class SlashCommand {
  public readonly struct: RESTPostAPIChatInputApplicationCommandsJSONBody;
  public readonly description?: string

  constructor (
    struct: RESTPostAPIChatInputApplicationCommandsJSONBody,
    description?: string 
  ){
    this.struct = struct
    this.description = description
  }

  public abstract execute(interaction: ChatInputCommandInteraction<CacheType>, client?: PepeFrogClient): Promise<any>
}

//? Context commands
export abstract class ContextCommand {
  public readonly struct: RESTPostAPIContextMenuApplicationCommandsJSONBody;

  constructor (
    struct: RESTPostAPIContextMenuApplicationCommandsJSONBody
  ){
    this.struct = struct
  }

  public abstract execute(interaction: UserContextMenuCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>, client?: PepeFrogClient): Promise<any>
}

//? Text commands
export abstract class TextCommand {
  public readonly name: string;
  public readonly aliases?: string[];
  public readonly users?: string[]

  constructor(options: {name: string, aliases: string[], users?: string[]}) {
    this.name = options.name;
    this.aliases = options.aliases;
    this.users = options.users
  }

  public abstract execute(message: Message<boolean>, args?: string[], client?: PepeFrogClient): Promise<any>
}

//? Start
new PepeFrogClient().start(pepeFrog)