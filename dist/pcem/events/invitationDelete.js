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
exports.invitationDeleteEvent = void 0;
const db_1 = require("../db");
const invitationDeleteEvent = (invite, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { serverId } = db_1.botDB;
    if (((_a = invite.guild) === null || _a === void 0 ? void 0 : _a.id) != serverId)
        return;
});
exports.invitationDeleteEvent = invitationDeleteEvent;
