import { Client, ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";

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
.addStringOption(reazon=> 
  reazon.setName('reazon')
  .setNameLocalization('es-ES', 'razón')
  .setDescription(`📝 Provide the reason for the member timeout.`)
  .setDescriptionLocalization('es-ES', `📝 Proporciona la razón para el tiempo de espera.`)
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

export const timeoutSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  int.reply({ephemeral: true, content: 'Developing'})
}