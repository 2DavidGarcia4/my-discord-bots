import { ChannelType, Client, EmbedBuilder, Message } from "discord.js";
import { botDB } from "../../db";
import { sendMessageText, setError, setErrors } from "../../../utils/functions";

export const addReactionCommand = async (msg: Message<boolean>, client: Client, args: string[]) => {
  const { prefix } = botDB
  if(!msg.member?.permissions.has('Administrator')) return setError(msg, `No eres administrador en el servidor por lo tanto no puedes ejecutar el comando.`)
  let emojis = msg.guild?.emojis.cache.map(e=>e)
  if(!emojis) return

  const embInfo = new EmbedBuilder()
  .setTitle("Comando addreaction")
  .addFields(
    {name: `**Uso:**`, value: `\`\`${prefix}addr <ID del mensaje> <nombre del emoji o ID del emoji>\`\`\n\`\`${prefix}addr <Mencion del canal o ID> <ID del menseje> <nombre del emoji o ID>\`\``},
    {name: `**Ejemplos:**`, value: `${prefix}addr ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].name}\n${prefix}addr ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].id}\n${prefix}addr ${msg.channel} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].name}\n${prefix}addr ${msg.channel} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].id}\n${prefix}addr ${msg.channel.id} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].name}\n${prefix}addr ${msg.channel.id} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].id}\n`}
  )
  .setColor("#060606")
  .setFooter({text: "Agrega una reaccion con el emoji que quieras a un mensaje por medio del bot.", iconURL: client.user?.displayAvatarURL()})
  .setTimestamp()
  if(!args[0]) return setTimeout(()=>{
    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
  }, 500)  

  const canal = msg.mentions.channels.first() || msg.guild?.channels.cache.get(args[0])
  const embAddReact = new EmbedBuilder()
  .setAuthor({name: msg.member?.nickname ? msg.member.nickname: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
  .setTitle(`${botDB.emoji.afirmative} Reacción agregada al mensaje`)
  .setColor(msg.guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()
  if(canal && canal.type == ChannelType.GuildText){
    if(isNaN(Number(args[1]))) return setError(msg, `El argumento proporcionado no puede ser una ID de un mensaje avalida por que no es numérico.`)

    await canal.messages.fetch(args[1]).then(mensage =>{
      let emoji = msg.guild?.emojis.cache.find(f=> f.name === args[2] || f.id === args[2])
      if(!emoji) return setError(msg, `No pude encontrar al emoji, asegúrate de proporcionar el nombre o su ID correctamente.`)

      embAddReact
      .setDescription(`He agregado la reaccion con el emoji ${emoji} al [mensaje](${mensage.url}) con la ID ${args[1]} que esta en el canal ${canal}`)

      mensage.react(emoji).then(()=> sendMessageText(msg, {embeds: [embAddReact]}))

    }).catch(c=>{
      setError(msg, `No encontré el mensaje, asegúrate de proporcionar bien la ID del mensaje.`)
    })

  }else(
    await msg.channel.messages.fetch(args[0]).then(onliMSG=>{
      let emoji = msg.guild?.emojis.cache.find(f=> f.name == args[1] || f.id == args[1])
      if(!emoji) return setError(msg, `No pude encontrar al emoji, asegúrate de proporcionar el nombre o su ID correctamente.`)

      embAddReact
      .setDescription(`He agregado la reaccion con el emoji ${emoji} al [mensaje](${onliMSG.url}) con la ID ${args[0]} en este canal`)

      onliMSG.react(emoji).then(()=> sendMessageText(msg, {embeds: [embAddReact]}))

    }).catch(()=>{
      setError(msg, `No encontré el mensaje, asegúrate de proporcionar bien la ID del mensaje.`)
    })
  )
}