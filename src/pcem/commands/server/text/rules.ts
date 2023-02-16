import { Client, EmbedBuilder, Message } from "discord.js";
import { exemptMessagesIds } from "../../..";
import { fetchServerRules } from "../../../utils";

export const name = "reglas"

export const rulesCommand = async (msg: Message<boolean>, client: Client) => {
  if(!msg.member?.permissions.has('Administrator')) return

  const rules = await fetchServerRules(client)
  
  const RulesEb = new EmbedBuilder()
  .setAuthor({name: "📜 Reglas"})
  .setDescription(rules || '')
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')
  .setFooter({text: 'En caso de tener alguna duda abrir un ticket o mencionar a un miembro del equipo de soporte.', iconURL: msg.guild?.iconURL() || undefined})
  .setTimestamp()

  msg.channel.send({embeds: [RulesEb]}).then(()=> {
    exemptMessagesIds.push(msg.id)
    setTimeout(()=> msg.delete(), 2000)
  })
}