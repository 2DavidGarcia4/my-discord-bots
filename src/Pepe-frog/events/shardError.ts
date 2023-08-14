import { EventName } from "../../globals";

export const name: EventName = 'shardError'

export async function execute(error: Error, shardId: number) {
  console.error('Error: '+shardId, error.message)
  console.error(error)
}