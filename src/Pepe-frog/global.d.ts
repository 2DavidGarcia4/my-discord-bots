import { ClientEvents } from "discord.js";
import { PepeFrogClient, PepeFrogClient } from "./client";

declare global {
  type EventName = keyof ClientEvents
  type ExtendClient = PepeFrogClient  
}