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
const functions_1 = require("./utils/functions");
const Frog = new discord_js_1.Client({ intents: 131071 });
Frog.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(((_a = Frog.user) === null || _a === void 0 ? void 0 : _a.username) + ' Estoy listo');
    (0, functions_1.setGuildStatus)(Frog);
    setInterval(() => {
        (0, functions_1.setGuildStatus)(Frog);
    }, 60 * 60 * 1000);
    (_c = (yield ((_b = Frog.application) === null || _b === void 0 ? void 0 : _b.commands.fetch()))) === null || _c === void 0 ? void 0 : _c.forEach((cmd) => __awaiter(void 0, void 0, void 0, function* () {
        yield cmd.delete().then(c => console.log(`Comando ${c.name} eliminado`));
    }));
}));
Frog.login(config_1.pepeFrog);
