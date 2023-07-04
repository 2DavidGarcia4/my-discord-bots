export interface ModDb {
  id: string
  warns: number
  message: string
  messages: {
    id: string
    content: string
    channelId: string
  }[]
}

export interface VerifiedsData {
  id: string
  ping: boolean
  pinedAt?: number
  channelId: string
  verifiedAt: number
  lastMentionAt?: number
  contentHidden: boolean
  channelHidden: boolean
  lastActivityAt?: number
}