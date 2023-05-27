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


export const modDb: ModDb[] = []
export const exemptMessagesIds: string[] = []

const Frog = new Client({intents: 131071})

Frog.on('ready', async () => {
  readyEvent(Frog)
})

Frog.on('messageCreate', (message) => {
  messageCreateEvent(message, Frog)
})

Frog.on('messageUpdate', (oldMessage, newMessage) => {
  messageUpdateEvent(oldMessage, newMessage, Frog)
})

Frog.on('messageDelete', (message) => {
  messageDeleteEvent(message, Frog)
})

Frog.on('messageReactionAdd', (reaction, user) => {
  reactionAddEvent(reaction, user)
})

Frog.on('interactionCreate', (interaction) => {
  interactionCreateEvent(interaction, Frog)
})

Frog.on('roleCreate', (role) => {
  roleCreateEvent(role, Frog)
})

Frog.on('roleUpdate', (oldRole, newRole) => {
  roleUpdateEvent(oldRole, newRole, Frog)
})

Frog.on('roleDelete', (role) => {
  roleDeleteEvent(role, Frog)
})

Frog.on('channelCreate', (channel) => {
  channelCreateEvent(channel, Frog)
})

Frog.on('channelUpdate', (oldChannel, newChannel) => {
  channelUpdateEvetn(oldChannel, newChannel, Frog)
})

Frog.on('channelDelete', (channel) => {
  channelDeleteEvent(channel, Frog)
})

Frog.on('channelPinsUpdate', (channel) => {
  console.log('holaa')
})

Frog.on('guildMemberAdd', (member) => {
  memberAddEvent(member, Frog)
})

Frog.on('guildMemberRemove', (member) => {
  memberRemoveEvent(member, Frog)
})

Frog.login(pepeFrog)