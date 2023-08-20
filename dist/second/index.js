"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const client_1 = require("./client");
//? Start
new client_1.SecondClient().start(config_1.secondToken);
