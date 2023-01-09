export type ModDb = {
  id: string
  warns: number
  message: string
  messages: {
    id: string
    content: string
    channelId: string
  }[]
}