import { Client, Message, EmbedBuilder } from 'discord.js'
import { sendMessageText } from '../../../../shared/functions'
import { textCommands } from '../../../events/message'

export const name = 'commands'

export const commandsCommand = (msg: Message<boolean>, client: Client) => {
  const { member, guild, } = msg
  
  msg.channel.sendTyping()

  const CommandsEb = new EmbedBuilder()
  .setAuthor({name: `Hola ${member?.nickname || member?.user.username}`, iconURL: member?.user.displayAvatarURL()})
  .setTitle(`📄 Comandos`)
  .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.\n\n${textCommands.map((m, name)=> `\`\`${name}\`\``).join(', ')}`)
  .setFooter({text: guild?.name || 'undefined', iconURL: guild?.iconURL() || undefined})
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()

  sendMessageText(msg, {embeds: [CommandsEb]})
}

export const alias = ['cmds', 'comandos']