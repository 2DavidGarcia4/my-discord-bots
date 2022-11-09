import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, CacheType, ChannelType } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { botModel } from "../../../models";
import { sendMessageSlash, setSlashError, setSlashErrors } from "../../../utils/functions";

export const banearScb = new SlashCommandBuilder()
.setName("banear")
.setDescription(`⛔ Banea a un miembro o usuario externo del servidor.`)
.addStringOption(razon=> razon.setName("razón").setDescription(`📝 Proporciona la razón por la que banearas al miembro o usuario externo.`).setRequired(true))
.addUserOption(miembro=> miembro.setName("miembro").setDescription(`🧑 Proporciona el miembro a banear.`).setRequired(false))
.addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del miembro o usuario externo a banear.`).setRequired(false))
.toJSON()

export const banearSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, options } = int, author = guild?.members.cache.get(int.user.id), { color, emoji } = botDB 

  estadisticas.comandos++
  const dataBot = await botModel.findById(client.user?.id), channelLog = guild?.channels.cache.get(dataBot?.logs.moderation || '') 
  const razon = options.getString("razón", true), preMember = options.getUser("miembro"), preId = options.getString("id"), userId = preMember?.id || preId || ''

  if(setSlashErrors(int, [
    [
      Boolean(preId && !Number(preId)),
      `La ID proporcionada *(${preId})* no es valida ya que no es numérica.`
    ],
    [
      Boolean(!preMember && !preId),
      `No has proporcionado el miembro o usuario externo a banear.`
    ],
    [
      Boolean(preMember && preId),
      `No proporciones un miembro y una ID a la vez.`
    ],
    [
      Boolean(razon.length > 600),
      `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`
    ],
    [
      Boolean(userId == client.user?.id),
      `El miembro que has proporcionado *(${guild?.members.cache.get(userId)})* soy yo, yo no me puedo banear a mi mismo.`
    ],
    [
      Boolean(userId == int.user.id),
      `El miembro que has proporcionado *(${guild?.members.cache.get(userId)})* esres tu, no te puedes banear a ti mismo.`
    ],
    [
      Boolean((await guild?.bans.fetch())?.some(s=>s.user.id == userId)),
      `El usuario con la id *${userId}* ya se encuentra baneado.`
    ]
  ])) return

  
  client.users.fetch(userId, {force: true}).then(async user => {
    const member = guild?.members.cache.get(userId), isBot = user.bot

    const banearEb = new EmbedBuilder()
    .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined})
    .setThumbnail(user.displayAvatarURL({size: 1024}))
    .setColor(color.negative)
    .setTimestamp()

    const banearMdEb = new EmbedBuilder()
    .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
    .setThumbnail(guild?.iconURL({size: 1024}) || null)
    .setTitle("⛔ Has sido baneado")
    .setDescription(`**de:** ${guild?.name}\n\n📑 **Razón:** ${razon}`)
    .setFooter({text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
    .setColor(color.negative)
    .setTimestamp()

    const logEb = new EmbedBuilder()
    .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL()})
    .setTitle("📝 Registro del comando /banear")
    .setColor(color.negative)
    .setFooter({text: user.tag, iconURL: user.displayAvatarURL()})
    .setTimestamp()

    if(user.id != int.guild?.ownerId){
      if(setSlashErrors(int, [
        [
          Boolean(user.id == guild?.ownerId),
          `El miembro que has proporcionado *(${member})* es mi creador y el dueño del servidor, **¿Qué intentas hacer?**.`
        ],
        [
          Boolean((member && author) && member.roles.highest.comparePositionTo(author.roles.highest)>=0),
          `El miembro que has proporcionado *(${member})* es mi creador y el dueño del servidor, **¿Qué intentas hacer?**.`
        ]
      ])) return
    }

    await int.deferReply()
    if(member){
      banearEb
      .setTitle(`⛔ ${isBot ? 'Bot' : 'Miembro'} baneado`)
      .setDescription(`${isBot ? '🤖 **Ex bot:**' : '👤 **Ex miembro:**'} ${user}\n**ID:** ${user.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
      .setFooter({text: user.tag, iconURL: user.displayAvatarURL()})
      
      if(!isBot) member.send({embeds: [banearMdEb]})

      member.ban({deleteMessageSeconds: 7*24*60*60, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | ${isBot ? 'Bot' : 'Miembro'} baneado: ${user.tag}, ID: ${user.id} | Razón: ${razon}`}).then(async ()=>{
        sendMessageSlash(int, {embeds: [banearEb]})
      })

      logEb
      .addFields(
        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: `${isBot ? '🤖 **Ex bot' : '👤 **Ex miembro'} baneado:**`, value: `${user}\n**ID:** ${user.id}`},
        {name: "📑 **Razón:**", value: `${razon}`}
      )

    }else{
      banearEb
      .setTitle(`⛔ ${isBot ? 'Bot' : 'Miembro'} baneado`)
      .setDescription(`${isBot ? '🤖 **Bot externo:**' : '👤 **Usuario externo:**'} ${user}\n**ID:** ${user.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
      .setFooter({text: user.tag, iconURL: user.displayAvatarURL()})

      guild?.members.ban(user, {deleteMessageSeconds: 7*24*60*60, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | ${isBot ? 'Bot' : 'Usuario'} baneado: ${user.tag}, ID: ${user.id} | Razón: ${razon}`}).then(async ()=>{
        sendMessageSlash(int, {embeds: [banearEb]})
      })

      logEb
      .addFields(
        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
        {name: `${isBot ? '🤖 **Bot' : '👤 **Usuario'} externo baneado:**`, value: `${user}\n**ID:** ${user.id}`},
        {name: "📑 **Razón:**", value: `${razon}`}
      )
    }
    
    if(channelLog?.type == ChannelType.GuildText) channelLog.send({embeds: [logEb]})

  }).catch(async (er)=>{
    setSlashError(int, `La ID que has proporcionado *(${preId})* no es una ID de ningún usuario de Discord.`)
    console.log('catch', er)
    // await int.deferReply()
  })
} //? lineas 285 