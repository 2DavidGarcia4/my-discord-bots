"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGuildStatus = void 0;
const db_1 = require("../db");
const getCategoryChannels = (id, server) => {
    return server === null || server === void 0 ? void 0 : server.channels.cache.filter(f => f.parentId == id).size.toLocaleString();
};
const setGuildStatus = (client) => {
    const snackServer = client.guilds.cache.get(db_1.frogDb.serverId);
    const online = snackServer === null || snackServer === void 0 ? void 0 : snackServer.members.cache.filter(f => { var _a, _b, _c, _d; return ((_a = f.presence) === null || _a === void 0 ? void 0 : _a.status) == 'dnd' || ((_b = f.presence) === null || _b === void 0 ? void 0 : _b.status) == 'idle' || ((_c = f.presence) === null || _c === void 0 ? void 0 : _c.status) == 'online' || ((_d = f.presence) === null || _d === void 0 ? void 0 : _d.status) == 'invisible'; }).size;
    const allMembers = snackServer === null || snackServer === void 0 ? void 0 : snackServer.memberCount, nsfwChannels = getCategoryChannels('1053401638494289931', snackServer);
    const vipChannels = getCategoryChannels('1054485238413266965', snackServer);
    const packChannels = getCategoryChannels('1061436779707773070', snackServer);
    const onlineName = `🟢│en linea: ${online === null || online === void 0 ? void 0 : online.toLocaleString()}`, membersName = `👥│todos: ${allMembers === null || allMembers === void 0 ? void 0 : allMembers.toLocaleString()}`, nsfwName = `🔞│NSFW canales: ${nsfwChannels}`, vipName = `🌟│VIP canales: ${vipChannels}`, packName = `📂│Packs canales: ${packChannels}`;
    const onlineChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426402361352269');
    const membersChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426454538493993');
    const nsfwChanel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1053426479607849112');
    const vipCahnnel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1072305855447441428');
    const packChannel = snackServer === null || snackServer === void 0 ? void 0 : snackServer.channels.cache.get('1072325996314902660');
    if ((onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.name) != onlineName)
        onlineChanel === null || onlineChanel === void 0 ? void 0 : onlineChanel.edit({ name: onlineName });
    if ((membersChanel === null || membersChanel === void 0 ? void 0 : membersChanel.name) != membersName)
        membersChanel === null || membersChanel === void 0 ? void 0 : membersChanel.edit({ name: membersName });
    if ((nsfwChanel === null || nsfwChanel === void 0 ? void 0 : nsfwChanel.name) != nsfwName)
        nsfwChanel === null || nsfwChanel === void 0 ? void 0 : nsfwChanel.edit({ name: nsfwName });
    if ((vipCahnnel === null || vipCahnnel === void 0 ? void 0 : vipCahnnel.name) != nsfwName)
        vipCahnnel === null || vipCahnnel === void 0 ? void 0 : vipCahnnel.edit({ name: vipName });
    if ((packChannel === null || packChannel === void 0 ? void 0 : packChannel.name) != nsfwName)
        packChannel === null || packChannel === void 0 ? void 0 : packChannel.edit({ name: packName });
};
exports.setGuildStatus = setGuildStatus;
