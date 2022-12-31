import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from "discord.js";

export const girlsCommand = async (msg: Message<boolean>) => {
  const GirlsEb = new EmbedBuilder()
  .setTitle(`<a:info_animate:1052698253394710599> Información`)
  .setDescription(`**¿Eres mujer y vendes tu contenido?**, esto es para ti.\n\nPuedes tener un canal totalmente exclusivo para ti en esta categoría, en el canal podrás promocionarte publicar que vendes contenido y con ello poder utilizar las menciones @everyone o @here la primera mención notifica a todos los miembros mientras que la segunda solo notifica a los miembros conectados pero estas menciones solo las podrás utilizar una vez a la semana.\n\nPara obtener estos beneficios tienes que tener **18** años o mas y pasar por una verificación haciendo [zing](https://www.neostuff.net/que-es-un-zing/), una vez pases la verificación se te otorgara un rol único y el canal con el nombre que desees.\n*Esta verificación es para comprobar que en realidad eres mujer y no un hombre haciéndose pasar por una.*\n\n*Si estas conforme con esto y quieres empezar con la verificación o tienes dudas puedes hablar al privado con el administrador <@853063286320922634>.*`)
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