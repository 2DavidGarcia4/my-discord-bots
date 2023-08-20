import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { botDB } from '../../data'
import { sendMessageSlash } from '../../../shared/functions'
import { getEmbedColor } from '../../utils'
import { SlashCommand, type SlashInteraction } from '../../..'
import { FirstClientData } from '../..'

const PingScb = new SlashCommandBuilder()
.setName("ping")
.setDescription('🏓 My latency')
.setDescriptionLocalization('es-ES', "🏓 Mi latencia")
.toJSON()

export default class PingSlashCommand extends SlashCommand {
  constructor() {
    super({
      struct: PingScb
    })
  }

  async execute(int: SlashInteraction, client: FirstClientData) {
    const author = int.guild?.members.cache.get(int.user.id), { ws: {ping} } = client, {emoji} = botDB
    const latency = ping <= 60 ? emoji.ping30ms : ping <= 120 ? emoji.ping60ms : emoji.ping100ms
    
    await int.deferReply()
    
    const embPing = new EmbedBuilder()
    .setAuthor({name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL()})
    .setTitle("🏓 Pong")
    .setDescription(`${latency} ${client.ws.ping} ms`)
    .setColor(getEmbedColor(int.guild))
    .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
    .setTimestamp()
    
    sendMessageSlash(int, {embeds: [embPing]})
  }
}