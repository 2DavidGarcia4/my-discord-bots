import { secondToken } from '../config'
import { SecondClient } from './client'

export type SecondClientData = SecondClient 

//? Start
new SecondClient().start(secondToken)