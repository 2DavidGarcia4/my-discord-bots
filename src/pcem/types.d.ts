import { ColorResolvable } from "discord.js"

export type BotDB = {
  prefix: string
  serverId: string
  creatorId: string
  serverInvite: string
  owners: string[]
  mainRoles: string[]
  usedCommands: number
  botInvite: string
  emoji: {
    cat: string
    like: string
    loop: string
    exit: string
    staff: string
    money: string
    ticket: string
    status:string
    twitch: string
    twitter: string
    dislike: string
    discord: string
    youTube: string
    warning: string
    confetti: string
    tickTock: string
    negative: string
    leftArrow: string
    ping30ms: string
    ping60ms: string
    addition: string
    ping100ms: string
    instagram: string
    rightArrow: string
    invitation: string
    afirmative: string
    textChannel: string
    subtraction: string
    information: string
    animateBoost: string
  }
  color: {
    bot: ColorResolvable
    blue: ColorResolvable
    afirmative: ColorResolvable
    negative: ColorResolvable
    yellow: ColorResolvable
  }
}

export type MembersPrl = {
  id: string;
  tag: string;
  tiempo: number | null
  notificado: boolean;
}[] | undefined

export type BotLogs = {
  bot: string
  ban: string
  unban: string
  exit: string
  entry: string
  errors: string
  connections: string
  welcome: string
  moderation: string
  staff: string
  guildDelete: string
  guildCreate: string
  suggestions: string
  alliances: string
  deleteMessages: string
  editedMessages: string
  alliancesChannel: string
}

export type DataBot = {
  logs: BotLogs
  autoModeration: {
    ignoreCategories: string[]
    ignoreChannels: string[]
  }
  color: {
    bot: ColorResolvable
  }
}

export type DictionaryMenu = {
  value: string 
  rol: string
  status: string
}