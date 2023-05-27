import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Message } from "discord.js";
import { getVerifiedsInfo } from "../../utils/functions";

export const girlsCommand = async (msg: Message<boolean>, client: Client) => {
  const verifiedInfo = await getVerifiedsInfo(client, 'es')

  const GirlsEb = new EmbedBuilder()
  .setTitle(`<a:animate_info:1058179015938158592> Información`)
  .setDescription(`${verifiedInfo}`)
  .setFooter({text: "speak English?, Click blue button below"})
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const GirlsBtns = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
    .setCustomId('en-girls-btn')
    .setLabel('English')
    .setEmoji('👅')
    .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
    .setCustomId('verifieds-btn')
    .setLabel('Verificadas')
    .setEmoji('✅')
    .setStyle(ButtonStyle.Success)
  )

  msg.channel.send({embeds: [GirlsEb], components: [GirlsBtns]})
}