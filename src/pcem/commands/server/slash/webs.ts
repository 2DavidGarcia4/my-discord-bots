import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import { sendMessageSlash } from "../../../../shared/functions";

export const websScb = new SlashCommandBuilder()
.setName(`webs`)
.setDescription(`🔗 Paginas webs en las que se encuentra publicado el servidor.`).toJSON()

export const websSlashCommand = async (int: ChatInputCommandInteraction<CacheType>) => {
  await int.deferReply()

  const webEb = new EmbedBuilder()
  .setTitle(`Webs en las que se encuentra publicado el servidor`)
  .setDescription(`Si quieres apoyarnos a seguir creciendo lo puedes hacer entrando en alguna de estas paginas botar positivamente por el servidor, hacer un comentario positivo o bumpear el servidor.`)
  .addFields(
    {name: `📑 **Paginas:**`, value: `<:Disboard:977371613551022080> [Disboard](https://disboard.org/es/server/773249398431809586)\n<:discordio:977378649286250516> [Discord.io](https://discord.io/PCEM+)\n<:DS:977373209513037824> [Discord Servers](https://discordservers.com/server/773249398431809586)\n<:topgg:977371924483145728> [Top.gg](https://top.gg/servers/773249398431809586)\n<:Discords:977376832296984616> [Discords](https://discords.com/servers/773249398431809586)\n<:discordts:977376924080947251> [Discord.ts](https://discord.st/server/promociones-cem/)`}
  )
  .setColor(int.guild?.members.me?.displayHexColor || 'White')

  sendMessageSlash(int, {embeds: [webEb]})
}