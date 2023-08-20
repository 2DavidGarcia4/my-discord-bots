import { config } from 'dotenv'
config()

export const connectMongo = process.env.CONNECT_MONGO, firstToken = process.env.FIRST_BOT_TOKEN, 
secondToken = process.env.SECOND_BOT_TOKEN, 
notionToken = process.env.NOTION_TOKEN,
inDevelopment = process.env.DEVELOPMENT