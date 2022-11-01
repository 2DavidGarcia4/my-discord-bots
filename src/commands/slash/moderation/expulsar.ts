import { SlashCommandBuilder, Client, PermissionFlagsBits, ChatInputCommandInteraction, CacheType, EmbedBuilder, ChannelType } from "discord.js";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { botModel } from "../../../models";
import { sendMessageSlash, setSlashErrors } from "../../../utils/functions";

export const expulsarScb = new SlashCommandBuilder()
.setName('expulsar')
.setDescription(`🚪 Expulsa a un miembro del servidor.`)
.addStringOption(razon=> razon.setName('razón').setDescription(`📝 Proporciona la razón por la que expulsaras al miembro.`).setRequired(true))
.addUserOption(miembro=> miembro.setName('miembro').setDescription(`🧑 Proporciona el miembro a expulsar.`).setRequired(false))
.addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del miembro a expulsar.`).setRequired(false))
.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers).toJSON()

export const expulsarSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  estadisticas.comandos++
  const { guild, user } = int, author = guild?.members.cache.get(user.id)
  const dataBot = await botModel.findById(client.user?.id), canalRegistro = int.guild?.channels.cache.get(dataBot?.datos.registros.bot)
  const razon = int.options.getString("razón", true), preMember = int.options.getUser("miembro"), id = int.options.getString("id"), member = guild?.members.cache.get(preMember?.id || id || '')

  if(setSlashErrors(int, [
    [
      Boolean(id && isNaN(Number(id))),
      `La ID proporcionada *(${id})* no es valida ya que no es numérica.`
    ],
    [
      Boolean(!member && !id),
      `No has proporcionado el miembro a expulsar.`
    ],
    [
      Boolean(member && id),
      `No proporciones un miembro y una ID a la vez.`
    ],
    [
      Boolean(razon.length > 600),
      `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`
    ],
    [
      Boolean(member?.id == client.user?.id),
      `El miembro que has proporcionado *(${member})* soy yo, yo no me puedo expulsar a mi mismo.`
    ],
    [
      Boolean(member?.id == user.id),
      `El miembro que has proporcionado *(${member})* eres tu mismo, no te puedes expulsar a ti mismo.`
    ]
  ])) return

  const expulsarEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.avatarURL() || undefined})
  .setThumbnail(member?.displayAvatarURL({size: 1024}) || null)
  .setColor("#ff8001")
  .setTimestamp()

  const expulsarMdEb = new EmbedBuilder()
  .setAuthor({name: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
  .setThumbnail(guild?.iconURL({size: 1024}) || null)
  .setTitle("<:salir12:879519859694776360> Has sido expulsado")
  .setDescription(`**de:** ${guild?.name}\n\n📑 **Razón:** ${razon}`)
  .setFooter({text: `Por el moderador: ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
  .setColor("#ff8001")
  .setTimestamp()

  const embRegistro = new EmbedBuilder()
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
    expulsarEb
    .setTitle(`${botDB.emoji.exit} Bot expulsado`)
    .setDescription(`🤖 **Ex bot:** ${member}\n**ID:** ${member?.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
    .setFooter({text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})

    embRegistro
    .addFields(
      {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
      {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
      {name: "🤖 **Bot expulsado:**", value: `${member}\n**ID:** ${member?.id}`},
      {name: "📑 **Razón:**", value: `${razon}`}
    )

    member.kick(`Moderador: ${int.user.tag} ID: ${int.user.id} | Bot expulsado: ${member?.user.tag}, ID: ${member?.id} | Razón: ${razon}`).then(()=>{
      sendMessageSlash(int, {embeds: [expulsarEb]})
      if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({embeds: [embRegistro]})
    })
 
  }else{
    embRegistro
    .setTitle(`${botDB.emoji.exit} Miembro expulsado`)
    .setDescription(`👤 **Ex miembro:** ${member}\n**ID:** ${member?.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
    
    embRegistro
    .addFields(
      {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
      {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
      {name: "👤 **Miembro expulsado:**", value: `${member}\n**ID:** ${member?.id}`},
      {name: "📑 **Razón:**", value: `${razon}`}
    )
   
    member?.kick(`Moderador ID: ${int.user.id} | Miembro expulsado: ${member?.user.tag}, ID: ${member?.id} | Razón: ${razon}`).then(k=>{
      if(canalRegistro?.type == ChannelType.GuildText) canalRegistro.send({embeds: [embRegistro]})
      member?.send({embeds: [expulsarMdEb]}).then(()=>{
        expulsarEb
        .setFooter({text: member?.user.tag || 'undefined', iconURL: member?.displayAvatarURL()})
        
      }).catch(()=> {
        expulsarEb
        .setFooter({text: `No he podido enviar el mensaje al exmiembro ${member?.user.tag}`, iconURL: member?.displayAvatarURL()})
        
      }).finally(()=> {
        sendMessageSlash(int, {embeds: [expulsarEb]})
      })
    })
     
  }
} //*? linesas 196 a 132