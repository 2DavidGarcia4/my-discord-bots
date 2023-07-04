import { type NonThreadGuildBasedChannel } from "discord.js";
import { Frog as client } from ".."
import { FrogDb } from "../db";

export async function channelCreateEvent(channel: NonThreadGuildBasedChannel) {
  const { serverId, principalServerId } = FrogDb
  if(channel.guildId != serverId) return

  const principalServer = client.guilds.cache.get(principalServerId)
  const prinCategory = principalServer?.channels.cache.find(f=> f.name == channel.parent?.name)
  principalServer?.channels.create({name: channel.name, parent: prinCategory?.id, position: channel.position, type: channel.type})
}