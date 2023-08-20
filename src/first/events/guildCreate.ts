import { Guild, EmbedBuilder, ChannelType, AuditLogEvent } from 'discord.js'
import { botDB } from '../data'
import { getBotData, getUsersData, updateUsersData } from '../utils'
import { BotEvent } from '../..'
import { FirstClientData } from '..'

export default class GuildCreateEvent extends BotEvent {
  constructor() {
    super('guildCreate')
  }

  async execute(guild: Guild, client: FirstClientData) {
    const botData = await getBotData(client), channelLog = client.channels.cache.get(botData?.logs.guildCreate || '')
    const owner = guild.members.cache.get(guild.ownerId)
    
    const usersData = await getUsersData(client)
    
    const guildRoles = guild.roles.cache.filter(f => !f.managed && f.id != guild.id).map(m => Object({ posicion: m.position, nombre: m.name })).slice(0, 10).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ")
    const invited = (await guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.BotAdd})).entries.first()
  
    if(usersData){
      const user = usersData?.find(f=> f.userId == invited?.executor?.id), rol = '851577906828148766'
      const server = client.guilds.cache.get(botDB.serverId)
      if(user){
        user.guilds.push(guild.id)
        const member = server?.members.cache.get(user.userId)
        if(member){
          if(!member.roles.cache.has(rol)) member.roles.add(rol)
        }
    
      }else if(invited?.executor){
        usersData?.push({
          userId: invited.executor.id,
          guilds: [guild.id]
        })
        const member = server?.members.cache.get(invited.executor.id)
        if(member){
          if(!member.roles.cache.has(rol)) member.roles.add(rol)
        }
      }
      await updateUsersData(client, usersData)
    }
    
    const InvitedEb = new EmbedBuilder()
    .setAuthor({name: guild.name, iconURL: guild.iconURL() || undefined})
    .setTitle(`👋 Hello ${invited?.executor?.username}`)
    .setDescription('Thank you for inviting me to your server. I hope it will be useful to you.\nYou can use the </help:1075471229139550279> command to get more information about me and my commands.')
    .setColor('Yellow')
    client.users.cache.get(invited?.executor?.id || '')?.send({embeds: [InvitedEb]})
  
    const GuildCreateEb = new EmbedBuilder()
    .setAuthor({name: owner?.user.tag || '', iconURL: owner?.user.displayAvatarURL()})
    .setThumbnail(guild.iconURL({size: 2048}))
    .setImage(guild.bannerURL({size: 2048}))
    .setTitle("➕ Added on a new server")
    .setDescription(`${guild.name}\n${guild.description || '*No description*'}`)
    .setFields(
      { name: `<:wer:920166217086537739> **Guild:**`, value: `🆔 ID: ${guild.id}\n📅 Created at <t:${Math.floor(guild.createdAt.valueOf() / 1000)}:F> *(<t:${Math.floor(guild.createdAt.valueOf() / 1000)}:R>)*`, inline: true },
      { name: `👥 **Members:** ${guild.members.cache.size.toLocaleString()}`, value: `👤 Users: ${guild.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true },
      { name: `🌈 **Roles:** ${guild.roles.cache.size}`, value: `${guildRoles}`, inline: true },
      { name: `📑 **Channels:** ${guild.channels.cache.size.toLocaleString()}`, value: `<:canaldetexto:904812801925738557> texto ${guild.channels.cache.filter(f => f.type == ChannelType.GuildText).size}\n<:canaldevoz:904812835295596544> voz ${guild.channels.cache.filter(f => f.type == ChannelType.GuildVoice).size}\n<:carpeta:920494540111093780> categorías ${guild.channels.cache.filter(f => f.type == ChannelType.GuildCategory).size}`, inline: true },
      { name: `👑 **Owner:**`, value: `${owner?.user.tag}\n🆔 ${owner?.id}`, inline: true },
      { name: `🧑 **Invited by:**`, value: `${invited?.executor?.tag}\n🆔 ${invited?.executor?.id}`, inline: true },
      { name: `🗒️ **Permissions:** ${guild.members.me?.permissions.toArray().length}`, value: `${guild.members.me?.permissions.toArray().map(m => m).join(", ")}`, inline: true }
    )
    .setColor('Green')
    .setTimestamp()
  
    let invite
  
    if(guild.members.me?.permissions.has('ManageGuild')) {
      invite = (await guild.invites.fetch()).filter(f => f.maxAge == 0).map(m => m.url).slice(0, 2).join("\n")
      if (invite.length <= 0) {
        invite = (await guild.invites.fetch()).map(i => i.url).slice(0, 2).join("\n")
        if (invite.length <= 0) {
          invite = "There are no invites on the guild"
        }
      }
  
      if(GuildCreateEb.data.fields) GuildCreateEb.data.fields.splice(6, 0, {
        name: `📨 **Invitations:**`,
        value: `${(await guild.invites.fetch()).size.toLocaleString()}`
      })
    }
  
    if(channelLog?.isTextBased()) channelLog.send({embeds: [GuildCreateEb], content: `${invite || `*I couldn't get any guild invite.*`}`})
  }
}