import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ChannelType, PermissionFlagsBits, bold } from "discord.js";
import ms from "ms";
import { botDB } from "../../../db";
import { setSlashErrors } from "../../../../shared/functions";
import { getBotData } from "../../../utils";

export const limpiarScb = new SlashCommandBuilder()
.setName(`sweep`)
.setNameLocalization('es-ES', 'barrer')
.setDescription(`🧹 Delete messages of the channel.`)
.setDescriptionLocalization('es-ES', `🧹 Elimina mensajes del canal.`)
.addStringOption(amount=> 
  amount.setName(`amount`)
  .setNameLocalization('es-ES', 'cantidad')
  .setDescription(`🔢 Number of messages to delete or the word 'all' (deletes up to 400 messages).`)
  .setDescriptionLocalization('es-ES', `🔢 Cantidad de mensajes a eliminar o la palabra 'todos' (elimina un máximo de 400 mensajes).`)
  .setRequired(true)
)
.addUserOption(member=> 
  member.setName(`member`)
  .setNameLocalization('es-ES', 'miembro')
  .setDescription(`🧑 The member whose messages will be deleted in the channel.`)
  .setDescriptionLocalization('es-ES', `🧑 El miembro al que se le eliminaran sus mensajes en el canal.`)
  .setRequired(false)
)
.addStringOption(id=> 
  id.setName(`id`)
  .setDescription(`🆔 ID of the author of the messages to be deleted.`)
  .setDescriptionLocalization('es-ES', `🆔 ID del autor de los mensajes a eliminar.`)
  .setRequired(false)
)
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.toJSON()

