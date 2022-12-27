import { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction, CacheType, PermissionFlagsBits, ChannelType } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { botModel } from "../../../models";
import { sendMessageSlash, setSlashError, setSlashErrors } from "../../../../utils/functions";

export const desbanearScb = new SlashCommandBuilder()
.setName("desbanear")
.setDescription(`✅ Des banea a un usuario del servidor.`)
.addStringOption(id=> id.setName("id").setDescription(`🆔 ID del usuario a desbanear.`).setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
.toJSON()

export const desbanearSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, options } = int, author = guild?.members.cache.get(int.user.id) , { emoji, color } = botDB
  
  const dataBot = await botModel.findById(client.user?.id), channelLog = guild?.channels.cache.get(dataBot?.logs.moderation || '')
  const id = options.getString('id', true)
  estadisticas.comandos++

  if(!Number(id)) return setSlashError(int, `La ID proporcionada *(${id})* no es valida ya que no es numérica.`)
  if(!(await guild?.bans.fetch())?.some(s=>s.user.id == id)) return setSlashError(int, `El usuario *(${id})* no esta baneado.`)
  
  client.users.fetch(id, {force: true}).then(async user => {

    const desbanearEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined})
    .setThumbnail(user.displayAvatarURL({size: 1024}))
    .setFooter({text: user.tag, iconURL: user.displayAvatarURL()})
    .setColor(color.afirmative)
    .setTimestamp()

    const logEb = new EmbedBuilder()
    .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL()})
    .setTitle("📝 Registro del comando /desbanear")
    .setColor(color.afirmative)
    .setFooter({text: user.tag, iconURL: user.displayAvatarURL()})
    .setTimestamp()

    await int.deferReply()
    if(user.bot){
      desbanearEb
      .setTitle(`${emoji.afirmative} Bot desbaneado`)
      .setDescription(`🤖 **Bot:** ${user}\n**ID:** ${user.id}\n\n👮 **Moderador:** ${int.user}`)
  
      guild?.members.unban(user.id, `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot desbaneado: ${user.tag}, ID: ${user.id}`).then(k=>{
        sendMessageSlash(int, {embeds: [desbanearEb]})
      })

      logEb
      .addFields(
        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: "🤖 **Bot desbaneado:**", value: `${user}\n**ID:** ${user.id}`},
      )

    }else{
      desbanearEb
      .setTitle(`${emoji.afirmative} Usuario desbaneado`)
      .setDescription(`👤 **Usuario:** ${user}\n**ID:** ${user.id}\n\n👮 **Moderador:** ${int.user}`)
  
      guild?.members.unban(user.id, `Moderador: ${int.user.tag} ID: ${int.user.id} | Usuario desbaneado: ${user.tag}, ID: ${user.id}`).then(k=>{
        sendMessageSlash(int, {embeds: [desbanearEb]})
      })

      logEb
      .addFields(
        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: "👤 **Usuario desbaneado:**", value: `${user}\n**ID:** ${user.id}`},
      )
    }
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [logEb]})
  }).catch(c=>{
    setSlashError(int, `La ID que has proporcionado *(${id})* no es una ID de ningún usuario de Discord.`)
  })
}