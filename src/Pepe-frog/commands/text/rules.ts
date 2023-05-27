import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";
import { getRules } from "../../utils/functions";

export const rulesCommand = async (msg: Message<boolean>, client: Client) => {
  const rules = await getRules(client, 'es') 
  
  const RulesEb = new EmbedBuilder()
  .setTitle('📖 Reglas')
  .setDescription(rules || '')
  .setFooter({text: "you don't speak Spanish?, Click blue button below"})
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')

  const RulesArb = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
    .setCustomId('en-rules-btn')
    .setEmoji('👅')
    .setLabel('English')
    .setStyle(ButtonStyle.Primary)
  )

  msg.channel.send({embeds: [RulesEb], components: [RulesArb]})
}