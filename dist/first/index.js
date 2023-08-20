"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const config_1 = require("../config");
const classes_1 = require("../shared/classes");
class FirstClient extends classes_1.BotClient {
    constructor() {
        super('first');
        this.data = data_1.botDB;
    }
}
new FirstClient().start(config_1.firstToken);
