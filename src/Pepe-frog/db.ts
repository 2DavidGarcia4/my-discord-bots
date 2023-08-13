import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Client, EmbedBuilder } from "discord.js";
import { isDevelopment } from "../config";
import { getInfoMessage } from "./lib/services";

export const FrogDb = {
  id: '1139577382068551721',  
  serverIconUrl: '',
  prefix: isDevelopment ? 'f!' : 's!',
  serverId: '1139574510790639618',
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
  }
}

export const SANCTIONS = [
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
  run: (int: ButtonInteraction<CacheType>, client: Client<boolean>) => Promise<void>
  buttons?: ButtonBuilder[] 
}

async function run(this: ButtonInfoInteraction, int: ButtonInteraction<CacheType>, client: Client<boolean>) {
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
    channelId: '1090736733047492638',
    title: '📖 Rules',
    run
  },
  {
    id: 'en-verifieds-btn',
    channelId: '1053399734582263938',
    title: `<a:animate_info:1058179015938158592> Information`,
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
    channelId: '1114225130395140136',
    title: `⭐ VIP access`,
    run,
    buttons: [
      new ButtonBuilder()
      .setCustomId('vip-btn')
      .setLabel('Channels preview')
      .setEmoji('👁️')
      .setStyle(ButtonStyle.Secondary)
    ]
  },
  {
    id: 'en-packs-btn',
    channelId: '1120917353862017134',
    title: `📁 Packs access`,
    run,
    buttons: [
      new ButtonBuilder()
      .setCustomId('packs-btn')
      .setLabel('Channels preview')
      .setEmoji('👁️')
      .setStyle(ButtonStyle.Secondary)
    ]
  },
]