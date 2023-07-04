import { Client } from "discord.js";
import { pepeFrog } from "../config";
import { ModDb } from "./types";

//! Events
import { readyEvent } from "./events/ready";
import { interactionCreateEvent } from "./events/interactionCreate";
import { messageCreateEvent } from "./events/messageCreate";
import { roleCreateEvent } from "./events/roleCreate";
import { roleUpdateEvent } from "./events/roleUpdate";
import { roleDeleteEvent } from "./events/roleDelete";
import { channelDeleteEvent } from "./events/channelDelete";
import { channelCreateEvent } from "./events/channelCreate";
import { channelUpdateEvetn } from "./events/channelUpdate";
import { memberAddEvent } from "./events/memberAdd";
import { memberRemoveEvent } from "./events/memberRemove";
import { messageUpdateEvent } from "./events/messageUpdate";
import { messageDeleteEvent } from "./events/messageDelete";
import { reactionAddEvent } from "./events/reactionAdd";
import { memberUpdateEvent } from "./events/memberUpdate";


export const modDb: ModDb[] = []
export const exemptMessagesIds: string[] = []

export const Frog = new Client({intents: 131071})

Frog.on('ready', readyEvent)

Frog.on('messageCreate', messageCreateEvent)

Frog.on('messageUpdate', messageUpdateEvent)

Frog.on('messageDelete', messageDeleteEvent)

Frog.on('messageReactionAdd', reactionAddEvent)

Frog.on('interactionCreate', interactionCreateEvent)

Frog.on('roleCreate', roleCreateEvent)

Frog.on('roleUpdate', roleUpdateEvent)

Frog.on('roleDelete', roleDeleteEvent)

Frog.on('guildMemberUpdate', memberUpdateEvent)

Frog.on('channelCreate', channelCreateEvent)

Frog.on('channelUpdate', channelUpdateEvetn)

Frog.on('channelDelete', channelDeleteEvent)

Frog.on('channelPinsUpdate', (channel) => {
  console.log('holaa')
})

Frog.on('guildMemberAdd', memberAddEvent)

Frog.on('guildMemberRemove', memberRemoveEvent)

Frog.login(pepeFrog)