import { Message, EmbedBuilder, Client, ChannelType } from "discord.js"
import { botDB } from "../db"

const { color } = botDB

export const moderationSanction = (msg: Message<boolean>, autoModMember: {memberId: string, warnings: number}) => {
  if(autoModMember.warnings >= 2){
    const embAdvertenciaMD = new EmbedBuilder()
    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
    .setTitle(`🔗 Auto moderación de enlaces`)
    .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
    .setColor(color.negative)
    msg.author.send({embeds: [embAdvertenciaMD]}).catch(()=> '')
  }

  let timeoutText = `By auto moderation of links, the member has sent ${autoModMember.warnings} links in channels which is not allowed.`

  if(autoModMember.warnings == 3){
    msg.member?.timeout(4*60*60000, timeoutText)
  }
  if(autoModMember.warnings == 4){
    msg.member?.timeout(8*60*60000, timeoutText)
  }
  if(autoModMember.warnings == 5){
    msg.member?.timeout(10*60*60000, timeoutText)
  }
  if(autoModMember.warnings == 6){
    msg.member?.kick(timeoutText)
  }
  if(autoModMember.warnings == 7){
    msg.member?.ban({reason: timeoutText})
  }
}

export const fetchServerRules = async (client: Client) => {
  const rulesChannel = client.channels.cache.get('1073819301661913219')
  if(rulesChannel?.type == ChannelType.GuildText) return (await rulesChannel.messages.fetch('1073819326420897922')).content
}