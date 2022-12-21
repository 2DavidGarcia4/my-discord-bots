"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.pepeFrog = exports.connectMongo = exports.tokenBot = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.tokenBot = process.env.TOKEN_BOT, exports.connectMongo = process.env.CONNECT_MONGO, exports.pepeFrog = process.env.PEPE_FROG, exports.isDevelopment = process.env.DEVELOPMENT;
