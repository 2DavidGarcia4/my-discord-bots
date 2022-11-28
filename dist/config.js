"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = exports.tokenBot = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.tokenBot = process.env.TOKEN_BOT, exports.connectMongo = process.env.CONNECT_MONGO;
