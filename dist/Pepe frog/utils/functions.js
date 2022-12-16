"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGuildStatus = void 0;
const db_1 = require("../db");
const setGuildStatus = (client) => {
    const snackServer = client.guilds.cache.get(db_1.frogDb.serverId);
    const online = snackServer === null || snackServer === void 0 ? void 0 : snackServer.members.cache.filter(f => { var _a, _b, _c, _d; return ((_a = f.presence) === null || _a === void 0 ? void 0 : _a.status) == 'dnd' || ((_b = f.presence) === null || _b === void 0 ? void 0 : _b.status) == 'idle' || ((_c = f.presence) === null || _c === void 0 ? void 0 : _c.status) == 'online' || ((_d = f.presence) === null || _d === void 0 ? void 0 : _d.status) == 'invisible'; }).size;
    const allMembers = snackServer === null || snackServer === void 0 ? void 0 : snackServer.memberCount, nsfwChannels = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.filter(f => f.parentId == '1053401638494289931').size;
    const onlineChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426402361352269');
    const membersChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426454538493993');
    const nsfwChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426479607849112');
    const onlineName = `🟢│en linea: ${online === null || online === void 0 ? void 0 : online.toLocaleString()}`, membersName = `👥│todos: ${allMembers === null || allMembers === void 0 ? void 0 : allMembers.toLocaleString()}`, nsfwName = `🔞│canales nsfw: ${nsfwChannels}`;
    if ((onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.name) != onlineName)
        onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.edit({ name: onlineName });
    if ((onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.name) != membersName)
        membersChanel === null || membersChanel === void 0 ? void 0 : membersChanel.edit({ name: membersName });
    if ((onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.name) != nsfwName)
        nsfwChanel === null || nsfwChanel === void 0 ? void 0 : nsfwChanel.edit({ name: nsfwName });
};
exports.setGuildStatus = setGuildStatus;
