import { Client } from "discord.js";
import { pepeFrog } from "../config";
import { setGuildStatus } from "./utils/functions";

const Frog = new Client({intents: 131071})

Frog.on('ready', async () => {
  console.log(Frog.user?.username+' Estoy listo')

  setGuildStatus(Frog)
  setInterval(()=> {
    setGuildStatus(Frog)

  }, 60*60*1000)

  ;(await Frog.application?.commands.fetch())?.forEach(async cmd=> {
    await cmd.delete().then(c=> console.log(`Comando ${c.name} eliminado`))
  })
})

Frog.login(pepeFrog)