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

const Bot = new Client({intents: 131071}) 
export const svStatistics = {joins: 0, leaves: 0, messages: 0, commands: 0}, autoModeration = [{memberId: "717420870267830382", warnings: 0}]
export const exemptMessagesIds: string[] = []
export const cooldowns = new Map()

export const sistemMarcar: {autorID: string, sugID: string}[] = [], coolSugerencias: string[] = []
export const addUserIdCoolSug = (id: string) => {
  coolSugerencias.push(id)
}
export const addDataMarcar = (data: {autorID: string, sugID: string}) => sistemMarcar.push(data)

Bot.on('ready', async () => {
  readyEvent(Bot)
})

Bot.on('messageCreate', async (message) => {
  messageEvent(message, Bot)
})

Bot.on('messageDelete', (message) => {
  messageDeleteEvent(message, Bot)
})

Bot.on('messageUpdate', (oldMessage, newMessage) => {
  messageUpdateEvent(oldMessage, newMessage, Bot)
})

Bot.on('interactionCreate', (interaction) => {
  interactionEvent(interaction, Bot)
})

Bot.on('guildMemberAdd', (member) => {
  memberAddEvent(member, Bot)
})

Bot.on('guildMemberRemove', (member) => {
  memberRemoveEvent(member, Bot)
})

Bot.on('guildCreate', (guild) => {
  guildCreateEvent(guild, Bot)
})

Bot.on('guildDelete', (guild) => {
  guildDeleteEvent(guild, Bot)  
})

Bot.on('guildBanAdd', (ban) => {
  banAddEvent(ban, Bot)
})

Bot.on('guildBanRemove', (ban) => {
  banRemoveEvent(ban, Bot)
})

Bot.on('channelDelete', (channel) => {
  channelDeleteEvent(channel, Bot)
})

Bot.on('inviteCreate', (invite) => {
  invitationCreateEvent(invite, Bot)
})

Bot.on('inviteDelete', (invite) => {
  invitationDeleteEvent(invite, Bot)
})

Bot.on('messageReactionAdd', (reaction, user) => {
  reactionAddEvent(reaction, user, Bot)
})

Bot.on('messageReactionRemove', (reaction, user) => {
  reactionRemoveEvent(reaction, user, Bot)
})

//! Errors events
Bot.on("shardError", async err => {
  const dataBot = await getBotData(Bot), channelLog = Bot.channels.cache.get(dataBot?.logs.errors || '')
  console.log(err)
  const embErr = new EmbedBuilder()
  .setTitle(`${botDB.emoji.negative} Ocurrió un error`)
  .setDescription(`\`\`\`js\n${err.name}\n\n${err.message}\n\n${err.stack}\`\`\``)
  .setColor(botDB.color.negative)
  .setTimestamp()
  if((!isDevelopment) && channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embErr]})
})

process.on("unhandledRejection", async err => {
  const dataBot = await getBotData(Bot), channelLog = Bot.channels.cache.get(dataBot?.logs.errors || '')
  console.log(err)
  const embErr = new EmbedBuilder()
  .setTitle(`${botDB.emoji.negative} Ocurrió un error`)
  .setDescription(`\`\`\`js\n${err}\`\`\``)
  .setColor(botDB.color.negative)
  .setTimestamp()
  if((!isDevelopment) && channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [embErr]})
})

Bot.login(tokenBot)