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
exports.roleUpdateEvent = void 0;
const __1 = require("..");
const db_1 = require("../db");
function roleUpdateEvent(oldRole, newRole) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { serverId, principalServerId } = db_1.FrogDb;
        if (oldRole.guild.id != serverId)
            return;
        const principalServer = __1.Frog.guilds.cache.get(principalServerId);
        (_a = principalServer === null || principalServer === void 0 ? void 0 : principalServer.roles.cache.find(f => f.name == oldRole.name)) === null || _a === void 0 ? void 0 : _a.edit({ name: newRole.name, color: newRole.color, permissions: newRole.permissions, hoist: newRole.hoist, mentionable: newRole.mentionable });
    });
}
exports.roleUpdateEvent = roleUpdateEvent;
