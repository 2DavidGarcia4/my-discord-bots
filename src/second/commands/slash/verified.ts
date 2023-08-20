import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { getVerifiedsData, transformTime } from "../../lib/services"
import { sendMessageSlash, setSlashError, setSlashErrors } from "../../../shared/functions"
import { FrogDb } from "../../data"
import { getSnackData } from "../../lib/notion"
import { type SecondClientData } from "../.."
import { SlashCommand, type SlashInteraction } from "../../.."

const VerifiedScb = new SlashCommandBuilder()
.setName('verified')
.setNameLocalization('es-ES', 'verificada')
.setDescription('✅ Provides information about a verified woman.')
.setDescriptionLocalization('es-ES', '✅ Proporciona información sobre una mujer verificada.')
.addUserOption(verified=>
  verified.setName('user')
  .setNameLocalization('es-ES', 'usuario')  
  .setDescription('👩 Verified user')
  .setDescriptionLocalization('es-ES', '👩 Usuario verificado')
  .setRequired(false)
).toJSON()

export default class VerifiedSlashCommand extends SlashCommand {
  constructor() {
    super({
      struct: VerifiedScb, 
      guildsIds: [FrogDb.serverId]
    })
  }

  async execute(int: SlashInteraction, client: SecondClientData) {
    const { guild, user, options, locale } = int, isEnglish = locale == 'en-US'
    const author = guild?.members.cache.get(user.id)
    const { roles } = await getSnackData()
  
    const userOption = options.getUser('user')
  
    if((!author?.roles.cache.has(roles.verified)) && !userOption) return setSlashError(int, isEnglish ? 
      `You are not verified, provide a verified woman to see her information.` : 
      `No eres verificada, proporciona a una mujer verificada para ver su información.`
    )
  
    const verifiedMember = userOption ? guild?.members.cache.get(userOption.id) : author
  
    if(userOption && setSlashErrors(int, [
      [
        Boolean(!verifiedMember), 
        isEnglish ? `The provided member *(${userOption.username})* is not found on the server` : `El usuario proporcinado *(${userOption.username})* no se encuentra en el servidor`
      ],
      [
        Boolean(!verifiedMember?.roles.cache.has(roles.verified)),
        isEnglish ? `The proposed member *(${userOption.username})* is not a verified member` : `El miembro propocionado *(${userOption.username})* no es un miembro verificado`
      ]
    ])) return 
  
    const VerifiedEb = new EmbedBuilder()
    .setTitle('ℹ️ '+(isEnglish ?
      'Verified information' :
      'Información verificada'
    ))
    
    if(verifiedMember){
      const verifiedsData = await getVerifiedsData(client)
      const verifiedData = verifiedsData?.find(f=> f.id == verifiedMember.id)
  
      if(!verifiedData) return setSlashError(int, isEnglish ? 
        `No verified member data found *(${verifiedMember.user.username})*` : 
        `No se encontraron datos del miembro verificado *(${verifiedMember.user.username})*`
      )
  
      await int.deferReply({ephemeral: true})
  
      VerifiedEb
      .setColor(verifiedMember.displayHexColor || guild?.members.me?.displayHexColor || 'White')
      .setFields(
        {
          name: '📅 '+(isEnglish ? 'Verified at' : 'Verificada en')+':',
          value: `<t:${transformTime(verifiedData.verifiedAt)}:R>`,
          inline: true
        },
        {
          name: '📁 '+(isEnglish ? 'Channel:' : 'Canal')+':', 
          value: verifiedData.channelHidden && !author?.permissions.has('ManageGuild') ? isEnglish ? '*Hidden channel*' : 'Canal oculto' : `<#${verifiedData.channelId}>`, 
          inline: true
        },
        {
          name: '👀 '+(isEnglish ? 'Viewable content' : 'Contenido visible')+':',
          value: verifiedData.contentHidden ? '*❌*' : '✅',
          inline: true
        },
        {
          name: '👁️ '+(isEnglish ? 'Viewable channel' : 'Canal visible')+':',
          value: verifiedData.channelHidden ? '*❌*' : '✅',
          inline: true
        },
      )
      
      if(verifiedMember.id != user.id){
        VerifiedEb
        .setDescription(isEnglish ?
          `Information about ${verifiedMember}` :
          `Información sobre ${verifiedMember}`
        )
  
        if(author?.permissions.has('ManageGuild') && VerifiedEb.data.fields){
          VerifiedEb.data.fields = [
            ...VerifiedEb.data.fields,
            {
              name: '📣 '+(isEnglish ? `Ping available` : `Ping disponible`)+':',
              value: verifiedData.ping ? '✅' : '*❌*',
              inline: true
            },
            {
              name: '🔔 '+(isEnglish ? 'Use of ping' : 'Uso de ping')+':',
              value: verifiedData.pinedAt ? `<t:${transformTime(verifiedData.pinedAt)}:R>` : '*'+(isEnglish ? 'not yet used' : 'aún no utilizado')+'*',
              inline: true
            },
            {
              name: '📢 '+(isEnglish ? 'Last mention' : 'Última mención')+':',
              value: verifiedData.lastMentionAt ? `<t:${transformTime(verifiedData.lastMentionAt)}:R>` : '*'+( isEnglish ? 'no mentions yet' : 'aún sin menciones')+'*',
              inline: true
            },
            {
              name: '🎯 '+(isEnglish ? 'Last activity' : 'Última actividad')+':',
              value: verifiedData.lastActivityAt ? `<t:${transformTime(verifiedData.lastActivityAt)}:R>` : '*'+(isEnglish ? 'without activity' : 'sin actividad')+'*',
              inline: true
            },
          ]
        }
  
      }else if(VerifiedEb.data.fields){
        VerifiedEb.data.fields = [
          ...VerifiedEb.data.fields,
          {
            name: '📣 '+(isEnglish ? `Ping available` : `Ping disponible`)+': '+(verifiedData.ping ? '✅' : '*❌*'),
            value: (isEnglish ? 'Available' : 'Disponible')+` <t:${transformTime(Date.now() + FrogDb.verifiedsCooldown)}:R>`,
            inline: true
          }
        ]
      }
  
    }
  
    sendMessageSlash(int, {embeds: [VerifiedEb]})
  }
}