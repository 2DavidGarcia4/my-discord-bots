import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand, type SlashInteraction } from '../../..'
import { FrogDb } from '../../data'
import { VerifiedsModel } from '../../../models'
import { sendMessageSlash, setSlashError } from '../../../shared/functions'
import { type SecondClientData } from '../..'

const AddScb = new SlashCommandBuilder()
.setName('add')
.setNameLocalization('es-ES', 'agregar')
.setDescription('➕ Add command')
.setDescriptionLocalization('es-ES', '➕ Comando agregar')
.addSubcommand(verified=>
  verified.setName('verified')
  .setNameLocalization('es-ES', 'verificada')
  .setDescription('✅ Add a new verified to the system')
  .setDescriptionLocalization('es-ES', '✅ Agrega a una nueva verificada al sistema')
  .addUserOption(girl=>
    girl.setName('girl')
    .setNameLocalization('es-ES', 'chica')
    .setDescription('👩 The new verified')
    .setDescriptionLocalization('es-ES', '👩 La nueva verificada')
    .setRequired(true)
  )
  .addStringOption(channelId=>
    channelId.setName('channel')
    .setNameLocalization('es-ES', 'canal')
    .setDescription('🆔 Channel ID')
    .setDescriptionLocalization('es-ES', '🆔 Canal ID')
    .setRequired(true)
  )
)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON()

export default class AddSlashCommand extends SlashCommand {
  constructor() {
    super({
      struct: AddScb,
      guildsIds: [FrogDb.serverId]
    })
  }

  public async execute(int: SlashInteraction, client: SecondClientData) {
    const { guild, options } = int, subCommandName = options.getSubcommand(true)

    if(subCommandName == 'verified'){
      const girl = options.getUser('girl', true), channelId = options.getString('channel', true)

      const verified = await VerifiedsModel.findOne({userId: girl.id})
      if(verified) return setSlashError(int, `The girl ${girl} is already verified`)

      await int.deferReply({ephemeral: true})

      const { roles } = client.data
      guild?.members.cache.get(girl.id)?.roles.add(roles.verified)

      VerifiedsModel.create({
        userId: girl.id,
        channelId,
        ping: true,
        verifiedAt: Date.now(),
        contentHidden: false,
        channelHidden: false
      })

      const AddVerifiedEb = new EmbedBuilder()
      .setTitle('➕ New verified')
      .setDescription(`New verified girl ${girl}`)
      .setColor('Green')

      sendMessageSlash(int, {embeds: [AddVerifiedEb]})
    }
  }
}