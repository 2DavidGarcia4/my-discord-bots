import { Client, ChatInputCommandInteraction, CacheType, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

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
.toJSON()

export const warnSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  int.reply({ephemeral: true, content: 'Developing'})
}