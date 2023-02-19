import { Client, ChatInputCommandInteraction, CacheType, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { sendMessageSlash, setSlashErrors } from "../../../../shared/functions";
import ms from 'ms'

export const timeoutScb = new SlashCommandBuilder()
.setName('timeout')
.setNameLocalization('es-ES', 'espera')
.setDescription('⏲️ Timeout for the member')
.setDescriptionLocalization('es-ES', '⏲️ Tiempo de espera para el miembro')
.addUserOption(member=> 
  member.setName('member')
  .setNameLocalization('es-ES', 'miembro')
  .setDescription(`🧑 Provide the member.`)
  .setDescriptionLocalization('es-ES', `🧑 Proporciona el miembro.`)
  .setRequired(true)
)
.addStringOption(time=> 
  time.setName('time')
  .setNameLocalization('es-ES', 'tiempo')
  .setDescription(`🔢 Provides the waiting time.`)
  .setDescriptionLocalization('es-ES', `🔢 Proporciona el tiempo de espera.`)
  .setMaxLength(2)
  .setMaxLength(10)
  .setRequired(true)
)
.addStringOption(reazon=> 
  reazon.setName('reazon')
  .setNameLocalization('es-ES', 'razón')
  .setDescription(`📝 Provide the reason for the member timeout.`)
  .setDescriptionLocalization('es-ES', `📝 Proporciona la razón para el tiempo de espera.`)
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
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
.toJSON()

export const timeoutSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { guild, user, options, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(user.id)
  const member = guild?.members.cache.get(options.getUser('member', true).id), time = options.getString('time', true), reazon = options.getString("reazon", true), image = options.getAttachment('image')

  if(setSlashErrors(int, [
    [
      Boolean(member?.id == client.user?.id),
      (isEnglish ? `The member you provided *(${member})* is me, I can't set a timeout for myself.` : `El miembro que has proporcionado *(${member})* soy yo, yo no puedo establecer un tiempo de espera para mi.`)
    ],
    [
      Boolean(member?.id == user.id),
      (isEnglish ? `The member you provided *(${member})* is yourself, you cannot assign yourself a timeout.` : `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes asignar un tiempo de espera.`)
    ],
    [
      Boolean(member?.user.bot),
      (isEnglish ? `The member you provided *(${member})* is a bot, I can't assign timeout for a bot.` : `El miembro que ha proporcionado *(${member})* es un bot, no puedo asignar tiempo de espera para un bot.`)
    ],
    [
      Boolean(guild?.ownerId == member?.id),
      (isEnglish ? `The member you provided *(${member})* is the owner of the server, what are you trying to do?` : `El miembro que has proporcionado *(${member})* es el dueño del servidor, 'que intentas hacer?'.`)
    ],
    [
      Boolean((user.id != guild?.ownerId) && member && (author?.roles.highest.comparePositionTo(member.roles.highest) || 0) <= 0),
      (isEnglish ? `The member you provided *(${member})* has a role or more higher than yours, you can't assign timeout.` : `El miembro que has proporcionado *(${member})* tiene un rol o mas superiores a los tuyos, no le puedes asignar tiempo de espera.`)
    ],
    [
      Boolean(!ms(time)),
      (isEnglish ? `The time you provided *(${time})* is not valid.\n\n**Examples:**\n10 minutes = **10m**\n2 hours = **2h**\n5 days = **5d**` : `El tiempo que has proporcionado *(${time})* no es valido.\n\n**Ejemplos:**\n10 minutos = **10m**\n2 horas = **2h**\n5 días = **5d**`)
    ],
    [
      Boolean(ms(time) < ms('2m')),
      (isEnglish ? `The time you provided *(${time})* is less than **2** minutes, please provide a longer timeout.` : `El tiempo que has proporcionado *(${time})* es menor a **2** minutos, proporciona un tiempo de espera mayor.`)
    ],
    [
      Boolean(ms(time) > ms('20d')),
      (isEnglish ? `The time you provided *(${time})* is greater than **20** days, please provide a shorter wait time.` : `El tiempo que has proporcionado *(${time})* es mayor a **20** días, proporciona un tiempo de espera menor.`)
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
  .setTitle(`<:aislacion:947965052772814848> `+(isEnglish ? 'Timeout member' : `Miembro aislado`))
  .setDescription(`🧑 **${isEnglish ? 'Member' : 'Miembro'}:** ${member}\n**ID:** ${member?.id}\n\n📑 **${isEnglish ? 'Reazon' : 'Razón'}:** ${reazon}\n\n👮 **${isEnglish ? 'Moderator' : 'Moderador'}:** ${int.user}`)
  .setThumbnail(member?.displayAvatarURL({size: 1024, extension: member.avatar?.includes('a_') ? 'gif' : 'png'}) || null)
  .setColor("#0283F6")
  .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})
  .setTimestamp()

  const WarnDMEb = new EmbedBuilder()
  .setAuthor({name: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
  .setThumbnail(guild?.iconURL({size: 1024}) || null)
  .setTitle(`<:aislacion:947965052772814848> Has sido aislado/a`)
  .setDescription(`**en:** ${guild?.name}\n\n📑 **Razón:** ${reazon}`)
  .setFooter({text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
  .setColor("#0283F6")
  .setTimestamp()

  if(image){
    image.name = `evidence.${image.contentType?.split('/')[1]}`
    WarnEb.setImage('attachment://'+image.name)
    WarnDMEb.setImage('attachment://'+image.name)
  }

  const timeoutReazon = `${reazon} | ${isEnglish ? `Timeout member` : `Miembro aislado`}: ${member?.user.tag} | ${isEnglish ? 'Moderator' : 'Moderador'}: ${user.tag} ID: ${user.id}`

  await int.deferReply()

  member?.timeout(ms(time), timeoutReazon).then(()=> {
    member?.send({embeds: [WarnDMEb], files: image ? [image] : []}).catch(()=> {
      if(WarnEb.data.footer) WarnEb.data.footer.text = isEnglish ? `I could not send the message to the former member ${member.user.tag}` : `No he podido enviar el mensaje al ex miembro ${member?.user.tag}`
    }).finally(()=> {
      sendMessageSlash(int, {embeds: [WarnEb], files: image ? [image] : []})
    })
  })
}