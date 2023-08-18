import { Message, EmbedBuilder, Client, ChannelType, CacheType, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild } from "discord.js"
import { botDB } from "../db"
import { DataBot, GuildsData, UsersData } from "../types"
import { sendMessageSlash } from "../../shared/functions"

const { color } = botDB

export const moderationSanction = (msg: Message<boolean>, autoModMember: {memberId: string, warnings: number}) => {
  if(autoModMember.warnings >= 2){
    const embAdvertenciaMD = new EmbedBuilder()
    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
    .setTitle(`🔗 Auto moderación de enlaces`)
    .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
    .setColor(color.negative)
    msg.author.send({embeds: [embAdvertenciaMD]}).catch(()=> '')
  }

  let timeoutText = `By auto moderation of links, the member has sent ${autoModMember.warnings} links in channels which is not allowed.`

  if(autoModMember.warnings == 3){
    msg.member?.timeout(4*60*60000, timeoutText)
  }
  if(autoModMember.warnings == 4){
    msg.member?.timeout(8*60*60000, timeoutText)
  }
  if(autoModMember.warnings == 5){
    msg.member?.timeout(10*60*60000, timeoutText)
  }
  if(autoModMember.warnings == 6){
    msg.member?.kick(timeoutText)
  }
  if(autoModMember.warnings == 7){
    msg.member?.ban({reason: timeoutText})
  }
}

export const fetchServerRules = async (client: Client) => {
  const rulesChannel = client.channels.cache.get('1073819301661913219')
  if(rulesChannel?.type == ChannelType.GuildText) return (await rulesChannel.messages.fetch('1073819326420897922')).content
}

export const getBotData = async (client: Client): Promise<DataBot | undefined> => {
  const channelDb = client.channels.cache.get('1075494668386705428')
  if(channelDb?.isTextBased()) {
    const message = (await channelDb.messages.fetch('1075494740595847289')).content
    const data = eval(message)
    return data
  }
  return undefined
}

export const interactiveList = async (int: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType>, list: string[], title: string, description: string, color: ColorResolvable)  => {
  const isEnglish = int.locale == 'en-US'
  await int.deferReply()

  list = list.map((el, i)=> `${i+1}. ${el}`)
  
  let allPages = 0
  if(list && String(list.length).slice(-1) == '0'){
    allPages = Math.floor(list.length / 10)
  }else{
    allPages = Math.floor(list.length / 10 + 1)
  }

  let start = 0, end = 10, page = 1
  
  const ListEb = new EmbedBuilder({title})
  .setColor(color)
  .setTimestamp()

  if((list?.length || 0) <= 10){
    ListEb
    .setDescription(description+list.join('\n'))
    .setFooter({text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}` , iconURL: int.guild?.iconURL() || undefined})
    sendMessageSlash(int, {embeds: [ListEb]})
  }else{
    ListEb
    .setDescription(description+list.slice(start, end).join("\n"))
    .setFooter({text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}` , iconURL: int.guild?.iconURL() || undefined})

    const ListButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      [
        new ButtonBuilder()
        .setCustomId('previous')
        .setLabel("Anterior")
        .setEmoji(botDB.emoji.leftArrow)
        .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
        .setCustomId('next')
        .setLabel("Siguiente")
        .setEmoji(botDB.emoji.rightArrow)
        .setStyle(ButtonStyle.Primary)
      ]
    ).toJSON()
        
    setTimeout(async ()=>{
      const alliansesMessage = await int.editReply({embeds: [ListEb], components: [ListButtons]})
      const alliancesCollection = alliansesMessage.createMessageComponentCollector({time: allPages*60000})
      
      alliancesCollection.on('collect', async btn => {
        if (btn.customId == 'previous') {
          if (end - 10 <= 10) {
            ListButtons.components[0].style = ButtonStyle.Secondary
            ListButtons.components[0].disabled = true
            ListButtons.components[1].disabled = false
            ListButtons.components[1].style = ButtonStyle.Primary
            
          } else {
            ListButtons.components[0].style = ButtonStyle.Primary
            ListButtons.components[0].disabled = false
            ListButtons.components[1].disabled = false
            ListButtons.components[1].style = ButtonStyle.Primary
          }
          start -= 10, end -= 10, page--

          ListEb
          .setDescription(description + list.slice(start, end).join('\n'))
          .setFooter({text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
          await btn.update({ embeds: [ListEb], components: [ListButtons] })
        }

        if(btn.customId == 'next') {
          if(end + 10 >= list.length){
            ListButtons.components[0].disabled = false
            ListButtons.components[0].style = ButtonStyle.Primary
            ListButtons.components[1].style = ButtonStyle.Secondary
            ListButtons.components[1].disabled = true

          }else{
            ListButtons.components[0].style = ButtonStyle.Primary
            ListButtons.components[0].disabled = false
            ListButtons.components[1].disabled = false
            ListButtons.components[1].style = ButtonStyle.Primary
          }
          start += 10, end += 10, page++

          ListEb
          .setDescription(description + list.slice(start, end).join('\n'))
          .setFooter({text: `${isEnglish ? 'Page' : 'Pagina'} ${page}/${allPages}`, iconURL: int.guild?.iconURL() || undefined})
          await btn.update({ embeds: [ListEb], components: [ListButtons] })
        }
      })

      alliancesCollection.on("end", () => {
        int.editReply({embeds: [ListEb], components: []})
      })
    }, 600)
  }
}

//? Guilds data
const guildsChannelId = '1081285638923489362', guidlsMessageId = '1081289925074370602'
export const getGuildsData = async (client: Client): Promise<GuildsData[] | undefined> => {
  const channelDb = client.channels.cache.get(guildsChannelId)
  if(channelDb?.isTextBased()) {
    const message = (await channelDb.messages.fetch(guidlsMessageId)).content
    const data = JSON.parse(message)
    return data
  }
}

export const updateGuildsData = async (client: Client, newData: GuildsData[]) => {
  const channelDb = client.channels.cache.get(guildsChannelId)
  if(channelDb?.isTextBased()) {
    const newDataStr = JSON.stringify(newData)
    const message = await channelDb.messages.fetch(guidlsMessageId)
    if(newDataStr != message.content) message.edit({content: JSON.stringify(newData)})
  }
}

export const getEmbedColor = (guild: Guild | null): ColorResolvable => {
  const guildData = botDB.guilds.find(f=> f.guildId == guild?.id)
  return guildData ? (guildData.autoColor ? (guild?.members.me?.displayHexColor || 'White') : botDB.color.bot) : botDB.color.bot 
}

export const getGuildPrefix = (guild: Guild | null) => {
  const guildData = botDB.guilds.find(f=> f.guildId == guild?.id)
  return  guildData?.prefix || botDB.prefix
}

//? Users data
const usersChanneId = '1081326241069670462', usersMessageId = '1081327317130940457'
export const getUsersData = async (client: Client): Promise<UsersData[] | undefined> => {
  const channelDb = client.channels.cache.get(usersChanneId)
  if(channelDb?.isTextBased()) {
    const message = (await channelDb.messages.fetch(usersMessageId)).content
    const data = JSON.parse(message)
    return data
  }
}

export const updateUsersData = async (client: Client, newData: UsersData[]) => {
  const channelDb = client.channels.cache.get(usersChanneId)
  if(channelDb?.isTextBased()) {
    const newDataStr = JSON.stringify(newData)
    const message = await channelDb.messages.fetch(usersMessageId)
    if(newDataStr != message.content) message.edit({content: JSON.stringify(newData)})
  }
}