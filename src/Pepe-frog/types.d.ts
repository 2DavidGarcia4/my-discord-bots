export interface SnackData {
  roles: {
    verified: string
    spamer: string
    content: string
    announcement: string
    verifiedSpeech: string
  }
  channels: {
    logs: string
    ready: string
    stats: string
    suggestions: string
    announcements: string
  }
  categories: {
    verifieds: string
  }
  emojis: {
    
  }
}

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