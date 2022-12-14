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
exports.messageCreateEvent = void 0;
const db_1 = require("../db");
const eval_1 = require("../commands/text/eval");
const roles_1 = require("../commands/text/roles");
const rules_1 = require("../commands/text/rules");
const girls_1 = require("../commands/text/girls");
const messageCreateEvent = (msg, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { prefix } = db_1.frogDb;
    if (msg.author.bot || !msg.content.toLowerCase().startsWith(prefix))
        return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.permissions.has('Administrator')) {
        if (command == 'eval')
            (0, eval_1.evalCommand)(msg, client, args.join(' '));
        if (command == 'rules')
            (0, rules_1.rulesCommand)(msg);
        if (command == 'roles')
            (0, roles_1.rolesCommand)(msg);
        if (command == 'girls')
            (0, girls_1.girlsCommand)(msg);
    }
});
exports.messageCreateEvent = messageCreateEvent;
