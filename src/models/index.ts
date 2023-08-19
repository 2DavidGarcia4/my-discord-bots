import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'

//? Verifieds
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Verifieds {
  @prop({type: String, required: true})
  public userId: string

  @prop({type: Boolean, required: true})
  public ping: boolean

  @prop({type: Number})
  public pinedAt?: number

  @prop({type: String, required: true})
  public channelId: string

  @prop({type: Number, required: true})
  public verifiedAt: number

  @prop({type: Number})
  public lastMentionAt?: number

  @prop({type: Boolean, required: true})
  public contentHidden: boolean

  @prop({type: Boolean, required: true})
  public channelHidden: boolean

  @prop({type: Number})
  public lastActivityAt?: number
}

export const VerifiedsModel = getModelForClass(Verifieds)