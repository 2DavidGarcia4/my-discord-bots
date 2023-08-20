import { botDB } from "./data"
import { firstToken } from "../config"
import { BotClient } from "../shared/classes"

class FirstClient extends BotClient {
  public data = botDB

  constructor() {
    super('first')
  }
}

new FirstClient().start(firstToken)

export type FirstClientData = FirstClient