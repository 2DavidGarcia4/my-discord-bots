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
exports.memberRemoveEvent = void 0;
const db_1 = require("../db");
const memberRemoveEvent = (member, client) => __awaiter(void 0, void 0, void 0, function* () {
    const { serverId } = db_1.frogDb;
    if (member.guild.id != serverId)
        return;
    db_1.frogDb.leaves++;
});
exports.memberRemoveEvent = memberRemoveEvent;
