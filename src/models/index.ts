import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { SchemaTypes } from 'mongoose'

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

@modelOptions({options: {allowMixed: Severity.ALLOW}})
class SnackFiles {
  @prop({type: String, required: true})
  public url: string

  @prop({type: String, required: true})
  public name: string

  @prop([{type: SchemaTypes.ObjectId, required: true}])
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
export const SnackFilesModel = getModelForClass(SnackFiles, {
  schemaOptions: {
    timestamps: true
  }
})

@modelOptions({options: {allowMixed: Severity.ALLOW}})
class SnackFileCategories {
  @prop({type: String, required: true})
  public name: string
}
export const SnackFileCategoriesModel = getModelForClass(SnackFileCategories, {
  schemaOptions: {
    timestamps: true
  }
})

@modelOptions({options: {allowMixed: Severity.ALLOW}})
class SnackFileTypes {
  @prop({type: String, required: true})
  public name: string
}
export const SnackFileTypesModel = getModelForClass(SnackFileTypes)

@modelOptions({options: {allowMixed: Severity.ALLOW}})
class SnackFileExtensions {
  @prop({type: String, required: true})
  public name: string
}
export const SnackFileExtensionsModel = getModelForClass(SnackFileExtensions)
