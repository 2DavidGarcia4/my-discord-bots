import { Client } from "@notionhq/client"
import { notionToken } from "../../config"
import type { SnackData } from "../types"

const NotionClient = new Client({auth: notionToken})
const snackDbId = '722ba61dd6f34f13b7c057e3fe27186b'

let snackDataMock: SnackData
let saveTime: number = 0

export async function getSnackData(): Promise<SnackData> {
  const nowTime = Date.now()
  
  if(saveTime+(10*60*60000) < nowTime){
    const { results } = await NotionClient.databases.query({
      database_id: snackDbId,
      filter: {
        property: 'type',
        select: {
          equals: 'snack_hot'
        }
      }
    })
  
    const firstResult = results.map((m: any)=> m.properties.data)[0]
    let text: string = firstResult.rich_text[0].plain_text
    text = text.split(/ +/g).join('').replaceAll('\n', '').replaceAll('{', '{"').replaceAll('}', '"}')
    .replaceAll(':', '":"').replaceAll(',', '","').replaceAll('}",', '},').replaceAll(':"{', ':{').replaceAll('}"}', '}}')

    snackDataMock = JSON.parse(text)
  }

  return snackDataMock
}