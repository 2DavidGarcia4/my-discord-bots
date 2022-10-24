import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ApplicationCommandPermissionType, PermissionsBitField, ChannelType } from "discord.js";
import ms from "ms";
import { estadisticas } from "../../..";
import { botDB } from "../../../db";
import { botModel } from "../../../models";
import { setSlashErrors } from "../../../utils/functions";

export const limpiarScb = new SlashCommandBuilder()
.setName(`limpiar`)
.setDescription(`🗑️ Elimina mensajes de un canal.`)
.addStringOption(cantidad=> cantidad.setName(`cantidad`).setDescription(`🔢 Cantidad de mensajes a eliminar o la palabra todos (elimina un máximo de 400 mensajes).`).setRequired(true))
.addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`🧑 El miembro al que se le eliminaran sus mensajes en el canal.`).setRequired(false))
.addStringOption(autorID=> autorID.setName(`autorid`).setDescription(`🆔 ID del autor de los mensajes a eliminar.`).setRequired(false)).toJSON()

export const limpiarSlashCommand = async (int: ChatInputCommandInteraction<CacheType>, client: Client) => {
  const { Flags: per} = PermissionsBitField, dataBot = await botModel.findById(client.user?.id), author = int.guild?.members.cache.get(int.user.id)
  const { options } = int, { emoji, color } = botDB

  if(!dataBot) return
  
  // await int.deferReply({ephemeral: true})
  estadisticas.comandos++
  let cantidad = int.options.getString('cantidad', true), autorId = int.options.getString('autorid'), id = int.options.getUser("miembro") ? options.getUser("miembro")?.id: false || autorId, canalRegistros = client.channels.cache.get(dataBot.datos.registros.bot)

  if(setSlashErrors(int, [
    [
      ![per.ModerateMembers, per.KickMembers, per.BanMembers].some(s=> author?.permissions.has(s)),
      '¡No eres moderador del servidor!, no puede utilizar el comando.'
    ],
    [
      isNaN(Number(cantidad)) && cantidad != "todos",
      `La cantidad *(${cantidad})* no es valida ya que no es una cantidad numérica ni es la palabra **todos**.`
    ],
    [
      !isNaN(Number(cantidad)) && Number(cantidad) > 400,
      `La cantidad que has proporcionado *(${cantidad})* es mayora a la cantidad máxima de mensajes que puedo eliminar la cual es **400** mensajes.`
    ],
    [
      Boolean(int.options.getUser("miembro")) && Boolean(int.options.getString("autorid")),
      `No proporciones un miembro y una ID de un autor a la vez.`
    ],
    [
      Boolean(autorId && isNaN(Number(autorId))),
      `La ID del autor *(${autorId})* no es valida ya que no es numérica.`
    ],
    [
      Boolean(autorId && autorId.length != 18),
      `La ID del autor *(${autorId})* no es valida ya que no contiene **18** caracteres numéricos contiene menos o mas.`
    ]
  ])) return

  console.log("hello")
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
        }else if(typeof cantidad == 'number') {

          if(cantidad<100 && Math.floor(cantidad/100)-bueltas<0){
            filtro = filtro.splice(0,Math.floor(cantidad%100))
          }
          mensajes+=filtro.length
          let embElimiando = new EmbedBuilder()
          .setTitle(`${emoji.loop} Eliminando mensajes`)
          .setColor('Blue')
          if(bueltas == 1){
            int.reply({ephemeral: true, embeds: [embElimiando]})
          }

          int.channel.bulkDelete(filtro)
          if(mensajes == cantidad || (bueltas > 1 && filtro.length==0)){
            parado = true
            let embLimpiar = new EmbedBuilder()
            .setAuthor({name: author?.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
            .setTitle(`🗑️ Mensajes eliminados`)
            .setColor(int.guild?.members.me?.displayHexColor || 'White')
            .setFooter({text: int.guild?.name || 'undefined', iconURL: int.guild?.iconURL() || undefined})
            .setTimestamp()

            if(mensajes == cantidad){
              embLimpiar
              .setDescription(`Se han eliminado **${mensajes}** mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal.`)
            }else{
              embLimpiar
              .setDescription(`Solo he podido eliminar **${mensajes}** mensajes del ${int.guild?.members.cache.has(id || '') ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal.`)
            }
            const embRegistro = new EmbedBuilder()
            .setAuthor({name: `Comando ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
            .setTitle(`📝 Registro del comando /limpiar`)
            .addFields(
              {name: `📌 **Utilizado en el canal:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
              {name: `👮 **Autor:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
              {name: `🗑️ **Mensajes eliminados:**`, value: `**${mensajes}** de ${usuario}\n**ID:** ${usuario.id}`},
            )
            .setColor('Blue')
            .setFooter({text: usuario.tag, iconURL: usuario.displayAvatarURL()})
            .setTimestamp()
            setTimeout(()=>{
              int.reply({ephemeral: true, embeds: [embLimpiar]})
              if(canalRegistros?.type == ChannelType.GuildText) canalRegistros.send({embeds: [embRegistro]})
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
      .setDescription(`No hay mensajes en este canal para eliminar o los mensajes que hay en este canal superan los **14** días y no puedo eliminar mensajes con ese tiempo.`)
      .setColor(color.negative)

      if(bueltas == 1 && filtro.length==0){
        console.log('Error')
        parado = true
        int.reply({ephemeral: true, embeds: [embError1]})

      }else {
        console.log('numero')
        const amount = Number(cantidad)

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

        await int.channel.bulkDelete(filtro)
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
            .setDescription(`Se han eliminado **${mensajes}** mensajes en este canal.`)
          }else{
            embLimpiar
            .setDescription(`Solo he podido eliminar **${mensajes}** mensajes de los **${cantidad}** que me pediste en este canal.`)
          }
          const embRegistro = new EmbedBuilder()
          .setAuthor({name: `Comando ejecutado por ${int.user.tag}`, iconURL: int.user.displayAvatarURL()})
          .setTitle(`📝 Registro del comando /limpiar`)
          .addFields(
            {name: `📌 **Utilizado en el canal:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
            {name: `👮 **Autor:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
            {name: `🗑️ **Mensajes eliminados:**`, value: `**${mensajes}**`},
          )
          .setColor('Blue')
          .setTimestamp()
          setTimeout(()=>{
            int.reply({embeds: [embLimpiar]})
            if(canalRegistros?.type == ChannelType.GuildText) canalRegistros.send({embeds: [embRegistro]})
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