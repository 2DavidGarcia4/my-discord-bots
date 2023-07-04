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
exports.memberUpdateEvent = void 0;
const __1 = require("..");
const db_1 = require("../db");
const functions_1 = require("../utils/functions");
function memberUpdateEvent(oldMember, newMember) {
    return __awaiter(this, void 0, void 0, function* () {
        if (oldMember.guild.id != db_1.FrogDb.serverId)
            return;
        if (oldMember.permissions.has('ManageGuild'))
            return;
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;
        if (newRoles.has(db_1.FrogDb.roles.verified) && !oldRoles.has(db_1.FrogDb.roles.verified)) {
            console.log('Rol agregado');
            (0, functions_1.createVerified)(__1.Frog, { id: oldMember.id });
        }
        else if (oldRoles.has(db_1.FrogDb.roles.verified) && !newRoles.has(db_1.FrogDb.roles.verified)) {
            console.log('Rol eliminado');
        }
    });
}
exports.memberUpdateEvent = memberUpdateEvent;
