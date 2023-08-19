import { config } from 'dotenv'
config()

export const tokenBot = process.env.TOKEN_BOT, 
  connectMongo = process.env.CONNECT_MONGO, 
  pepeFrog = process.env.PEPE_FROG, 
  isDevelopment = process.env.DEVELOPMENT,
  notionToken = process.env.NOTION_TOKEN

console.log(`NodeJs version: `+process.version)