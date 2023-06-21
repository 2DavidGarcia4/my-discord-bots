import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Client, EmbedBuilder } from "discord.js";
import { isDevelopment } from "../config";
import { getInfoMessage } from "./utils/functions";

export const frogDb = {
  prefix: isDevelopment ? 'f!' : 's!',
  serverId: '1053382837857943662',
  principalServerId: '1028793496674500659',
  joins: 0,
  verifiedsCooldown: 10*24*60*60000,
  leaves: 0,
  roles: {
    verified: '1057720387464593478',
    verifiedSpeech: '1083060304054849676'
  },
  owners: ['853063286320922634', '551146834941313026', '717420870267830382', '853000435098320907']
}

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