"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const ready_1 = require("./events/ready");
const interactionCreate_1 = require("./events/interactionCreate");
const messageCreate_1 = require("./events/messageCreate");
const Frog = new discord_js_1.Client({ intents: 131071 });
Frog.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    (0, ready_1.readyEvent)(Frog);
}));
Frog.on('messageCreate', (message) => {
    (0, messageCreate_1.messageCreateEvent)(message, Frog);
});
Frog.on('interactionCreate', (interaction) => {
    (0, interactionCreate_1.interactionCreateEvent)(interaction, Frog);
});
Frog.login(config_1.pepeFrog);
