import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ChannelType } from "discord.js";
import { sendMessageSlash } from "../../../../shared/functions";

export const plantillaScb = new SlashCommandBuilder()
.setName(`plantilla`)
.setDescription(`📄 Muestra la plantilla del servidor`).toJSON()

export const plantillaSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  let invitation = (await int.guild?.invites.fetch())?.find(f=> f.inviterId == client?.user?.id)
  let content = `No hay`
  const channelTemplate = int.guild?.channels.cache.get('848992769245577256')
  
  await int.deferReply({ephemeral: true})

  if(channelTemplate?.type == ChannelType.GuildText){
    let contentTemplate = (await channelTemplate.messages.fetch({limit: 2})).last()?.content.split('|').map(m=> m.includes('discord.gg/') ? invitation?.url : m)
    
    content = contentTemplate?.join(' ') || 'No hay'
  }
  const channelInvite = int.guild?.channels.cache.get('823343749039259648')
  if(!invitation && channelInvite?.type == ChannelType.GuildText){
    channelInvite.createInvite({maxAge: 0, reason: `Para el comando de barra diagonal /plantilla.`}).then(inv => invitation = inv)
  }
  sendMessageSlash(int, {content})
}