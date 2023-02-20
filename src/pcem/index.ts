import { ChannelType, Client, EmbedBuilder } from "discord.js";
import { botDB } from "./db"
import { isDevelopment, tokenBot } from "../config";
import { readyEvent } from "./events/ready"
import { messageEvent } from "./events/message";
import { interactionEvent } from "./events/interaction";
import { messageDeleteEvent } from "./events/messageDelete";
import { banAddEvent } from "./events/banAdd";
import { banRemoveEvent } from "./events/banRemove";
import { channelDeleteEvent } from "./events/channelDelete";
import { memberAddEvent } from "./events/memberAdd";
import { memberRemoveEvent } from "./events/memberRemove";
import { invitationCreateEvent } from "./events/invitationCreate";
import { invitationDeleteEvent } from "./events/invitationDelete";
import { reactionAddEvent } from "./events/reactionAdd";
import { reactionRemoveEvent } from "./events/reactionRemove";
import { messageUpdateEvent } from "./events/messageUpdate";
import { getBotData } from "./utils";
import { guildDeleteEvent } from "./events/guildDelete";
import { guildCreateEvent } from "./events/guildCreate";

const PCEM = new Client({intents: 131071}) 
export const svStatistics = {joins: 0, leaves: 0, messages: 0, commands: 0}, autoModeration = [{memberId: "717420870267830382", warnings: 0}]
export const exemptMessagesIds: string[] = []
export const cooldowns = new Map()

export const sistemMarcar: {autorID: string, sugID: string}[] = [], coolSugerencias: string[] = []
export const addUserIdCoolSug = (id: string) => {
  coolSugerencias.push(id)
}
export const addDataMarcar = (data: {autorID: string, sugID: string}) => sistemMarcar.push(data)

PCEM.on('ready', async () => {
  readyEvent(PCEM)
})

PCEM.on('messageCreate', async (message) => {
  messageEvent(message, PCEM)
})

PCEM.on('messageDelete', (message) => {
  messageDeleteEvent(message, PCEM)
})

PCEM.on('messageUpdate', (oldMessage, newMessage) => {
  messageUpdateEvent(oldMessage, newMessage, PCEM)
})

PCEM.on('interactionCreate', (interaction) => {
  interactionEvent(interaction, PCEM)
})

PCEM.on('guildMemberAdd', (member) => {
  memberAddEvent(member, PCEM)
})

PCEM.on('guildMemberRemove', (member) => {
  memberRemoveEvent(member, PCEM)
})

PCEM.on('guildCreate', (guild) => {
  guildCreateEvent(guild, PCEM)
})

PCEM.on('guildDelete', (guild) => {
  guildDeleteEvent(guild, PCEM)  
})

PCEM.on('guildBanAdd', (ban) => {
  banAddEvent(ban, PCEM)
})

PCEM.on('guildBanRemove', (ban) => {
  banRemoveEvent(ban, PCEM)
})

PCEM.on('channelDelete', (channel) => {
  channelDeleteEvent(channel, PCEM)
})

PCEM.on('inviteCreate', (invite) => {
  invitationCreateEvent(invite, PCEM)
})

PCEM.on('inviteDelete', (invite) => {
  invitationDeleteEvent(invite, PCEM)
})

PCEM.on('messageReactionAdd', (reaction, user) => {
  reactionAddEvent(reaction, user, PCEM)
})

PCEM.on('messageReactionRemove', (reaction, user) => {
  reactionRemoveEvent(reaction, user, PCEM)
})

//! Errors events
PCEM.on("shardError", async err => {
  const dataBot = await getBotData(PCEM), channelLog = PCEM.channels.cache.get(dataBot?.logs.errors || '')
  console.log(err)
  const embErr = new EmbedBuilder()
  .setTitle(`${botDB.emoji.negative} Ocurrió un error`)
  .setDescription(`\`\`\`js\n${err.name}\n\n${err.message}\n\n${err.stack}\`\`\``)
  .setColor(botDB.color.negative)
  .setTimestamp()
  if((!isDevelopment) && channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embErr]})
})

process.on("unhandledRejection", async err => {
  const dataBot = await getBotData(PCEM), channelLog = PCEM.channels.cache.get(dataBot?.logs.errors || '')
  console.log(err)
  const embErr = new EmbedBuilder()
  .setTitle(`${botDB.emoji.negative} Ocurrió un error`)
  .setDescription(`\`\`\`js\n${err}\`\`\``)
  .setColor(botDB.color.negative)
  .setTimestamp()
  if((!isDevelopment) && channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embErr]})
})

PCEM.login(tokenBot)