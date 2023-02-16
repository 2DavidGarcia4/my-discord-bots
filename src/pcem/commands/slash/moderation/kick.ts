import { SlashCommandBuilder, Client, PermissionFlagsBits, ChatInputCommandInteraction, CacheType, EmbedBuilder, ChannelType } from "discord.js";
import { botDB } from "../../../db";
import { sendMessageSlash, setSlashErrors } from "../../../../shared/functions";
import { getBotData } from "../../../utils";

export const expulsarScb = new SlashCommandBuilder()
.setName('kick')
.setNameLocalization('es-ES', 'expulsar')
.setDescription(`🚪 Kick a member from the server.`)
.setDescriptionLocalization('es-ES', `🚪 Expulsa a un miembro del servidor.`)
.addUserOption(member=> 
  member.setName('member')
  .setNameLocalization('es-ES', 'miembro')
  .setDescription(`🧑 Provide the member to be kicked.`)
  .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro a expulsar.`)
  .setRequired(true)
)
.addStringOption(reazon=> 
  reazon.setName('reazon')
  .setNameLocalization('es-ES', 'razón')
  .setDescription(`📝 Provide the reason why you will expel the member.`)
  .setDescriptionLocalization('es-ES', `📝 Proporciona la razón por la que expulsaras al miembro.`)
  .setRequired(true)
)
.addAttachmentOption(image=>
  image.setName('image')
  .setNameLocalization('es-ES', 'imagen')
  .setDescription('🖼️ Image of evidence')
  .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
  .setRequired(false)
)
.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
.toJSON()

export const expulsarSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, options, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(user.id)
  const dataBot = await getBotData(client), canalRegistro = int.guild?.channels.cache.get(dataBot?.logs.moderation || '')
  const razon = options.getString("reazon", true), member = guild?.members.cache.get(options.getUser('member', true).id), image = options.getAttachment('image')

  if(setSlashErrors(int, [
    [
      Boolean(member?.id == client.user?.id),
      `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo expulsar a mi mismo.`
    ],
    [
      Boolean(member?.id == user.id),
      `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes expulsar a ti mismo.`
    ],
    [
      Boolean(guild?.ownerId == member?.id),
      `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`
    ],
    [
      Boolean(member && (guild?.members.me?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
      `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los míos, no lo puedo expulsar.`
    ],
    [
      Boolean(member && (author?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
      `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los tuyos, no lo puedes expulsar.`
    ],
    [
      Boolean(razon.length > 600),
      `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`
    ],
  ])) return

  const KickEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined})
  .setThumbnail(member?.displayAvatarURL({size: 1024}) || null)
  .setColor("#ff8001")
  .setTimestamp()

  const KickDmEb = new EmbedBuilder()
  .setAuthor({name: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
  .setThumbnail(guild?.iconURL({size: 1024}) || null)
  .setTitle("<:salir12:879519859694776360> Has sido expulsado")
  .setDescription(`**de:** ${guild?.name}\n\n📑 **Razón:** ${razon}`)
  .setFooter({text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
  .setColor("#ff8001")
  .setTimestamp()

  const KickLogEb = new EmbedBuilder()
  .setAuthor({name: `Ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
  .setTitle("📝 Registro del comando /expulsar")
  .setColor("#ff8001")
  .setFooter({text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
  .setTimestamp()

  if(int.user.id != guild?.ownerId){
    if(setSlashErrors(int, [
      [
        Boolean(member?.id == guild?.ownerId),
        `El miembro que has proporcionado *(${member})* es el dueño del servidor, ¿como se te ocurre intentar tal cosa?.`
      ],
      [
        Boolean((member && author) && member.roles.highest.comparePositionTo(author.roles.highest)>=0),
        `El rol mas alto del miembro que has proporcionado *(${member})* esta en una posición mayor o igual a la posición de tu rol mas alto, no puedes expulsar al miembro.`
      ]
    ])) return
  }
  
  await int.deferReply()
  if(member?.user.bot){
    KickEb
    .setTitle(`${botDB.emoji.exit} Bot expulsado`)
    .setDescription(`🤖 **Ex bot:** ${member}\n**ID:** ${member?.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
    .setFooter({text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})

    KickLogEb
    .addFields(
      {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
      {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
      {name: "🤖 **Bot expulsado:**", value: `${member}\n**ID:** ${member?.id}`},
      {name: "📑 **Razón:**", value: `${razon}`}
    )

    member.kick(`Moderador: ${int.user.tag} ID: ${int.user.id} | Bot expulsado: ${member?.user.tag}, ID: ${member?.id} | Razón: ${razon}`).then(()=>{
      sendMessageSlash(int, {embeds: [KickEb]})
      // if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({embeds: [KickLogEb]})
    })
 
  }else{
    KickEb
    .setTitle(`${botDB.emoji.exit} Miembro expulsado`)
    .setDescription(`👤 **Ex miembro:** ${member}\n**ID:** ${member?.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
    
    KickLogEb
    .addFields(
      {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
      {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
      {name: "👤 **Miembro expulsado:**", value: `${member}\n**ID:** ${member?.id}`},
      {name: "📑 **Razón:**", value: `${razon}`}
    )
   
    member?.kick(`Moderador ID: ${int.user.id} | Miembro expulsado: ${member?.user.tag}, ID: ${member?.id} | Razón: ${razon}`).then(k=>{
      // if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({embeds: [KickLogEb]})
      member?.send({embeds: [KickDmEb]}).then(()=>{
        KickEb
        .setFooter({text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
        
      }).catch(()=> {
        KickEb
        .setFooter({text: `No he podido enviar el mensaje al exmiembro ${member?.user.tag}`, iconURL: member?.displayAvatarURL()})
        
      }).finally(()=> {
        sendMessageSlash(int, {embeds: [KickEb]})
      })
    })
     
  }
} //*? linesas 196 a 132