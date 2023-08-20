"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inDevelopment = exports.notionToken = exports.secondToken = exports.firstToken = exports.connectMongo = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.connectMongo = process.env.CONNECT_MONGO, exports.firstToken = process.env.FIRST_BOT_TOKEN, exports.secondToken = process.env.SECOND_BOT_TOKEN, exports.notionToken = process.env.NOTION_TOKEN, exports.inDevelopment = process.env.DEVELOPMENT;
