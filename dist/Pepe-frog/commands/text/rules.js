"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../lib/services");
const __1 = require("../..");
class RulesCommand extends __1.TextCommand {
    constructor() {
        super({ name: 'rules' });
    }
    async execute({ message: msg, client }) {
        const description = await (0, services_1.getInfoMessage)({
            client,
            channelId: '1139620584750334052',
            language: 'es'
        }) + '';
        (0, services_1.defaultInfoMessageBody)(msg, {
            title: '📖 Reglas',
            description,
            name: 'rules'
        });
    }
}
exports.default = RulesCommand;
