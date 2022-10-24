import { ChannelType, Client, DMChannel, NonThreadGuildBasedChannel } from "discord.js";
import { botDB } from "../db";
import { ticketsModel } from "../models";


export const channelDeleteEvent = async (cd: DMChannel |NonThreadGuildBasedChannel, client: Client) => {
  if(cd.type == ChannelType.DM) return;
  if(cd.guildId != botDB.serverId) return;
  

  const dataTs = await ticketsModel.findById(botDB.serverId), arrayTs = dataTs?.tickets, objetoDs = dataTs?.datos, servidor2 = client.guilds.cache.get('949860813915705354')
  const descripcion = cd.type == ChannelType.GuildText ? cd.topic?.split(' ') : '', numberTicket = cd.name.match(/(\d+)/g)?.pop()

  if(dataTs?.tickets.some(s=>s.id == cd.id) && servidor2 && descripcion){
    descripcion[0] = botDB.emoji.negative
    let ticket = arrayTs?.find(f=> f.id == cd.id), canalesCategoria = servidor2.channels.cache.filter(f=> f.parentId == objetoDs.categoriaID), categoria = servidor2.channels.cache.get(objetoDs.categoriaID)
    
    if(canalesCategoria.size==50){
      servidor2.channels.create({name: `📚 Grupo de tickets ${Number(categoria?.name.match(/(\d+)/g)?.pop())+1}`, type: ChannelType.GuildDirectory}).then(async newCategory=>{
        setTimeout(async ()=>{
          if(categoria?.type == ChannelType.GuildCategory) newCategory.edit({position: categoria?.position})
        }, 4000)

        await ticketsModel.findByIdAndUpdate(botDB.serverId, {datos: objetoDs, tickets: arrayTs})
        servidor2.channels.cache.get(ticket.copiaID)?.edit({name: `『🔒』ticket ${numberTicket} eliminado`, parent: objetoDs.categoriaID, position: 0, topic: `${descripcion.join(" ").replace(".", " ").concat(" *eliminado*.")}`})
      })

    }else{
      servidor2.channels.cache.get(ticket.copiaID)?.edit({name: `『🔒』ticket ${numberTicket} eliminado`, parent: objetoDs.categoriaID, topic: `${descripcion.join(" ").replace(".", " ").concat(" *eliminado*.")}`}).then(async tc=>{
        const numTicket = Number(tc.name.match(/(\d+)/g)?.pop())
        let posicion = servidor2.channels.cache.filter(f=> f.parentId==objetoDs.categoriaID && Number(f.name.match(/(\d+)/g)?.pop()) < numTicket).map(m=> {
          const positionCat = m.type == ChannelType.GuildCategory ? m.position : 1
          return Object({pos: positionCat, num: Number(m.name.match(/(\d+)/g)?.pop())})
        }).sort((a,b)=> a.num - b.num).pop().pos

        setTimeout(()=> {
          tc.edit({position: posicion})
        }, 4000)
      })
    }

    arrayTs?.splice(arrayTs?.findIndex(f=> f.id == cd.id), 1)
    await ticketsModel.findByIdAndUpdate(botDB.serverId, {datos: objetoDs, tickets: arrayTs})
  }
}