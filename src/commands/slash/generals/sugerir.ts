import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { botDB } from "../../../db";
import { suggestionsModel } from "../../../models";
import { sendMessageSlash, setSlashError } from "../../../utils/functions";
import { coolSugerencias, addUserIdCoolSug, estadisticas } from "../../..";

export const sugerirScb = new SlashCommandBuilder()
.setName("sugerir")
.setDescription(`✉️ Has una sugerencia para el servidor.`)
.addStringOption(suggestion=>
  suggestion.setName("sugerencia")
  .setDescription(`📝 Escribe tu sugerencia.`)
  .setRequired(true)
).toJSON()


export const sugerirSlashCommand = async (int: ChatInputCommandInteraction<CacheType>) => {
  const { user, options } = int, { emoji, serverId } = botDB
  
  estadisticas.comandos++
  if(coolSugerencias.some(s=> s == int.user.id)) setSlashError(int, `Espera **10** minutos para volver a usar el comando.` )

  const dataSug = await suggestionsModel.findById(serverId), arrayMsgsSug = dataSug?.mensajes,  suggestion = options.getString('sugerencia', true)

  arrayMsgsSug?.push({id: "", origenID: "", autorID: user.id, sugerencia: suggestion, estado: "normal", positivas: 0, negativas: 0})

  const SuggestionEb = new EmbedBuilder()
  .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL()})
  .setTitle(`${emoji.negative} ¿Estas seguro de enviar esa sugerencia?`)
  .addFields(
    {name: `📃 **Tu sugerencia:**`, value: `${suggestion}`}
  )
  .setColor('Yellow')

  await int.deferReply({ephemeral: true})

  const SuggestionBtns = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    [
      new ButtonBuilder()
      .setCustomId("confirmar")
      .setEmoji(emoji.afirmative)
      .setLabel("Confirmar")
      .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
      .setCustomId("cancelar")
      .setEmoji(emoji.negative)
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Danger)
    ]
  )

  sendMessageSlash(int, {embeds: [SuggestionEb], components: [SuggestionBtns]})

  await suggestionsModel.findByIdAndUpdate(serverId, {mensajes: arrayMsgsSug})

  addUserIdCoolSug(user.id)
  setTimeout(()=>{
    for(let i=0; i<coolSugerencias.length; i++){
      if(coolSugerencias[i] == int.user.id){
        coolSugerencias.splice(i,1)
      }
    }
  }, 10*60000)  
}