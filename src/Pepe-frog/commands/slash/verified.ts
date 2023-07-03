import { Client, SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction, type CacheType } from "discord.js";

const VerifiedScb = new SlashCommandBuilder()
.setName('verified')
.setNameLocalization('es-ES', 'verificada')
.setDescription('✅ Provides information about a verified woman.')
.setDescriptionLocalization('es-ES', '✅ Proporciona información sobre una mujer verificada.')
.addUserOption(verified=>
  verified.setName('user')
  .setNameLocalization('es-ES', 'usuario')  
  .setDescription('👩 Verified user')
  .setDescriptionLocalization('es-ES', '👩 Usuario verificado')
  .setRequired(false)
).toJSON()

function verifiedSlashCommand(int: ChatInputCommandInteraction<CacheType>, client: Client) {
  const { user } = int

  const VerifiedEb = new EmbedBuilder()
  .setTitle('✅ Verificada')


  int.reply({ephemeral: true, content: 'Command under development'})
}

export default {
  Command: VerifiedScb,
  run: verifiedSlashCommand
}