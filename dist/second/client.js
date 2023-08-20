"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondClient = void 0;
const data_1 = require("./data");
const classes_1 = require("../shared/classes");
class SecondClient extends classes_1.BotClient {
    constructor() {
        super('second');
        this.data = data_1.FrogDb;
        this.modDb = [];
        this.exemptMessagesIds = [];
    }
}
exports.SecondClient = SecondClient;
