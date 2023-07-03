"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenuCommands = exports.SlashCommands = exports.CommandBodys = void 0;
const move_1 = __importDefault(require("./slash/move"));
const verified_1 = __importDefault(require("./slash/verified"));
const delete_1 = __importDefault(require("./contextMenu/delete"));
const deleteReactions_1 = __importDefault(require("./contextMenu/deleteReactions"));
const send_1 = __importDefault(require("./contextMenu/send"));
exports.CommandBodys = [
    move_1.default.Command,
    verified_1.default.Command,
    delete_1.default.Command,
    deleteReactions_1.default.Command,
    send_1.default.Command
];
exports.SlashCommands = [
    move_1.default,
    verified_1.default
];
exports.ContextMenuCommands = [
    delete_1.default,
    deleteReactions_1.default,
    send_1.default
];
