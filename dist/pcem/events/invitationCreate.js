"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationCreateEvent = void 0;
const db_1 = require("../db");
const invitationCreateEvent = async (invite, client) => {
    const { serverId } = db_1.botDB;
    if (invite.guild?.id != serverId)
        return;
};
exports.invitationCreateEvent = invitationCreateEvent;