export const limpiarSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { user, guild, options, locale } = int, { emoji, color } = botDB, isEnglish = locale == 'en-US'
  const author = guild?.members.cache.get(user.id)
  const amount = options.getString('amount', true), member = options.getUser('member'), id = options.getString("id") || member?.id 


  if(setSlashErrors(int, [
    [
      Boolean(isNaN(Number(amount)) && (!['todos', 'all'].some(s=> s==amount))),
      (isEnglish ? `The amount you provided *(${amount})* is not valid as it is not a numeric amount nor is it the word **all**.` : `La cantidad que has proporcionado *(${amount})* no es valida ya que no es una cantidad numérica ni es la palabra **todos**.`)
    ],
    [
      Boolean(Number(amount) > 400),
      (isEnglish ? `The amount you have provided *(${amount})* is greater than the maximum amount of messages I can delete which is **400** messages.` : `La cantidad que has proporcionado *(${amount})* es mayora a la cantidad máxima de mensajes que puedo eliminar la cual es **400** mensajes.`)
    ],
    [
      Boolean(member && options.getString("id")),
      (isEnglish ? `Do not provide a member and an author ID at the same time.` : `No proporciones un miembro y una ID de un autor a la vez.`)
    ],
    [
      Boolean(id && isNaN(Number(id))),
      (isEnglish ? `The author ID *(${id})* is not valid since it is not numeric.` : `La ID del autor *(${id})* no es valida ya que no es numérica.`)
    ]
  ])) return


  if(id){
    console.log('id')
    await client.users.fetch(id, {force: true}).then(async usuario=> {
      let bueltas = 0, mensajes = 0, parado = false
      async function clearMessages(){
        if(int.channel?.type != ChannelType.GuildText) return
        bueltas++
        let filtro = (await int.channel?.messages.fetch({limit: 100}))?.filter(f=> f.author.id == id && Date.now() - f.createdTimestamp < ms("14d")).map(m=>m)
        // console.log(filtro.length)
        const embError1 = new EmbedBuilder()
        .setTitle(`${emoji.negative} Error`)
        .setDescription(`No hay mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal para eliminar, no hay ningún mensaje de ese autor en los **100** últimos mensajes o los mensajes que hay de ese autor superan los 14 días y no puedo eliminar mensajes con ese tiempo.`)
        .setColor(color.negative)

        if(bueltas == 1 && filtro.length==0){
          parado = true
          int.reply({ephemeral: true, embeds: [embError1]})
        }else if(typeof amount == 'number') {

          if(amount<100 && Math.floor(amount/100)-bueltas<0){
            filtro = filtro.splice(0,Math.floor(amount%100))
          }
          mensajes+=filtro.length
          let embElimiando = new EmbedBuilder()
          .setTitle(`${emoji.loop} Eliminando mensajes`)
          .setColor('Blue')
          if(bueltas == 1){
            int.reply({ephemeral: true, embeds: [embElimiando]})
          }

          int.channel.bulkDelete(filtro)
          if(mensajes == amount || (bueltas > 1 && filtro.length==0)){
            parado = true
            let embLimpiar = new EmbedBuilder()
            .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
            .setTitle(`🗑️ Mensajes eliminados`)
            .setColor(int.guild?.members.me?.displayHexColor || 'White')
            .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
            .setTimestamp()

            if(mensajes == amount){
              embLimpiar
              .setDescription(`Se han eliminado **${mensajes}** mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal.`)
            }else{
              embLimpiar
              .setDescription(`Solo he podido eliminar **${mensajes}** mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal.`)
            }
            
            setTimeout(()=>{
              int.reply({ephemeral: true, embeds: [embLimpiar]})
            }, mensajes*100)
          }
        }
      }

      clearMessages()
      let intervalo = setInterval(async ()=>{
        if(parado){
          clearInterval(intervalo)
        }else{
          clearMessages()
        }
      }, 2000)
    }).catch(c=>{
      const embErrorNoEncontrado = new EmbedBuilder()
      .setTitle(`${emoji.negative} Error`)
      .setDescription(`No pude encontrar al usuario, ID del autor invalida.`)
      .setColor(color.negative)
      int.reply({ephemeral: true, embeds: [embErrorNoEncontrado]})
    })

  }else{
    console.log('else id')
    let bueltas = 0, mensajes = 0, parado = false

    async function clearMessages(){
      console.log('función')
      if(int.channel?.type != ChannelType.GuildText) return
      bueltas++
      // ;(await int.channel.messages.fetch({limit: 10})).forEach(msg=> console.log(msg.createdAt, msg.createdTimestamp))
      let filtro = (await int.channel?.messages.fetch({limit: 100})).filter(f=> Date.now() - f.createdTimestamp < ms("14d")).map(m=>m)
      console.log(filtro.length)

      const embError1 = new EmbedBuilder()
      .setTitle(`${emoji.negative} Error`)
      .setDescription(`No hay mensajes en este canal para eliminar o los mensajes que hay superan los **14** días y no puedo eliminar mensajes con ese tiempo.`)
      .setColor(color.negative)

      if(bueltas == 1 && filtro.length==0){
        console.log('Error')
        parado = true
        int.reply({ephemeral: true, embeds: [embError1]})

      }else {
        console.log('numero')
        const amountN = Number(amount)

        if(amountN<100 && Math.floor(amountN/100)-bueltas<0){
          filtro = filtro.splice(0,Math.floor(amountN%100))
        }

        mensajes+=filtro.length
        let embElimiando = new EmbedBuilder()
        .setTitle(`${emoji.loop} Eliminando mensajes`)
        .setColor('Blue')
        if(bueltas == 1){
          int.reply({ephemeral: true, embeds: [embElimiando]})
        }

        await int.channel.bulkDelete(filtro)
        if(mensajes == amountN || (bueltas > 1 && filtro.length==0)){
          parado = true
          let embLimpiar = new EmbedBuilder()
          .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
          .setTitle(`🗑️ Mensajes eliminados`)
          .setColor(int.guild?.members.me?.displayHexColor || 'White')
          .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
          .setTimestamp()
          if(mensajes == amountN){
            embLimpiar
            .setDescription(`Se han eliminado **${mensajes}** mensajes en este canal.`)
          }else{
            embLimpiar
            .setDescription(`Solo he podido eliminar **${mensajes}** mensajes de los **${amount}** que me pediste en este canal.`)
          }
          
          setTimeout(()=>{
            int.reply({embeds: [embLimpiar]})
          }, mensajes*100)
        }
      }
    }

    clearMessages()
    let intervalo = setInterval(async ()=>{
      if(parado){
        clearInterval(intervalo)
      }else{
        clearMessages()
      }
    }, 2000)
  }
}