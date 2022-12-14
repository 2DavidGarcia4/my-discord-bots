import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild } from "discord.js";

export const rulesCommand = async (msg: Message<boolean>) => {
  const RulesEb = new EmbedBuilder()
  .setTitle('📖 Reglas')
  .setDescription(`> **1.** Respeto mutuo, trata a los demás con respeto. No se tolerará ningún tipo de acoso, caza de brujas, sexismo, racismo o discurso de odio.\n\n> **2.** No incite a otros a hacer practicas maliciosas como el raideo, scam entre otras.\n\n> 3. No se permite el spam ni la autopromoción (invitaciones al servidor, anuncios, etc.) sin permiso de un miembro del personal. Esto también incluye mandar MD a otros miembros.\n\n> **4.** No fotopollas, por favor no enviar fotos de su pene esta prohibido por el momento ya que este servidor es un servidor enfocado en el contenido sexual femenino.\n\n> **5.** Si ves algo que va en contra de las normas o que no te haga sentir seguro, informa al personal. ¡Queremos que este servidor sea un lugar acogedor!`)
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