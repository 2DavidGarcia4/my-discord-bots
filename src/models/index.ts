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

@modelOptions({options: {allowMixed: Severity.ALLOW}})
class SnackFiles {
  @prop({type: String, required: true})
  public fileUrl: string

  @prop([{type: String, required: true}])
  public categories: string[]

  @prop({type: String, required: true})
  public type: string

  @prop({type: Number, required: true})
  public size: number

  @prop({type: Number})
  public width: number

  @prop({type: Number})
  public height: number
}

@modelOptions({options: {allowMixed: Severity.ALLOW}})
class snackFileCategories {
  @prop({type: String, required: true})
  public name: string
}

export const VerifiedsModel = getModelForClass(Verifieds)
export const SnackFilesModel = getModelForClass(SnackFiles, {
  schemaOptions: {
    timestamps: true
  }
})
export const SnackFileCategoriesModel = getModelForClass(snackFileCategories, {
  schemaOptions: {
    timestamps: true
  }
})
