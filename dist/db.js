"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
(0, mongoose_1.connect)(config_1.connectMongo || '').then(() => console.log('🟢 Conectado corectamente a la base de datos'))
    .catch((err) => console.error('🔴 Ocurrió un error al conectarse a la DB', err));
