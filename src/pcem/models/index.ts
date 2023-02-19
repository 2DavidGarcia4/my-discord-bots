import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose"

//? Sistema de alianzas
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Alliances {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Array,required: true})
  public members: {
    id: string
    tag: string
    amount: number
  }[]

  @prop({type: Array, required: true})
  public servers: {
    id: string
    name: string
    time: number
    members: number | null
    invitation: string
  }[]
}
export const alliancesModel = getModelForClass(Alliances)

//? Carcél 
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Carcel {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Array, required: true})
  public prisoners: {
    id: string
    tag: string
    time: number
    reazon: string
    sentence: string
  }[]
}
export const carcelModel = getModelForClass(Carcel)


//? Raffles system
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Raffles {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public data: {
    rolId: string
    emojiId: string
  }

  @prop({type: Array, required: true})
  public raffles: {
    id: string
    channelId: string
    ends: number
    winners: number
    authorId: string
    createdAt: number
    active: boolean
    participants: string[]
  }[]
}
export const rafflesModel = getModelForClass(Raffles)

//? Surveys system
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Surveys {
  @prop({type: String, required: true})
  public _id: string

  @prop({type: Object, required: true})
  public data: {
    rolId: string
    emojis: string[]
  }

  @prop({type: Array, required: true})
  public surveys: {
    id: string
    channelId: string
    authorId: string
    ends: number
    createdAt: number
    active: boolean
    options: {
      emoji: string
      option: string
      votes: number
    }[]
  }[]
}
export const surveysModel = getModelForClass(Surveys)
