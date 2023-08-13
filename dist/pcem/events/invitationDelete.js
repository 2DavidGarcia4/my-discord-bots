"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationDeleteEvent = void 0;
const db_1 = require("../db");
const invitationDeleteEvent = async (invite, client) => {
    const { serverId } = db_1.botDB;
    if (invite.guild?.id != serverId)
        return;
};
exports.invitationDeleteEvent = invitationDeleteEvent;
