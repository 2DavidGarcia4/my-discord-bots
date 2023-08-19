import { connect } from 'mongoose'
import { connectMongo } from './config'

connect(connectMongo || '').then(()=> console.log('🟢 Conectado corectamente a la base de datos'))
.catch((err)=> console.error('🔴 Ocurrió un error al conectarse a la DB', err))