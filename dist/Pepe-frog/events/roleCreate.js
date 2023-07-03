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
exports.roleCreateEvent = void 0;
const db_1 = require("../db");
const roleCreateEvent = (role, client) => __awaiter(void 0, void 0, void 0, function* () {
    const { serverId, principalServerId } = db_1.FrogDb;
    if (role.guild.id != serverId)
        return;
    const principalServer = client.guilds.cache.get(principalServerId);
    principalServer === null || principalServer === void 0 ? void 0 : principalServer.roles.create({ name: role.name, permissions: role.permissions });
});
exports.roleCreateEvent = roleCreateEvent;
