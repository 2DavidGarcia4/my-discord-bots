import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { setSlashError } from "../../../../shared/functions";
import { botDB } from "../../../db";

export const sayScb = new SlashCommandBuilder()
.setName('say')
.setNameLocalization('es-ES', 'decir')
.setDescription('🗣️ I can say what you want.')
.setDescriptionLocalization('es-ES', '🗣️ Puedo decir lo que quieras.')
.addStringOption(text=> 
  text.setName('text')
  .setNameLocalization('es-ES', 'texto')
  .setDescription('📄 The text to say.')
  .setDescriptionLocalization('es-ES', '📄 El texto para decir.')
  .setMaxLength(600)
  .setRequired(true)
)

export const saySlashCommand = (int: ChatInputCommandInteraction<CacheType>) => {
  const { user, guild, options, locale } = int, isEnglish = locale == 'en-US', author = guild?.members.cache.get(user.id)
  let text = options.getString('text', true)

  if(!author?.permissions.has('Administrator')) text = text.replace(/@/g, '')
  const isAdmin = author?.permissions.has('Administrator')
  const links = text.split(/ +/g).find(f=> ["discord.gg/", "discord.com/invite/", 'http'].some(s=> f.includes(s)))


  if((!isAdmin) && links?.length) return setSlashError(int, (isEnglish ? 
    `The text you provided contains links or invites to servers, I can't say something that contains links or invites.` : 
    `El texto que has proporcionada contiene enlaces o invitaciones a servidores, no puedo decir algo que contenga enlaces o invitaciones.`
  ))

  const SayEb = new EmbedBuilder()
  .setTitle(`${botDB.emoji.loop} `+(isEnglish ? 'Sending message...' : 'Enviando mensaje..'))
  .setColor('Blurple')

  int.reply({ephemeral: true, embeds: [SayEb]}).then(()=> {
    int.channel?.sendTyping()
    setTimeout(()=> {
      int.channel?.send({content: text}).then(async ()=> {
        SayEb.setTitle(`${botDB.emoji.afirmative} `+(isEnglish ? 'Message sent' : 'Mensaje enviado'))
        .setColor('Green')
        await int.editReply({embeds: [SayEb]})
      }).catch(()=> {
        SayEb.setTitle(`${botDB.emoji.negative} `+(isEnglish ? 'An error has occurred' : 'Ha ocurrido un error'))
        .setColor('Red')
      })
    }, 4000)

  })
}