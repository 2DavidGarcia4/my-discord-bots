import { Client, ChatInputCommandInteraction, CacheType, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { sendMessageSlash, setSlashErrors } from "../../../../shared/functions";
import { botDB } from "../../../db";

export const warnScb = new SlashCommandBuilder()
.setName('warn')
.setNameLocalization('es-ES', 'advertir')
.setDescription('⚠️ Warn a member from the server.')
.setDescriptionLocalization('es-ES', '⚠️ Advertir a un miembro del servidor.')
.addUserOption(member=> 
  member.setName('member')
  .setNameLocalization('es-ES', 'miembro')
  .setDescription(`🧑 Provide the member to be warn.`)
  .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro a advertir.`)
  .setRequired(true)
)
.addStringOption(reazon=> 
  reazon.setName('reazon')
  .setNameLocalization('es-ES', 'razón')
  .setDescription(`📝 Provide the reason why you will warn the member.`)
  .setDescriptionLocalization('es-ES', `📝 Proporciona la razón por la que advertiras al miembro.`)
  .setMinLength(4)
  .setMaxLength(800)
  .setRequired(true)
)
.addAttachmentOption(image=>
  image.setName('image')
  .setNameLocalization('es-ES', 'imagen')
  .setDescription('🖼️ Image of evidence')
  .setDescriptionLocalization('es-ES', '🖼️ Imagen de evidencia.')
  .setRequired(false)
)
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers | PermissionFlagsBits.KickMembers)
.toJSON()

export const warnSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, options, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(user.id)
  const member = guild?.members.cache.get(options.getUser('member', true).id), reazon = options.getString("reazon", true), image = options.getAttachment('image')

  if(setSlashErrors(int, [
    [
      Boolean(member?.id == client.user?.id),
      (isEnglish ? `The member who provided *(${member})* it's me, I can't warn myself.` : `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo advertir a mi mismo.`)
    ],
    [
      Boolean(member?.id == user.id),
      (isEnglish ? `The member you provided *(${member})* is yourself, you can't warn yourself.` : `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes advertir a ti mismo.`)
    ],
    [
      Boolean(user.bot),
      (isEnglish ? `The member you provided *(${member})* is a bot, I can't warn a bot.` : `El miembro que ha proporcionado *(${member})* es un bot, no puedo advertir un bot.`)
    ],
    [
      Boolean(guild?.ownerId == member?.id),
      (isEnglish ? `The member you provided *(${member})* is the owner of the server, what are you trying to do?` : `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`)
    ],
    [
      Boolean(member && (guild?.members.me?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
      (isEnglish ? `The member you provided *(${member})* has a role or more higher than mine, I can't warn him out.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los míos, no lo puedo advertir.`)
    ],
    [
      Boolean((user.id != guild?.ownerId) && member && (author?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
      (isEnglish ? `The member you provided *(${member})* has a role or more higher than yours, you can't warn them.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los tuyos, no lo puedes advertir.`)
    ],
    [
      Boolean(image && image.contentType?.split('/')[0] != 'image'),
      (isEnglish ? `The file provided is not an image, please provide an image as evidence.` : `El archivo proporcionado no es una imagen, proporciona una imagen como evidencia.`)
    ],
    [
      Boolean(image && image.size >= 8000000),
      (isEnglish ? `The image weight is equal to or greater than **8MB**, it provides a lighter image.` : `El peso de la imagen es igual o mayor a **8MB**, proporciona una imagen mas ligera.`)
    ]
  ])) return

  const WarnEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined})
  .setTitle(`${botDB.emoji.exit} `+(isEnglish ? 'Member warned' : `Miembro advertido`))
  .setDescription(`🧑 **${isEnglish ? 'Member' : 'Miembro'}:** ${member}\n**ID:** ${member?.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
  .setThumbnail(member?.displayAvatarURL({size: 1024, extension: member.avatar?.includes('a_') ? 'gif' : 'png'}) || null)
  .setColor("#E5DA00")
  .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})
  .setTimestamp()

  const WarnDMEb = new EmbedBuilder()
  .setAuthor({name: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
  .setThumbnail(guild?.iconURL({size: 1024}) || null)
  .setTitle(`${botDB.emoji.exit} Has sido advertido/a`)
  .setDescription(`**en:** ${guild?.name}\n\n📑 **Razón:** ${reazon}`)
  .setFooter({text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
  .setColor("#E5DA00")
  .setTimestamp()

  if(image){
    image.name = `evidence.${image.contentType?.split('/')[1]}`
    WarnEb.setImage('attachment://'+image.name)
    WarnDMEb.setImage('attachment://'+image.name)
  }

  await int.deferReply()

  member?.send({embeds: [WarnDMEb], files: image ? [image] : []}).catch(()=> {
    if(WarnEb.data.footer) WarnEb.data.footer.text = isEnglish ? `I could not send the message to the former member ${member.user.tag}` : `No he podido enviar el mensaje al ex miembro ${member?.user.tag}`
  }).finally(()=> {
    sendMessageSlash(int, {embeds: [WarnEb], files: image ? [image] : []})
  })
}