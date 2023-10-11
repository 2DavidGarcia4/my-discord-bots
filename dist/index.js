"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextCommand = exports.ContextCommand = exports.SlashCommand = exports.BotEvent = void 0;
require("./db");
class BotEvent {
    constructor(name, isOnce) {
        this.name = name;
        this.isOnce = isOnce;
    }
}
exports.BotEvent = BotEvent;
class SlashCommand {
    constructor({ struct, guildsIds, description }) {
        this.struct = struct;
        this.guildsIds = guildsIds;
        this.description = description;
    }
}
exports.SlashCommand = SlashCommand;
class ContextCommand {
    constructor({ struct, guildsIds }) {
        this.struct = struct;
        this.guildsIds = guildsIds;
    }
}
exports.ContextCommand = ContextCommand;
class TextCommand {
    constructor(struct) {
        this.struct = struct;
    }
}
exports.TextCommand = TextCommand;
process.on("unhandledRejection", async (reason, promise) => {
    console.log(reason);
    promise.then(pr => console.error('Promise: ', pr))
        .catch(er => console.error('Promise error: ', er));
});
// import './first'
require("./second");
