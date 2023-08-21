import { EmbedBuilder, GuildMember } from 'discord.js'
import { FrogDb } from '../data'
import { inDevelopment } from '../../config'
import { BotEvent } from '../..'

export default class MemberAddEvent extends BotEvent {
  constructor() {
    super('guildMemberAdd')
  }

  async execute(member: GuildMember) {
    const { serverId } = FrogDb
    if(member.guild.id != serverId) return
    
    FrogDb.joins++
  
    const MemberAddEb = new EmbedBuilder()
    .setThumbnail(member.displayAvatarURL({extension: 'png'}))
    .setTitle(`👋 Hello, welcome ${member.user.username}`)
    .setDescription(`*Welcome to **${member.guild.name}** my server, I hope you have a good stay, some things you should know before discovering what we offer at **${member.guild.name}** son:*\n\n📑 **Channels:**\n> The general chat channel <#1139574512371896350> where you can chat with the other members of the server.\n\n> The <#1139599846257459291> roles channel in which you can obtain roles, these roles can be roles to modify your profile within the server, roles that notify you about actions carried out on the server, among other types.\n\n> The <#1139583979293524118> rules channel, if you have any questions about any rule, you can see the rules on the channel whenever you want.\n\nℹ️ **Important:**\n> On the server we help those women who sell their content, we give them an exclusive channel where they can post messages in order to promote themselves and get clients.\n\n> There is exclusive hidden content, this content is of a higher quality, higher image quality, video and longer video duration. To access it you can improve or boost the server, another way would be to pay for access. More than **26** channels with content await you.\n\n*I'm a bot, if you try to talk to me it's likely that I don't have the capacity to do so, if you need any kind of help or doubt, you can talk to an administrator*`)
    .setColor(member.guild.members.me?.displayHexColor || 'White')
    if(!inDevelopment) member.send({embeds: [MemberAddEb]}).catch(()=> 'No message')
  }
}