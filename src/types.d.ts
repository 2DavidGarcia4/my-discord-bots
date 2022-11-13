import { ColorResolvable } from "discord.js"

export type BotDB = {
  prefix: string
  serverId: string
  creatorId: string
  owners: string[]
  mainRoles: string[]
  levelRoles: string[]
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
    rightArrow: string
    ping30ms: string
    ping60ms: string
    ping100ms: string
    instagram: string
    invitation: string
    afirmative: string
    information: string
    animateBoost: string
  }
  color: {
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
  suggestions: string,
  alliances: string
}

export type DataBot = {
  _id: string
  logs: BotLogs
  autoModeration: {
    ignoreCategories: string[]
    ignoreChannels: string[]
  }
}