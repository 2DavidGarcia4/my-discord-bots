import { Client } from "discord.js";
import { pepeFrog } from "../config";
import { readyEvent } from "./events/ready";
import { interactionCreateEvent } from "./events/interactionCreate";
import { messageCreateEvent } from "./events/messageCreate";

const Frog = new Client({intents: 131071})

Frog.on('ready', async () => {
  readyEvent(Frog)
})

Frog.on('messageCreate', (message) => {
  messageCreateEvent(message, Frog)
})

Frog.on('interactionCreate', (interaction) => {
  interactionCreateEvent(interaction, Frog)
})

Frog.login(pepeFrog)