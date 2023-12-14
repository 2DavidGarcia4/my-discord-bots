import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, EmbedBuilder } from 'discord.js'
import { inDevelopment } from '../config'
import { getInfoMessage } from './lib/services'
import { type SecondClientData } from '.'

export const FrogDb = {
  id: '1139577382068551721',  
  serverIconUrl: '',
  prefix: inDevelopment ? 'f!' : 's!',
  serverId: '1139574510790639618',
  maxMBs: 25,
  joins: 0,
  leaves: 0,
  owners: ['853063286320922634', '551146834941313026', '717420870267830382', '853000435098320907'],
  backupServerId: '1139614790780715108',
  publishingServerId: '1139617789603221676',
  verifiedsCooldown: 10*24*60*60000,
  emojisIds: {
    more: '1140123888307679262',
    like: '1140139044928491612',
    dislike: '1140138914569523250',
    beatingHeart: '1140140170516111442',
    hearts: '1140140262073565274',
    veryHot: '1140140336484732928'
  },
  roles: {
    man: '1139581607548833854',
    oter: '1139581608798728273',
    woman: '1139581606420553769',
    muted: '1139702474723295272',
    withe: '1139581592591945868',
    survey: '1139581589790130246',
    verified: '1139581585985912832',
    spamer: '1139581612422594642',
    content: '1139581590696103966',
    announcement: '1139581588712210564',
    verifiedSpeech: '1139581591581110282'
  },
  channels: {
    logs: '1139600309786775662',
    ready: '1139638163778850857',
    stats: '1139600276572090518',
    verifiedLogs: '1139599996770074785',
    suggestions: '1139599870794154025',
    announcements: '1139620138216333315',
    exclusive: '1139599877442121858'
  },
  categories: { 
    verifieds: '1139599818931585184',
    vipNsfw: '1139599819942400010'
  },
  invitationCodes: [
    'teenvids',
    'AeSaX5rStE',
    'tiktokhomes',
    'sexyhouse',
    'xxxass',
    'leaksforu',
    'reelshot',
    'nudesex',
    'tiktoknsfw',
    'xxxhot',
    'givemenudes',
    'sexxxx'
  ]
}

export const TIMEOUT_SANCTIONS = [
  {
    time: 2*60*60*1000,
    warns: 2 
  },
  {
    time: 4*60*60*1000,
    warns: 3 
  },
  {
    time: 8*60*60*1000,
    warns: 4 
  },
] as const

export const FILE_EXTENSIONS: readonly string[] = ['png', 'jpg', 'gif', 'jpeg', 'mov', 'mp4', 'mp3']

interface ButtonInfoInteraction {
  id: string,
  channelId: string,
  title: string,
  run: (int: ButtonInteraction<CacheType>, client: SecondClientData) => Promise<void>
  buttons?: ButtonBuilder[] 
}

async function run(this: ButtonInfoInteraction, int: ButtonInteraction<CacheType>, client: SecondClientData) {
  const description = await getInfoMessage({
    client,
    channelId: this.channelId,
    language: 'en'
  })+''

  const RulesEb = new EmbedBuilder({title: this.title, description})
  .setColor(int.message.member?.displayHexColor || 'White')

  let buttons: ActionRowBuilder<ButtonBuilder> | undefined

  if(this.buttons){
    buttons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      ...this.buttons
    )
  }

  int.reply({ephemeral: true, embeds: [RulesEb], components: buttons ? [buttons] : []})
}

export const buttonInfoInteractions = [
  {
    id: 'en-rules-btn',
    channelId: '1139620584750334052',
    title: '📖 Rules',
    run
  },
  {
    id: 'en-verifieds-btn',
    channelId: '1139620168998326362',
    title: `<a:info_animate:1052698007562375219> Information`,
    run,
    buttons: [
      new ButtonBuilder()
      .setCustomId('verifieds-btn')
      .setLabel('Verifieds')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success)
    ]
  },
  {
    id: 'en-vip-btn',
    channelId: '1139620277488189551',
    title: `⭐ VIP access`,
    run,
    buttons: [
      new ButtonBuilder()
      .setCustomId('vip-btn')
      .setLabel('Channels preview')
      .setEmoji('👁️')
      .setStyle(ButtonStyle.Secondary)
    ]
  }
]