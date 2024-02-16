import { ChannelType, Message } from 'discord.js'
import { type SecondClientData } from '..'
import { inDevelopment } from '../../config'
import { TYPES_CONTENT_IGNORE } from '../../config'

const martineChannel = '1139600091829776498'
const martineCategories = [
  '949861762902138941',
  '1141400243645190304',
  '1207834923734663188',
  '1207834958287208458',
  '1207841886123991080'
]
const autoContentServerId = '949861760096145438'

export async function ManageAutomaticContent(msg: Message<boolean>, client: SecondClientData) {
  if(inDevelopment !== undefined || !TYPES_CONTENT_IGNORE) return
  const { channelId, content } = msg
  if(channelId !== martineChannel) return

  const splitContent = content.replaceAll('`', '').split('\n')
  const categoryName = splitContent.find(f=> f.toLowerCase().includes('category:'))?.split(/ +/g).at(-1)?.toLowerCase()
  const fileUrl = splitContent.find(f=> f.toLowerCase().includes('image:'))?.split(/ +/g).pop()
  // console.log({categoryName, fileUrl})

  if(!(categoryName && fileUrl) || TYPES_CONTENT_IGNORE.split(/ +/g).some(s => s === categoryName)) return

  const autoContentServer = client.getGuildById(autoContentServerId)

  if(fileUrl.slice(fileUrl.length-7, fileUrl.length).includes('.')) {
    const response = await fetch(fileUrl)

    if(response.status !== 200) return
    
    const contentType = response.headers.get('content-type')

    if (contentType === null) {
      console.log(`El archivo no tiene content-type header | URL: ${fileUrl}`)
      return
    }
    
    const channelName = `${categoryName}-${contentType.split('/')[0]}`
    const channel = autoContentServer?.channels.cache.find(f => f.name === channelName) ?? await autoContentServer?.channels.create({
      name: channelName, 
      parent: martineCategories.find(c => autoContentServer.channels.cache.filter(f => c === f.parentId).size < 50), 
      nsfw: true
    })
    
    if (channel?.type !== ChannelType.GuildText) return

    const contentLength = response.headers.get('content-length')
    const mbSize = 1_048_576
    const fileExtension = contentType.split('/').at(-1)
    let MBs = 0 

    if (contentLength === null) {
      const imageBufer = await response.arrayBuffer()

      const buffer = Buffer.from(imageBufer)
      MBs = buffer.length / mbSize

    } else {
      MBs = parseInt(contentLength) / mbSize
    }

    //* 25MB max
    if(MBs > 24) return channel.send({content: `[**File url**](${fileUrl}) **${contentType}** | **${MBs.toFixed(2)} MB**`})

    const fileNumber = (parseInt(channel.topic?.match(/\d+/g)?.[0] || '0'))+1
    
    channel.send({
      content: `**file${fileNumber}.${fileExtension}** | **${MBs.toFixed(2)} MB**`,
      files: [{attachment: fileUrl, name: `file${fileNumber}.${fileExtension}`}]
    }).then(()=> {
      channel.edit({topic: fileNumber+''})
    }).catch(e=> console.error('Error in send file: ', e))

  } else {
    const defaultChannel = autoContentServer?.channels.cache.find(f => f.name === categoryName) ?? await autoContentServer?.channels.create({
      name: categoryName, 
      parent: martineCategories.find(c => autoContentServer.channels.cache.filter(f => c === f.parentId).size < 50), 
      nsfw: true
    })

    if (defaultChannel?.type === ChannelType.GuildText){
      defaultChannel.send({content: `[**File url**](${fileUrl})`})
    }
  }
}
