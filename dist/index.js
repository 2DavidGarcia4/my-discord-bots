"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextCommand = exports.ContextCommand = exports.SlashCommand = void 0;
require("./db");
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
    constructor(struct) {
        this.struct = struct;
    }
}
exports.TextCommand = TextCommand;
require("./first");
require("./second");
