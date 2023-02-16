import { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction, CacheType, PermissionFlagsBits, ChannelType } from "discord.js";
import { botDB } from "../../../db";
import { sendMessageSlash, setSlashError } from "../../../../shared/functions";
import { getBotData } from "../../../utils";

export const desbanearScb = new SlashCommandBuilder()
.setName("unban")
.setNameLocalization('es-ES', "desbanear")
.setDescription(`❎ Unban a user from the server.`)
.setDescriptionLocalization('es-ES', `❎ Des banea a un usuario del servidor.`)
.addStringOption(id=> 
  id.setName("id")
  .setDescription(`🆔 ID of the user to unban.`)
  .setDescriptionLocalization('es-ES', `🆔 ID del usuario a desbanear.`)
  .setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
.toJSON()

export const desbanearSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, options, locale } = int, isEnglish = locale == 'en-US' , author = guild?.members.cache.get(int.user.id) , { emoji, color } = botDB
  
  const dataBot = await getBotData(client), channelLog = guild?.channels.cache.get(dataBot?.logs.moderation || '')
  const id = options.getString('id', true)

  if(!Number(id)) return setSlashError(int, (isEnglish ? `The provided ID *(${id})* cannot be valid as it is not numeric.` : `La ID proporcionada *(${id})* no puede ser valida ya que no es numérica.`))
  if(!(await guild?.bans.fetch())?.some(s=>s.user.id == id)) return setSlashError(int, (isEnglish ? `The user *(<@${id}>)* is not banned.` : `El usuario *(<@${id}>)* no esta baneado.`))
  
  const moderatorTxt = isEnglish ? 'Moderator' : 'Moderador'

  client.users.fetch(id, {force: true}).then(async user => {
    const UnbanEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined})
    .setThumbnail(user.displayAvatarURL({size: 1024, extension: 'png'}))
    .setFooter({text: guild?.name || '', iconURL: guild?.iconURL() || undefined})
    .setColor(color.afirmative)
    .setTimestamp()

    const UnbanLogEb = new EmbedBuilder()
    .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL()})
    .setTitle("📝 Registro del comando /desbanear")
    .setColor(color.afirmative)
    .setFooter({text: user.tag, iconURL: user.displayAvatarURL()})
    .setTimestamp()

    await int.deferReply()
    if(user.bot){
      UnbanEb
      .setTitle(`${emoji.afirmative} ${isEnglish ? 'Unbanned bot' : 'Bot desbaneado'}`)
      .setDescription(`🤖 **Bot:** ${user}\n**ID:** ${user.id}\n\n👮 **${moderatorTxt}:** ${int.user}`)
  
      guild?.members.unban(user.id, `${moderatorTxt}: ${int.user.tag} ID: ${int.user.id} | ${isEnglish ? 'Unbanned bot' : 'Bot desbaneado'}: ${user.tag}, ID: ${user.id}`).then(k=>{
        sendMessageSlash(int, {embeds: [UnbanEb]})
      })

      UnbanLogEb
      .addFields(
        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: "🤖 **Bot desbaneado:**", value: `${user}\n**ID:** ${user.id}`},
      )

    }else{
      UnbanEb
      .setTitle(`${emoji.afirmative} ${isEnglish ? 'Unbanned user' : 'Usuario desbaneado'}`)
      .setDescription(`👤 **Usuario:** ${user}\n**ID:** ${user.id}\n\n👮 **Moderador:** ${int.user}`)
  
      guild?.members.unban(user.id, `${moderatorTxt}: ${int.user.tag} ID: ${int.user.id} | ${isEnglish ? 'Unbanned user' : 'Usuario desbaneado'}: ${user.tag}, ID: ${user.id}`).then(k=>{
        sendMessageSlash(int, {embeds: [UnbanEb]})
      })

      UnbanLogEb
      .addFields(
        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: "👤 **Usuario desbaneado:**", value: `${user}\n**ID:** ${user.id}`},
      )
    }
    // if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [UnbanLogEb]})

  }).catch(c=>{
    setSlashError(int, `${isEnglish ? `The ID you provided *(${id})* is not an ID of any Discord user` : `La ID que has proporcionado *(${id})* no es una ID de ningún usuario de Discord`}.`)
  })
}