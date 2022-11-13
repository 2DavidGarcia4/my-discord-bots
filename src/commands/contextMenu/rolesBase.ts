import { ContextMenuCommandBuilder, UserContextMenuCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { botDB } from "../../db";
import { estadisticas } from "../..";
import { sendMessageSlash } from "../../utils/functions";

export const rolesBaseCmcb = new ContextMenuCommandBuilder()
.setName('Roles base')
.setType(2)

export const rolesBaseContextMenu = async (int: UserContextMenuCommandInteraction<CacheType>) => {
  const { guild, user, targetId } = int, author = guild?.members.cache.get(user.id), { mainRoles } = botDB

  estadisticas.comandos++
  const member = guild?.members.cache.get(targetId)
  if(!member) return
  await int.deferReply({ephemeral: true})

  const rolesBaseEb = new EmbedBuilder()
  .setAuthor({name: author?.nickname || author?.user.username || 'undefined', iconURL: author?.displayAvatarURL()})
  .setTitle('🔁 Roles base')
  .setColor(guild?.members.me?.displayHexColor || 'White')
  .setTimestamp()
  
  if(mainRoles.some(s=>  !member.roles.cache.has(s)) && !member.user.bot){
    rolesBaseEb
    .setDescription(`Roles base agregados al miembro ${member}\n\n${mainRoles.filter(f=> !member.roles.cache.has(f)).map(m=> `<@&${m}>`).join(', ')}`)
    member.roles.add(mainRoles)
    
  }else{
    rolesBaseEb
    .setDescription(`Los roles base son los roles que se te otorgan al entrar al servidor, estos roles funcionan como separadores de otros roles y te identifican como miembro.\n\n${guild?.roles.cache.filter(f=> mainRoles.some(s=> s==f.id)).sort((a, b)=> b.position - a.position).map(m=> `**<@&${m.id}>**`).join('\n')}`)
  }
  sendMessageSlash(int, {embeds: [rolesBaseEb]})
}