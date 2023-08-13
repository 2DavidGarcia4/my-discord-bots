"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextCommand = exports.ContextCommand = exports.SlashCommand = exports.exemptMessagesIds = exports.modDb = void 0;
const config_1 = require("../config");
const client_1 = require("./client");
exports.modDb = [];
exports.exemptMessagesIds = [];
class SlashCommand {
    constructor(struct, guildsIds, description) {
        this.struct = struct;
        this.guildsIds = guildsIds;
        this.description = description;
    }
}
exports.SlashCommand = SlashCommand;
class ContextCommand {
    constructor(struct, guildsIds) {
        this.struct = struct;
        this.guildsIds = guildsIds;
    }
}
exports.ContextCommand = ContextCommand;
class TextCommand {
    constructor(options) {
        this.name = options.name;
        this.aliases = options.aliases;
        this.users = options.users;
    }
}
exports.TextCommand = TextCommand;
//? Start
new client_1.PepeFrogClient().start(config_1.pepeFrog);
