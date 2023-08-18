import { type EventName } from '../..'

export const name: EventName = 'shardError'

export async function execute(error: Error, shardId: number) {
  console.error('Error: '+shardId, error.message)
  console.error(error)
}