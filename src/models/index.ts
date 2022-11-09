import { model, Schema } from "mongoose";
import { prop, getModelForClass } from "@typegoose/typegoose"
import { BotLogs, DataBot } from "../types";

//? Bot db
class PCEMbot {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public logs: BotLogs

  @prop({type: Object, required: true})
  autoModeration: {
    ignoreCategories: string[]
    ignoreChannels: string[]
  }
}

export const botModel = getModelForClass(PCEMbot)

//? Sistema de alianzas
class Alianzas {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: String, required: true})
  public canalID: string

  @prop({type: Array,required: true})
  public miembros: {
    id: string
    tag: string
    cantidad: number
  }[]

  @prop({type: Array, required: true})
  public servidores: {
    id: string
    nombre: string
    tiempo: number
    miembros: number | null
    invitacion: string
  }[]
}
export const alliancesModel = getModelForClass(Alianzas)

//? Sistema de sugerencias
class Sugerencias {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public sugerencias: {
    cantidad: number
    aceptadas: number
    denegadas: number
    implementadas: number
    en_progreso: number
    no_sucedera: number
  }

  @prop({type: Array,required: true})
  public mensajes: {
    id: string
    origenID: string
    autorID: string
    sugerencia: string
    estado: string
    positivas: number
    negativas: number
  }[]

  @prop({type: Array, required: true})
  public miembros: {
    id: string
    sugerencias: number
    aceptadas: number
    denegadas: number
  }[]
}
export const suggestionsModel = getModelForClass(Sugerencias)

//? Carcél 
class Carcel {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Number, required: true})
  public cantidad: number

  @prop({type: Array, required: true})
  public prisioneros: {
    id: string
    tag: string
    razon: string
    condena: string
    tiempo: number
  }[]
}
export const carcelModel = getModelForClass(Carcel)

//? Sistema de tickets
export const ticketsModel = model("Tickets", new Schema({
  _id: {type: String, required: true},
  datos: {type: Object, required: true},
  tickets: {type: Array, required: true},
  miembros: {type: Array, required: true}
}))

//? Sistema de invitaciones
class Ivitaciones {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public datos: {
    roles: {
      id: string
      invitaciones: number
    }[]
  }

  @prop({type: Array, required: true})
  public miembros: {
    id: string
    tag: string
    verdaderas: number
    totales: number
    restantes: number
    falsas: number
    tiempo: number | null
    codes: {
      code: string
      usos: number
    }[]
    invitados: {
      id: string
      tag: string
      miembro: boolean
    }[]
  }[]
}
export const invitesModel = getModelForClass(Ivitaciones)

//? Historial del personal
class Personal {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public datos: {
    rolID: string,
    roles: string[],
    canalRegistro: string
  }

  @prop({type: Array, required: true})
  public personal: {
    id: string,
    tag: string,
    rango: number,
    miembro: boolean,
    historial: {
      fecha: number,
      accion: string
    }[]
  }[]
}
export const personalModel = getModelForClass(Personal)

//? Sistema de sorteos
class Sorteos {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public datos: {
    rolID: string
    emojiID: string
  }

  @prop({type: Array, required: true})
  public sorteos: {
    id: string
    canalID: string
    finaliza: number
    ganadores: number
    autorID: string
    creado: number
    activo: boolean
    participantes: string[]
  }[]
}
export const rafflesModel = getModelForClass(Sorteos)

//? Sistema de encuestas
class Encuestas {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public datos: {
    rolID: string
    emojis: string[]
  }

  @prop({type: Array, required: true})
  public encuestas: {
    id: string
    canalID: string
    autorID: string
    finaliza: number
    creado: number
    activa: boolean
    opciones: {
      emoji: string
      opcion: string
      votos: number
    }[]
  }[]
}
export const surveysModel = getModelForClass(Encuestas)

//? ColaboradoresDB
class Colaboradores {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public datos: {
    categoriaID: string
    rolID: string
  }

  @prop({type: Array, required: true})
  public colaboradores: {
    id: string
    tag: string
    canalID: string
    fecha: number
    tiempo: number | boolean
    colaborador: boolean
    notificado: boolean
  }[]
}
export const collaboratorsModel = getModelForClass(Colaboradores, {options: {disablePluginsOnDiscriminator: true}})

//? Sistema de promo-nvl
class PromoNvl {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public datos: {
    canalID: string
  }

  @prop({type: Array, required: true})
  public miembros: {
    id: string
    tag: string
    tiempo: number | null 
    notificado: boolean
  }[]
}
export const promoLevelModel = getModelForClass(PromoNvl, {options: {disablePluginsOnDiscriminator: true}})